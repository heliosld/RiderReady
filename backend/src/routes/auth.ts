import { Router, Request, Response } from 'express';
import { db } from '../db/connection';

const router = Router();

// ============================================================================
// GUEST AUTH - Create temporary user session
// ============================================================================

router.post('/guest', async (req: Request, res: Response) => {
  try {
    const sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user = await db.one(`
      INSERT INTO users (session_id, is_guest)
      VALUES ($1, true)
      RETURNING id, session_id, is_guest, created_at
    `, [sessionId]);

    res.json({
      success: true,
      user,
      sessionToken: user.session_id
    });
  } catch (error) {
    console.error('Error creating guest user:', error);
    res.status(500).json({ error: 'Failed to create guest session' });
  }
});

// ============================================================================
// GET CURRENT USER
// ============================================================================

router.get('/me', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    const user = await db.oneOrNone(`
      SELECT id, session_id, is_guest, username, email, full_name, company, role, created_at
      FROM users
      WHERE session_id = $1
    `, [sessionToken]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============================================================================
// VENDOR CLAIMS
// ============================================================================

router.post('/claim-vendor', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    const { vendorId, contactEmail, contactPhone, verificationNotes } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    // Get user
    const user = await db.oneOrNone('SELECT id FROM users WHERE session_id = $1', [sessionToken]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create claim
    const claim = await db.one(`
      INSERT INTO vendor_claims (
        vendor_id, user_id, status, verification_method,
        contact_email, contact_phone, verification_notes
      ) VALUES ($1, $2, 'pending', 'manual', $3, $4, $5)
      RETURNING *
    `, [vendorId, user.id, contactEmail, contactPhone, verificationNotes]);

    res.json({
      success: true,
      claim
    });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'You have already claimed this vendor' });
    }
    console.error('Error creating vendor claim:', error);
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// Get user's vendor claims
router.get('/my-claims', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    const user = await db.oneOrNone('SELECT id FROM users WHERE session_id = $1', [sessionToken]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const claims = await db.any(`
      SELECT 
        vc.*,
        v.name as vendor_name,
        v.slug as vendor_slug
      FROM vendor_claims vc
      JOIN vendors v ON v.id = vc.vendor_id
      WHERE vc.user_id = $1
      ORDER BY vc.created_at DESC
    `, [user.id]);

    res.json({ claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

export default router;
