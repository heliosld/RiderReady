import express from 'express';
import { db } from '../db/connection';

const router = express.Router();

// ============================================================================
// USE CASE SELECTION
// ============================================================================

router.post('/fixtures/:fixtureId/use-case', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const { sessionId, useCase, userRole } = req.body;

    if (!sessionId || !useCase) {
      return res.status(400).json({ error: 'sessionId and useCase are required' });
    }

    await db.none(`
      INSERT INTO fixture_use_case_selections (fixture_id, session_id, use_case, user_role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (fixture_id, session_id) 
      DO UPDATE SET use_case = $3, user_role = $4
    `, [fixtureId, sessionId, useCase, userRole]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving use case selection:', error);
    res.status(500).json({ error: 'Failed to save use case selection' });
  }
});

// Get use case breakdown for a fixture
router.get('/fixtures/:fixtureId/use-cases', async (req, res) => {
  try {
    const { fixtureId } = req.params;

    const breakdown = await db.any(`
      SELECT 
        use_case,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()), 1) as percentage
      FROM fixture_use_case_selections
      WHERE fixture_id = $1
      GROUP BY use_case
      ORDER BY count DESC
    `, [fixtureId]);

    res.json({ breakdown });
  } catch (error) {
    console.error('Error getting use case breakdown:', error);
    res.status(500).json({ error: 'Failed to get use case breakdown' });
  }
});

// ============================================================================
// COMPARISON TRACKING
// ============================================================================

router.post('/comparisons', async (req, res) => {
  try {
    const { sessionId, fixtureIds } = req.body;

    if (!sessionId || !Array.isArray(fixtureIds) || fixtureIds.length < 2) {
      return res.status(400).json({ error: 'sessionId and at least 2 fixtureIds required' });
    }

    const comparison = await db.one(`
      INSERT INTO fixture_comparisons (session_id, fixture_ids)
      VALUES ($1, $2)
      RETURNING id, created_at
    `, [sessionId, fixtureIds]);

    res.json({ success: true, comparison });
  } catch (error) {
    console.error('Error saving comparison:', error);
    res.status(500).json({ error: 'Failed to save comparison' });
  }
});

// Get what fixtures are commonly compared with a given fixture
router.get('/fixtures/:fixtureId/compared-with', async (req, res) => {
  try {
    const { fixtureId } = req.params;

    const comparisons = await db.any(`
      SELECT 
        unnest(fixture_ids) as compared_fixture_id,
        COUNT(*) as comparison_count
      FROM fixture_comparisons
      WHERE $1 = ANY(fixture_ids)
        AND array_length(fixture_ids, 1) > 1
      GROUP BY compared_fixture_id
      HAVING unnest(fixture_ids) != $1
      ORDER BY comparison_count DESC
      LIMIT 10
    `, [fixtureId]);

    // Get fixture details for the compared fixtures
    if (comparisons.length > 0) {
      const fixtureIds = comparisons.map((c: any) => c.compared_fixture_id);
      const fixtures = await db.any(`
        SELECT 
          f.id,
          f.name,
          f.slug,
          f.primary_image_url,
          m.name as manufacturer_name,
          m.slug as manufacturer_slug
        FROM fixtures f
        JOIN manufacturers m ON f.manufacturer_id = m.id
        WHERE f.id = ANY($1)
      `, [fixtureIds]);

      const result = comparisons.map((c: any) => {
        const fixture = fixtures.find((f: any) => f.id === c.compared_fixture_id);
        return {
          ...fixture,
          comparison_count: parseInt(c.comparison_count)
        };
      });

      res.json({ comparisons: result });
    } else {
      res.json({ comparisons: [] });
    }
  } catch (error) {
    console.error('Error getting comparison data:', error);
    res.status(500).json({ error: 'Failed to get comparison data' });
  }
});

// ============================================================================
// FEATURE IMPORTANCE VOTING
// ============================================================================

router.post('/fixtures/:fixtureId/feature-importance', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const { sessionId, featureName, importance, useCase } = req.body;

    if (!sessionId || !featureName || !importance) {
      return res.status(400).json({ error: 'sessionId, featureName, and importance are required' });
    }

    await db.none(`
      INSERT INTO feature_importance_votes (fixture_id, session_id, feature_name, importance, use_case)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (fixture_id, session_id, feature_name)
      DO UPDATE SET importance = $4, use_case = $5
    `, [fixtureId, sessionId, featureName, importance, useCase]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving feature importance:', error);
    res.status(500).json({ error: 'Failed to save feature importance' });
  }
});

// Get feature importance breakdown
router.get('/fixtures/:fixtureId/feature-importance', async (req, res) => {
  try {
    const { fixtureId } = req.params;

    const importance = await db.any(`
      SELECT 
        feature_name,
        ROUND(AVG(importance), 2) as avg_importance,
        COUNT(*) as vote_count
      FROM feature_importance_votes
      WHERE fixture_id = $1
      GROUP BY feature_name
      ORDER BY avg_importance DESC
    `, [fixtureId]);

    res.json({ importance });
  } catch (error) {
    console.error('Error getting feature importance:', error);
    res.status(500).json({ error: 'Failed to get feature importance' });
  }
});

// ============================================================================
// DEMO REQUESTS
// ============================================================================

router.post('/fixtures/:fixtureId/demo-request', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const {
      sessionId,
      fullName,
      email,
      phone,
      company,
      useCase,
      role,
      message,
      preferredContactMethod,
      recipientType, // 'manufacturer', 'vendor', 'distributor'
      recipientId,
      recipientName,
      locationPreference
    } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({ error: 'sessionId and email are required' });
    }

    if (!recipientType || !recipientId) {
      return res.status(400).json({ error: 'recipientType and recipientId are required' });
    }

    // Get manufacturer ID for this fixture
    const fixture = await db.one(`
      SELECT manufacturer_id FROM fixtures WHERE id = $1
    `, [fixtureId]);

    // Determine which ID column to populate based on recipient type
    let manufacturerId = null;
    let vendorId = null;
    let distributorId = null;

    if (recipientType === 'manufacturer') {
      manufacturerId = recipientId;
    } else if (recipientType === 'vendor') {
      vendorId = recipientId;
      manufacturerId = fixture.manufacturer_id; // Keep manufacturer ID for reference
    } else if (recipientType === 'distributor') {
      distributorId = recipientId;
      manufacturerId = fixture.manufacturer_id;
    }

    const request = await db.one(`
      INSERT INTO demo_requests (
        fixture_id, 
        manufacturer_id,
        vendor_id,
        distributor_id,
        recipient_type,
        recipient_name,
        session_id,
        full_name,
        email,
        phone,
        company,
        use_case,
        role,
        message,
        preferred_contact_method,
        location_preference
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, created_at
    `, [
      fixtureId,
      manufacturerId,
      vendorId,
      distributorId,
      recipientType,
      recipientName,
      sessionId,
      fullName,
      email,
      phone,
      company,
      useCase,
      role,
      message,
      preferredContactMethod,
      locationPreference
    ]);

    res.json({ success: true, request });
  } catch (error) {
    console.error('Error creating demo request:', error);
    res.status(500).json({ error: 'Failed to create demo request' });
  }
});

// ============================================================================
// PAGE VIEW TRACKING
// ============================================================================

router.post('/fixtures/:fixtureId/page-view', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const {
      sessionId,
      referrer,
      useCase,
      userRole,
      timeOnPageSeconds,
      scrolledToSpecs,
      scrolledToVendors,
      scrolledToRatings,
      clickedVendor,
      clickedComparison,
      clickedDemoRequest,
      unitToggled,
      countryCode,
      region
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    await db.none(`
      INSERT INTO fixture_page_views (
        fixture_id,
        session_id,
        referrer,
        use_case,
        user_role,
        time_on_page_seconds,
        scrolled_to_specs,
        scrolled_to_vendors,
        scrolled_to_ratings,
        clicked_vendor,
        clicked_comparison,
        clicked_demo_request,
        unit_toggled,
        country_code,
        region
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `, [
      fixtureId,
      sessionId,
      referrer,
      useCase,
      userRole,
      timeOnPageSeconds,
      scrolledToSpecs,
      scrolledToVendors,
      scrolledToRatings,
      clickedVendor,
      clickedComparison,
      clickedDemoRequest,
      unitToggled,
      countryCode,
      region
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving page view:', error);
    res.status(500).json({ error: 'Failed to save page view' });
  }
});

// ============================================================================
// USER RATINGS
// ============================================================================

router.post('/fixtures/:fixtureId/rating', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const {
      sessionId,
      overallRating,
      reliabilityRating,
      valueRating,
      supportRating,
      hasUsed,
      useCase,
      wouldRecommend
    } = req.body;

    if (!sessionId || !overallRating) {
      return res.status(400).json({ error: 'sessionId and overallRating are required' });
    }

    await db.none(`
      INSERT INTO fixture_user_ratings (
        fixture_id,
        session_id,
        overall_rating,
        reliability_rating,
        value_rating,
        support_rating,
        has_used,
        use_case,
        would_recommend
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (fixture_id, session_id)
      DO UPDATE SET
        overall_rating = $3,
        reliability_rating = $4,
        value_rating = $5,
        support_rating = $6,
        has_used = $7,
        use_case = $8,
        would_recommend = $9
    `, [
      fixtureId,
      sessionId,
      overallRating,
      reliabilityRating,
      valueRating,
      supportRating,
      hasUsed,
      useCase,
      wouldRecommend
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// Get aggregated ratings for a fixture
router.get('/fixtures/:fixtureId/ratings', async (req, res) => {
  try {
    const { fixtureId } = req.params;

    const ratings = await db.oneOrNone(`
      SELECT 
        ROUND(AVG(overall_rating), 1) as avg_overall,
        ROUND(AVG(reliability_rating), 1) as avg_reliability,
        ROUND(AVG(value_rating), 1) as avg_value,
        ROUND(AVG(support_rating), 1) as avg_support,
        COUNT(*) as total_ratings,
        SUM(CASE WHEN would_recommend = true THEN 1 ELSE 0 END) as recommend_count,
        ROUND(SUM(CASE WHEN would_recommend = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as recommend_percentage
      FROM fixture_user_ratings
      WHERE fixture_id = $1 AND has_used = true
    `, [fixtureId]);

    res.json({ ratings: ratings || { total_ratings: 0 } });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
});

// ============================================================================
// WISHLIST
// ============================================================================

router.post('/fixtures/:fixtureId/wishlist', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const { sessionId, userEmail, intent, notes } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const wishlist = await db.one(`
      INSERT INTO fixture_wishlist (fixture_id, session_id, user_email, intent, notes)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (fixture_id, session_id)
      DO UPDATE SET is_active = true, user_email = $3, intent = $4, notes = $5
      RETURNING id, created_at
    `, [fixtureId, sessionId, userEmail, intent, notes]);

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

router.delete('/fixtures/:fixtureId/wishlist/:sessionId', async (req, res) => {
  try {
    const { fixtureId, sessionId } = req.params;

    await db.none(`
      UPDATE fixture_wishlist
      SET is_active = false, removed_at = CURRENT_TIMESTAMP
      WHERE fixture_id = $1 AND session_id = $2
    `, [fixtureId, sessionId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// ============================================================================
// VENDOR CONTACT TRACKING
// ============================================================================

router.post('/vendor-contact', async (req, res) => {
  try {
    const { fixtureId, vendorId, sessionId, contactType, useCase } = req.body;

    if (!sessionId || !vendorId) {
      return res.status(400).json({ error: 'sessionId and vendorId are required' });
    }

    await db.none(`
      INSERT INTO vendor_contact_clicks (fixture_id, vendor_id, session_id, contact_type, use_case)
      VALUES ($1, $2, $3, $4, $5)
    `, [fixtureId, vendorId, sessionId, contactType, useCase]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking vendor contact:', error);
    res.status(500).json({ error: 'Failed to track vendor contact' });
  }
});

export default router;
