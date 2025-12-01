import { Router, Request, Response } from 'express';
import { db } from '../db/connection';
import { Vendor, PaginationParams, PaginatedResponse } from '../types';

const router = Router();

// GET /vendors/locations - Get all vendor locations (includes both rental houses and distributors)
router.get('/locations', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        vl.id,
        vl.vendor_id,
        v.name as vendor_name,
        v.slug as vendor_slug,
        vl.location_name,
        vl.is_headquarters,
        vl.latitude,
        vl.longitude,
        vl.address_line1,
        vl.city,
        vl.state_province,
        vl.country,
        vl.postal_code,
        vl.phone,
        vl.email,
        'Rental House' as vendor_type
      FROM vendor_locations vl
      INNER JOIN vendors v ON vl.vendor_id = v.id
      WHERE v.active = true
      UNION ALL
      SELECT 
        dl.id,
        dl.distributor_id as vendor_id,
        d.name as vendor_name,
        d.slug as vendor_slug,
        dl.location_name,
        dl.is_headquarters,
        dl.latitude,
        dl.longitude,
        dl.address_line1,
        dl.city,
        dl.state_province,
        dl.country,
        dl.postal_code,
        dl.phone,
        dl.email,
        'Distributor' as vendor_type
      FROM distributor_locations dl
      INNER JOIN distributors d ON dl.distributor_id = d.id
      WHERE d.active = true
      ORDER BY vendor_name, is_headquarters DESC, location_name
    `;

    const locations = await db.any(query);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching vendor locations:', error);
    // Return empty array if tables don't exist yet
    res.json([]);
  }
});

function getPaginationParams(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
    Math.max(1, parseInt(req.query.limit as string, 10) || parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10))
  );
  return { page, limit };
}

// GET /vendors - List all vendors (includes both rental houses and distributors)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const offset = (page - 1) * limit;

    const country = req.query.country as string;
    const vendorType = req.query.vendor_type as string;
    const search = req.query.search as string;

    let whereClause = 'WHERE active = true';
    const params: any[] = [];
    let paramCount = 1;

    if (country) {
      whereClause += ` AND country = $${paramCount++}`;
      params.push(country);
    }

    if (vendorType) {
      whereClause += ` AND vendor_type = $${paramCount++}`;
      params.push(vendorType);
    }

    if (search) {
      whereClause += ` AND (name ILIKE $${paramCount} OR city ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // UNION query to combine vendors (rental houses) and distributors
    const countQuery = `
      SELECT COUNT(*) as total FROM (
        SELECT id, name, slug, vendor_type, country, city, active FROM vendors ${whereClause}
        UNION ALL
        SELECT id, name, slug, 'Distributor' as vendor_type, country, city, active FROM distributors ${whereClause}
      ) combined
    `;
    const countResult = await db.one(countQuery, params);
    const total = parseInt(countResult.total, 10);

    const dataQuery = `
      SELECT * FROM (
        SELECT 
          id, name, slug, description, website, email, phone, 
          address_line1, address_line2, city, state_province, postal_code, 
          country, latitude, longitude, established_year, vendor_type,
          active, created_at, updated_at,
          NULL::text[] as brands_carried, NULL::text[] as territories_served, NULL::text as distributor_type
        FROM vendors ${whereClause}
        UNION ALL
        SELECT 
          id, name, slug, description, website, email, phone,
          address_line1, address_line2, city, state_province, postal_code,
          country, latitude, longitude, established_year, 'Distributor' as vendor_type,
          active, created_at, updated_at,
          brands_carried, territories_served, distributor_type
        FROM distributors ${whereClause}
      ) combined
      ORDER BY name ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(limit, offset);

    const vendors = await db.any(dataQuery, params);

    const response: PaginatedResponse<Vendor> = {
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// GET /vendors/:id - Get vendor by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = await db.oneOrNone('SELECT * FROM vendors WHERE id = $1', [id]);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Get vendor's locations (if any) - gracefully handle if table doesn't exist
    let locations = [];
    try {
      locations = await db.any(`
        SELECT * FROM vendor_locations
        WHERE vendor_id = $1
        ORDER BY is_headquarters DESC, location_name ASC
      `, [id]);
    } catch (locError: any) {
      // Table might not exist yet, continue without locations
      if (locError.code !== '42P01') {
        console.error('Error fetching vendor locations:', locError);
      }
    }

    // Get vendor's inventory
    const inventory = await db.any(`
      SELECT 
        vi.*,
        json_build_object(
          'id', f.id,
          'name', f.name,
          'slug', f.slug,
          'manufacturer', json_build_object(
            'name', m.name,
            'slug', m.slug
          )
        ) as fixture
      FROM vendor_inventory vi
      LEFT JOIN fixtures f ON vi.fixture_id = f.id
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      WHERE vi.vendor_id = $1
      ORDER BY f.name ASC
    `, [id]);

    return res.json({ ...vendor, locations, inventory });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// GET /vendors/slug/:slug - Get vendor by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const vendor = await db.oneOrNone('SELECT * FROM vendors WHERE slug = $1', [slug]);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Get vendor's locations (if any) - gracefully handle if table doesn't exist
    let locations = [];
    try {
      locations = await db.any(`
        SELECT * FROM vendor_locations
        WHERE vendor_id = $1
        ORDER BY is_headquarters DESC, location_name ASC
      `, [vendor.id]);
    } catch (locError: any) {
      // Table might not exist yet, continue without locations
      if (locError.code !== '42P01') {
        console.error('Error fetching vendor locations:', locError);
      }
    }

    // Get vendor's inventory
    const inventory = await db.any(`
      SELECT 
        vi.*,
        json_build_object(
          'id', f.id,
          'name', f.name,
          'slug', f.slug,
          'manufacturer', json_build_object(
            'name', m.name,
            'slug', m.slug
          )
        ) as fixture
      FROM vendor_inventory vi
      LEFT JOIN fixtures f ON vi.fixture_id = f.id
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      WHERE vi.vendor_id = $1
      ORDER BY f.name ASC
    `, [vendor.id]);

    // Fetch endorsements for this vendor
    const endorsements = await db.any(`
      SELECT 
        ve.id,
        ve.vendor_id,
        ve.upvotes,
        ve.downvotes,
        ve.net_score,
        ec.name,
        ec.slug,
        ec.description,
        ec.icon,
        ec.is_positive
      FROM vendor_endorsements ve
      INNER JOIN endorsement_categories ec ON ve.category_id = ec.id
      WHERE ve.vendor_id = $1
      ORDER BY ve.net_score DESC, ec.is_positive DESC, ec.name
    `, [vendor.id]);

    return res.json({ ...vendor, locations, inventory, endorsements });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// POST /vendors/:slug/endorsements/:categorySlug/vote
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
    // Get vendor and category IDs
    const vendor = await db.oneOrNone('SELECT id FROM vendors WHERE slug = $1', [slug]);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const category = await db.oneOrNone('SELECT id FROM endorsement_categories WHERE slug = $1', [categorySlug]);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Create endorsement if it doesn't exist
    await db.none(`
      INSERT INTO vendor_endorsements (vendor_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (vendor_id, category_id) DO NOTHING
    `, [vendor.id, category.id]);

    const endorsement = await db.one(
      'SELECT id FROM vendor_endorsements WHERE vendor_id = $1 AND category_id = $2',
      [vendor.id, category.id]
    );

    // Insert or update vote
    await db.none(`
      INSERT INTO endorsement_votes (endorsement_id, session_id, vote_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (endorsement_id, session_id) 
      DO UPDATE SET vote_type = $3, updated_at = CURRENT_TIMESTAMP
    `, [endorsement.id, sessionId, voteType]);

    // Get updated endorsement data
    const updated = await db.one(`
      SELECT upvotes, downvotes, net_score
      FROM vendor_endorsements
      WHERE id = $1
    `, [endorsement.id]);

    return res.json(updated);
  } catch (error) {
    console.error('Error recording vote:', error);
    return res.status(500).json({ error: 'Failed to record vote' });
  }
});

// GET /vendors/:slug/endorsement-categories
router.get('/:slug/endorsement-categories', async (req: Request, res: Response) => {
  try {
    const categories = await db.any(`
      SELECT id, name, slug, description, icon, is_positive
      FROM endorsement_categories
      ORDER BY is_positive DESC, name
    `);

    return res.json(categories);
  } catch (error) {
    console.error('Error fetching endorsement categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
