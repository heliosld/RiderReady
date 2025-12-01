import { Router, Request, Response } from 'express';
import { db } from '../db/connection';

const router = Router();

// GET /fixture-categories - List all categories with their types
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await db.any(`
      SELECT 
        fc.id,
        fc.name,
        fc.slug,
        fc.description,
        json_agg(
          json_build_object(
            'id', ft.id,
            'name', ft.name,
            'slug', ft.slug
          ) ORDER BY ft.name
        ) FILTER (WHERE ft.id IS NOT NULL) as types
      FROM fixture_categories fc
      LEFT JOIN fixture_types ft ON ft.category_id = fc.id
      GROUP BY fc.id, fc.name, fc.slug, fc.description
      ORDER BY fc.name
    `);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching fixture categories:', error);
    res.status(500).json({ error: 'Failed to fetch fixture categories' });
  }
});

export default router;
