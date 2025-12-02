import express from 'express';
import { db } from '../db/connection';

const router = express.Router();

// Get similar fixtures based on comprehensive matching algorithm
router.get('/fixtures/:fixtureId/similar', async (req, res) => {
  try {
    const { fixtureId } = req.params;
    const { limit = 6 } = req.query;

    // Get the reference fixture with all its specs
    const fixture = await db.oneOrNone(`
      SELECT 
        f.*,
        ft.name as fixture_type_name,
        ft.slug as fixture_type_slug,
        m.name as manufacturer_name
      FROM fixtures f
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      WHERE f.id = $1
    `, [fixtureId]);

    if (!fixture) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    // Build similarity query with weighted scoring
    // Each factor contributes to a similarity score
    const similarFixtures = await db.any(`
      WITH fixture_scores AS (
        SELECT 
          f.id,
          f.name,
          f.slug,
          f.primary_image_url,
          f.weight_kg,
          f.power_consumption_watts,
          f.total_lumens as lumens,
          m.name as manufacturer_name,
          m.slug as manufacturer_slug,
          ft.name as fixture_type_name,
          
          -- Calculate similarity score (0-100)
          (
            -- Same fixture type (35 points) - increased weight
            CASE 
              WHEN f.fixture_type_id = $2 THEN 35
              WHEN f.fixture_type_id IS NOT NULL AND $2 IS NOT NULL THEN 5 -- At least has a type
              ELSE 3 -- Base score so all fixtures have some score
            END +
            
            -- Similar light source (25 points) - increased weight
            CASE 
              WHEN f.light_source_type = $3 THEN 25
              WHEN f.light_source_type IS NOT NULL AND $3 IS NOT NULL THEN 12
              ELSE 5 -- Base score for having light source data
            END +
            
            -- Similar brightness (12 points)
            CASE
              WHEN f.total_lumens IS NOT NULL AND $4 IS NOT NULL THEN
                GREATEST(5, 12 - (ABS(f.total_lumens - $4) / NULLIF(GREATEST(f.total_lumens, $4), 0) * 12))
              WHEN f.total_lumens IS NOT NULL OR $4 IS NOT NULL THEN 3 -- Has brightness data
              ELSE 2
            END +
            
            -- Similar power consumption (8 points)
            CASE
              WHEN f.power_consumption_watts IS NOT NULL AND $5 IS NOT NULL THEN
                GREATEST(3, 8 - (ABS(f.power_consumption_watts - $5) / NULLIF(GREATEST(f.power_consumption_watts, $5), 0) * 8))
              WHEN f.power_consumption_watts IS NOT NULL OR $5 IS NOT NULL THEN 2
              ELSE 1
            END +
            
            -- Similar weight (6 points)
            CASE
              WHEN f.weight_kg IS NOT NULL AND $6 IS NOT NULL THEN
                GREATEST(2, 6 - (ABS(f.weight_kg - $6) / NULLIF(GREATEST(f.weight_kg, $6), 0) * 6))
              WHEN f.weight_kg IS NOT NULL OR $6 IS NOT NULL THEN 1
              ELSE 0
            END +
            
            -- Similar beam angle (5 points)
            CASE
              WHEN f.beam_angle_min IS NOT NULL AND $7 IS NOT NULL THEN
                GREATEST(2, 5 - (ABS(f.beam_angle_min - $7) / NULLIF(GREATEST(f.beam_angle_min, $7), 0) * 5))
              WHEN f.beam_angle_min IS NOT NULL OR $7 IS NOT NULL THEN 1
              ELSE 0
            END +
            
            -- Color mixing capability match (10 points)
            CASE 
              WHEN f.color_mixing_type = $8 THEN 10
              WHEN f.color_mixing_type IS NOT NULL AND $8 IS NOT NULL THEN 5
              WHEN f.color_mixing_type IS NOT NULL OR $8 IS NOT NULL THEN 2
              ELSE 1
            END +
            
            -- Movement capability match (6 points for pan/tilt)
            CASE 
              WHEN (f.pan_range_degrees IS NOT NULL) = ($9 IS NOT NULL) 
                AND (f.tilt_range_degrees IS NOT NULL) = ($10 IS NOT NULL) 
                AND f.pan_range_degrees IS NOT NULL THEN 6
              WHEN f.pan_range_degrees IS NOT NULL OR $9 IS NOT NULL THEN 2
              ELSE 1
            END +
            
            -- Similar DMX channel count (2 points)
            CASE
              WHEN f.dmx_channels_min IS NOT NULL AND $11 IS NOT NULL THEN
                GREATEST(1, 2 - (ABS(f.dmx_channels_min - $11) / NULLIF(GREATEST(f.dmx_channels_min, $11), 0) * 2))
              ELSE 0
            END +
            
            -- Gobo capability match (2 points)
            CASE 
              WHEN (f.gobo_wheels_count > 0) = ($12 > 0) AND f.gobo_wheels_count > 0 THEN 2 
              ELSE 0 
            END
            
          ) as similarity_score,
          
          -- Track which features matched for explanation
          jsonb_build_object(
            'same_type', f.fixture_type_id = $2,
            'same_light_source', f.light_source_type = $3,
            'similar_brightness', ABS(COALESCE(f.lumens, 0) - COALESCE($4, 0)) < COALESCE($4, 0) * 0.3,
            'similar_power', ABS(COALESCE(f.power_consumption_watts, 0) - COALESCE($5, 0)) < COALESCE($5, 0) * 0.3,
            'has_color_mixing', f.color_mixing_type IS NOT NULL,
            'has_movement', f.pan_range_degrees IS NOT NULL
          ) as match_reasons
          
        FROM fixtures f
        JOIN manufacturers m ON f.manufacturer_id = m.id
        LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
        WHERE f.id != $1  -- Exclude the reference fixture
          AND f.is_active = true
      )
      SELECT *
      FROM fixture_scores
      ORDER BY similarity_score DESC, name ASC
      LIMIT $13
    `, [
      fixtureId,
      fixture.fixture_type_id,
      fixture.light_source_type,
      fixture.total_lumens,
      fixture.power_consumption_watts,
      fixture.weight_kg,
      fixture.beam_angle_min,
      fixture.color_mixing_type,
      fixture.pan_range_degrees,
      fixture.tilt_range_degrees,
      fixture.dmx_channels_min,
      fixture.gobo_wheels_count || 0,
      parseInt(limit as string, 10)
    ]);

    res.json({ 
      reference: {
        id: fixture.id,
        name: fixture.name,
        manufacturer: fixture.manufacturer_name,
        type: fixture.fixture_type_name
      },
      similar: similarFixtures 
    });
  } catch (error) {
    console.error('Error finding similar fixtures:', error);
    res.status(500).json({ error: 'Failed to find similar fixtures' });
  }
});

export default router;
