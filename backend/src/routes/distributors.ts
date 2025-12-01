import { Router, Request, Response } from 'express';
import { db } from '../db/connection';

const router = Router();

interface PaginationParams {
  page: number;
  limit: number;
}

function getPaginationParams(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
    Math.max(1, parseInt(req.query.limit as string, 10) || parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10))
  );
  return { page, limit };
}

// GET /distributors/locations - Get all distributor locations
router.get('/locations', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        dl.id,
        dl.distributor_id,
        d.name as distributor_name,
        d.slug as distributor_slug,
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
        dl.email
      FROM distributor_locations dl
      INNER JOIN distributors d ON dl.distributor_id = d.id
      WHERE d.active = true
      ORDER BY d.name, dl.is_headquarters DESC, dl.location_name
    `;

    const locations = await db.any(query);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching distributor locations:', error);
    res.json([]);
  }
});

// GET /distributors - List all distributors
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const offset = (page - 1) * limit;

    const country = req.query.country as string;
    const search = req.query.search as string;

    let whereClause = 'WHERE active = true';
    const params: any[] = [];
    let paramCount = 1;

    if (country) {
      whereClause += ` AND country = $${paramCount++}`;
      params.push(country);
    }

    if (search) {
      whereClause += ` AND name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM distributors ${whereClause}`;
    const countResult = await db.one(countQuery, params);
    const total = parseInt(countResult.total, 10);

    const dataQuery = `
      SELECT * FROM distributors
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(limit, offset);

    const distributors = await db.any(dataQuery, params);

    const response = {
      data: distributors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching distributors:', error);
    res.status(500).json({ error: 'Failed to fetch distributors' });
  }
});

// GET /distributors/slug/:slug - Get distributor by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const distributor = await db.oneOrNone('SELECT * FROM distributors WHERE slug = $1', [slug]);

    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    // Get distributor's locations
    let locations = [];
    try {
      locations = await db.any(`
        SELECT * FROM distributor_locations
        WHERE distributor_id = $1
        ORDER BY is_headquarters DESC, location_name ASC
      `, [distributor.id]);
    } catch (locError: any) {
      if (locError.code !== '42P01') {
        console.error('Error fetching distributor locations:', locError);
      }
    }

    return res.json({ ...distributor, locations });
  } catch (error) {
    console.error('Error fetching distributor:', error);
    return res.status(500).json({ error: 'Failed to fetch distributor' });
  }
});

export default router;
