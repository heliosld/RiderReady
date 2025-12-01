import { Router, Request, Response } from 'express';
import { db } from '../db/connection';

const router = Router();

// GET /search - Universal search endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const limit = Math.min(50, parseInt(req.query.limit as string, 10) || 10);

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchPattern = `%${query}%`;

    // Search fixtures
    const fixtures = await db.any(`
      SELECT 
        f.id, f.name, f.slug, f.primary_image_url,
        'fixture' as type,
        json_build_object('name', m.name, 'slug', m.slug) as manufacturer
      FROM fixtures f
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      WHERE f.name ILIKE $1 OR f.description ILIKE $1
      LIMIT $2
    `, [searchPattern, Math.floor(limit / 2)]);

    // Search manufacturers
    const manufacturers = await db.any(`
      SELECT 
        id, name, slug, logo_url,
        'manufacturer' as type
      FROM manufacturers
      WHERE name ILIKE $1 OR description ILIKE $1
      LIMIT $2
    `, [searchPattern, Math.floor(limit / 4)]);

    // Search vendors
    const vendors = await db.any(`
      SELECT 
        id, name, slug, logo_url, city, country,
        'vendor' as type
      FROM vendors
      WHERE name ILIKE $1 OR description ILIKE $1 OR city ILIKE $1
      LIMIT $2
    `, [searchPattern, Math.floor(limit / 4)]);

    const results = {
      fixtures,
      manufacturers,
      vendors,
      total: fixtures.length + manufacturers.length + vendors.length
    };

    res.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
