import { Router, Request, Response } from 'express';
import { db } from '../db/connection';
import { Fixture, FixtureFilters, PaginationParams, PaginatedResponse } from '../types';

const router = Router();

// Helper function for pagination
function getPaginationParams(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
    Math.max(1, parseInt(req.query.limit as string, 10) || parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10))
  );
  return { page, limit };
}

// GET /fixtures - List all fixtures with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const offset = (page - 1) * limit;

    // Build filter conditions
    const filters: FixtureFilters = {
      manufacturer_id: req.query.manufacturer_id as string,
      fixture_type_id: req.query.fixture_type_id as string,
      light_source_type: req.query.light_source_type as string,
      color_mixing_type: req.query.color_mixing_type as string,
      discontinued: req.query.discontinued === 'true',
      search: req.query.search as string,
    };

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters.manufacturer_id) {
      whereClause += ` AND f.manufacturer_id = $${paramCount++}`;
      params.push(filters.manufacturer_id);
    }

    if (filters.fixture_type_id) {
      whereClause += ` AND f.fixture_type_id = $${paramCount++}`;
      params.push(filters.fixture_type_id);
    }

    if (filters.light_source_type) {
      whereClause += ` AND f.light_source_type ILIKE $${paramCount++}`;
      params.push(`%${filters.light_source_type}%`);
    }

    if (filters.color_mixing_type) {
      whereClause += ` AND f.color_mixing_type ILIKE $${paramCount++}`;
      params.push(`%${filters.color_mixing_type}%`);
    }

    // Only filter by discontinued if explicitly requested
    if (req.query.discontinued !== undefined) {
      whereClause += ` AND f.discontinued = $${paramCount++}`;
      params.push(filters.discontinued);
    }

    if (filters.search) {
      whereClause += ` AND (f.name ILIKE $${paramCount} OR f.description ILIKE $${paramCount} OR m.name ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM fixtures f
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      ${whereClause}
    `;
    const countResult = await db.one(countQuery, params);
    const total = parseInt(countResult.total, 10);

    // Get paginated data
    const dataQuery = `
      SELECT 
        f.*,
        json_build_object(
          'id', m.id,
          'name', m.name,
          'slug', m.slug,
          'country', m.country
        ) as manufacturer,
        json_build_object(
          'id', ft.id,
          'name', ft.name,
          'slug', ft.slug,
          'category', json_build_object(
            'id', fc.id,
            'name', fc.name,
            'slug', fc.slug
          )
        ) as fixture_type
      FROM fixtures f
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      LEFT JOIN fixture_categories fc ON ft.category_id = fc.id
      ${whereClause}
      ORDER BY f.name ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(limit, offset);

    const fixtures = await db.any(dataQuery, params);

    const response: PaginatedResponse<Fixture> = {
      data: fixtures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// GET /fixtures/:id - Get a single fixture by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        f.*,
        json_build_object(
          'id', m.id,
          'name', m.name,
          'slug', m.slug,
          'website', m.website,
          'country', m.country
        ) as manufacturer,
        json_build_object(
          'id', ft.id,
          'name', ft.name,
          'slug', ft.slug,
          'category', json_build_object(
            'id', fc.id,
            'name', fc.name,
            'slug', fc.slug
          )
        ) as fixture_type,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', fi.id,
              'image_url', fi.image_url,
              'alt_text', fi.alt_text,
              'is_primary', fi.is_primary,
              'display_order', fi.display_order
            )
          ) FILTER (WHERE fi.id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', feat.id,
              'name', feat.name,
              'slug', feat.slug,
              'category', feat.category
            )
          ) FILTER (WHERE feat.id IS NOT NULL),
          '[]'
        ) as features
      FROM fixtures f
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      LEFT JOIN fixture_categories fc ON ft.category_id = fc.id
      LEFT JOIN fixture_images fi ON f.id = fi.fixture_id
      LEFT JOIN fixture_features ff ON f.id = ff.fixture_id
      LEFT JOIN features feat ON ff.feature_id = feat.id
      WHERE f.id = $1
      GROUP BY f.id, m.id, ft.id, fc.id
    `;

    const fixture = await db.oneOrNone(query, [id]);

    if (!fixture) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    return res.json(fixture);
  } catch (error) {
    console.error('Error fetching fixture:', error);
    return res.status(500).json({ error: 'Failed to fetch fixture' });
  }
});

// GET /fixtures/slug/:slug - Get a fixture by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT 
        f.*,
        json_build_object(
          'id', m.id,
          'name', m.name,
          'slug', m.slug,
          'website', m.website,
          'country', m.country
        ) as manufacturer,
        json_build_object(
          'id', ft.id,
          'name', ft.name,
          'slug', ft.slug,
          'category', json_build_object(
            'id', fc.id,
            'name', fc.name,
            'slug', fc.slug
          )
        ) as fixture_type,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', v.id,
                'name', v.name,
                'slug', v.slug,
                'city', v.city,
                'state_province', v.state_province,
                'country', v.country,
                'quantity', vi.quantity,
                'available_for_rental', vi.available_for_rental,
                'available_for_purchase', vi.available_for_purchase,
                'locations', (
                  SELECT json_agg(
                    json_build_object(
                      'id', vl.id,
                      'location_name', vl.location_name,
                      'is_headquarters', vl.is_headquarters,
                      'latitude', vl.latitude,
                      'longitude', vl.longitude,
                      'address_line1', vl.address_line1,
                      'city', vl.city,
                      'state_province', vl.state_province,
                      'country', vl.country,
                      'postal_code', vl.postal_code
                    )
                  )
                  FROM vendor_locations vl
                  WHERE vl.vendor_id = v.id
                )
              )
            )
            FROM vendor_inventory vi
            JOIN vendors v ON vi.vendor_id = v.id
            WHERE vi.fixture_id = f.id
          ),
          '[]'
        ) as vendors
      FROM fixtures f
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      LEFT JOIN fixture_categories fc ON ft.category_id = fc.id
      WHERE f.slug = $1
    `;

    const fixture = await db.oneOrNone(query, [slug]);

    if (!fixture) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    // Fetch endorsements for this fixture
    const endorsements = await db.any(`
      SELECT 
        fe.id,
        fe.fixture_id,
        fe.upvotes,
        fe.downvotes,
        fe.net_score,
        ec.name,
        ec.slug,
        ec.description,
        ec.icon,
        ec.is_positive
      FROM fixture_endorsements fe
      INNER JOIN fixture_endorsement_categories ec ON fe.category_id = ec.id
      WHERE fe.fixture_id = $1
      ORDER BY fe.net_score DESC, ec.is_positive DESC, ec.name
    `, [fixture.id]);

    return res.json({ ...fixture, endorsements });
  } catch (error) {
    console.error('Error fetching fixture:', error);
    return res.status(500).json({ error: 'Failed to fetch fixture' });
  }
});

// POST /fixtures/:slug/endorsements/:categorySlug/vote
router.post('/:slug/endorsements/:categorySlug/vote', async (req: Request, res: Response) => {
  const { slug, categorySlug } = req.params;
  const { voteType, sessionId } = req.body;

  if (!voteType || !sessionId) {
    return res.status(400).json({ error: 'voteType and sessionId are required' });
  }

  if (voteType !== 'up' && voteType !== 'down') {
    return res.status(400).json({ error: 'voteType must be "up" or "down"' });
  }

  try {
    // Get fixture and category IDs
    const fixture = await db.oneOrNone('SELECT id FROM fixtures WHERE slug = $1', [slug]);
    if (!fixture) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    const category = await db.oneOrNone('SELECT id FROM fixture_endorsement_categories WHERE slug = $1', [categorySlug]);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Create endorsement if it doesn't exist
    await db.none(`
      INSERT INTO fixture_endorsements (fixture_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (fixture_id, category_id) DO NOTHING
    `, [fixture.id, category.id]);

    const endorsement = await db.one(
      'SELECT id FROM fixture_endorsements WHERE fixture_id = $1 AND category_id = $2',
      [fixture.id, category.id]
    );

    // Insert or update vote
    await db.none(`
      INSERT INTO fixture_endorsement_votes (endorsement_id, session_id, vote_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (endorsement_id, session_id) 
      DO UPDATE SET vote_type = $3, updated_at = CURRENT_TIMESTAMP
    `, [endorsement.id, sessionId, voteType]);

    // Get updated endorsement data
    const updated = await db.one(`
      SELECT upvotes, downvotes, net_score
      FROM fixture_endorsements
      WHERE id = $1
    `, [endorsement.id]);

    return res.json(updated);
  } catch (error) {
    console.error('Error recording vote:', error);
    return res.status(500).json({ error: 'Failed to record vote' });
  }
});

// GET /fixtures/:slug/endorsement-categories
router.get('/:slug/endorsement-categories', async (req: Request, res: Response) => {
  try {
    const categories = await db.any(`
      SELECT id, name, slug, description, icon, is_positive
      FROM fixture_endorsement_categories
      ORDER BY is_positive DESC, name
    `);

    return res.json(categories);
  } catch (error) {
    console.error('Error fetching endorsement categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
