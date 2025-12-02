import { Router, Request, Response } from 'express';
import { db } from '../db/connection';

const router = Router();

// ============================================================================
// GET VENDOR INVENTORY
// ============================================================================

router.get('/:vendorId/inventory', async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;

    // Check if vendorId is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vendorId);
    
    let actualVendorId = vendorId;
    if (!isUUID) {
      // It's a slug, look up the UUID
      const vendor = await db.oneOrNone(`SELECT id FROM vendors WHERE slug = $1`, [vendorId]);
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      actualVendorId = vendor.id;
    }

    const inventory = await db.any(`
      SELECT 
        vi.*,
        f.name as fixture_name,
        f.slug as fixture_slug,
        f.primary_image_url,
        m.name as manufacturer_name,
        ft.name as fixture_type_name
      FROM vendor_inventory vi
      JOIN fixtures f ON f.id = vi.fixture_id
      JOIN manufacturers m ON m.id = f.manufacturer_id
      JOIN fixture_types ft ON ft.id = f.fixture_type_id
      WHERE vi.vendor_id = $1 AND vi.show_on_vendor_page = true
      ORDER BY f.name
    `, [actualVendorId]);

    res.json({
      inventory,
      count: inventory.length
    });
  } catch (error) {
    console.error('Error fetching vendor inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// ============================================================================
// ADD FIXTURES TO INVENTORY
// ============================================================================

router.post('/:vendorId/inventory', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    const { vendorId } = req.params;
    const { fixtures } = req.body; // Array of { fixtureId, quantityRange, forRental, forPurchase }

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    // Get user
    const user = await db.oneOrNone('SELECT id FROM users WHERE session_id = $1', [sessionToken]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if vendorId is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vendorId);
    
    let actualVendorId = vendorId;
    if (!isUUID) {
      // It's a slug, look up the UUID
      const vendor = await db.oneOrNone(`SELECT id FROM vendors WHERE slug = $1`, [vendorId]);
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      actualVendorId = vendor.id;
    }

    // TODO: Verify user has permission to manage this vendor
    // For now, allow anyone (in production, check vendor_claims)

    const results = [];
    
    for (const fixture of fixtures) {
      try {
        const inventory = await db.one(`
          INSERT INTO vendor_inventory (
            vendor_id, fixture_id, quantity_range,
            available_for_rental, available_for_purchase,
            show_on_vendor_page, added_by_user_id
          ) VALUES ($1, $2, $3, $4, $5, true, $6)
          ON CONFLICT (vendor_id, fixture_id) 
          DO UPDATE SET
            quantity_range = EXCLUDED.quantity_range,
            available_for_rental = EXCLUDED.available_for_rental,
            available_for_purchase = EXCLUDED.available_for_purchase,
            updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `, [
          actualVendorId,
          fixture.fixtureId,
          fixture.quantityRange,
          fixture.forRental,
          fixture.forPurchase,
          user.id
        ]);

        results.push(inventory);
      } catch (error) {
        console.error(`Error adding fixture ${fixture.fixtureId}:`, error);
      }
    }

    res.json({
      success: true,
      added: results.length,
      inventory: results
    });
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).json({ error: 'Failed to add inventory' });
  }
});

// ============================================================================
// UPDATE INVENTORY ITEM
// ============================================================================

router.put('/:vendorId/inventory/:inventoryId', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    const { inventoryId } = req.params;
    const { quantityRange, availableForRental, availableForPurchase, showOnVendorPage } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    const inventory = await db.one(`
      UPDATE vendor_inventory
      SET 
        quantity_range = COALESCE($1, quantity_range),
        available_for_rental = COALESCE($2, available_for_rental),
        available_for_purchase = COALESCE($3, available_for_purchase),
        show_on_vendor_page = COALESCE($4, show_on_vendor_page)
      WHERE id = $5
      RETURNING *
    `, [quantityRange, availableForRental, availableForPurchase, showOnVendorPage, inventoryId]);

    res.json({ inventory });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// ============================================================================
// DELETE INVENTORY ITEM
// ============================================================================

router.delete('/:vendorId/inventory/:inventoryId', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    const { inventoryId } = req.params;

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    await db.none('DELETE FROM vendor_inventory WHERE id = $1', [inventoryId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ error: 'Failed to delete inventory' });
  }
});

// ============================================================================
// GET VENDORS THAT HAVE A FIXTURE
// ============================================================================

router.get('/by-fixture/:fixtureId', async (req: Request, res: Response) => {
  try {
    const { fixtureId } = req.params;

    const vendors = await db.any(`
      SELECT 
        v.*,
        vi.quantity_range,
        vi.available_for_rental,
        vi.available_for_purchase,
        (
          SELECT json_agg(json_build_object(
            'id', vl.id,
            'location_name', vl.location_name,
            'city', vl.city,
            'state_province', vl.state_province,
            'latitude', vl.latitude,
            'longitude', vl.longitude
          ))
          FROM vendor_locations vl
          WHERE vl.vendor_id = v.id
        ) as locations
      FROM vendors v
      JOIN vendor_inventory vi ON vi.vendor_id = v.id
      WHERE vi.fixture_id = $1 AND vi.show_on_vendor_page = true
      ORDER BY v.name
    `, [fixtureId]);

    res.json({ vendors });
  } catch (error) {
    console.error('Error fetching vendors for fixture:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

export default router;
