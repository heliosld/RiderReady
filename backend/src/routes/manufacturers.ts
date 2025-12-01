import { Router, Request, Response } from 'express';
import { db } from '../db/connection';
import { Manufacturer } from '../types';

const router = Router();

// GET /manufacturers - List all manufacturers
router.get('/', async (req: Request, res: Response) => {
  try {
    const manufacturers = await db.any<Manufacturer>(`
      SELECT 
        m.*,
        COUNT(f.id) as fixture_count
      FROM manufacturers m
      LEFT JOIN fixtures f ON m.id = f.manufacturer_id
      GROUP BY m.id
      ORDER BY m.name ASC
    `);

    res.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ error: 'Failed to fetch manufacturers' });
  }
});

// GET /manufacturers/:id - Get manufacturer by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const manufacturer = await db.oneOrNone('SELECT * FROM manufacturers WHERE id = $1', [id]);

    if (!manufacturer) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }

    res.json(manufacturer);
  } catch (error) {
    console.error('Error fetching manufacturer:', error);
    res.status(500).json({ error: 'Failed to fetch manufacturer' });
  }
});

export default router;
