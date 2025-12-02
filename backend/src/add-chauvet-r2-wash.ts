// Add Chauvet R2 Wash fixture to database
import { db } from './db/connection.js';

async function addChauvetR2Wash() {
  try {
    console.log('\n🔧 Adding Chauvet R2 Wash to database...\n');
    
    // Check fixture types
    const fixtureTypes = await db.any(`SELECT id, name, slug FROM fixture_types`);
    console.log('Available fixture types:', fixtureTypes);
    
    const result = await db.one(`
      INSERT INTO fixtures (
        manufacturer_id, fixture_type_id, name, model_number, slug,
        description, year_introduced,
        weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
        power_consumption_watts, voltage, power_connector,
        light_source_type, color_temperature_kelvin, cri_rating,
        total_lumens, beam_angle_min, beam_angle_max, zoom_type,
        color_mixing_type,
        frost, iris, shutter_strobe,
        dmx_channels_min, dmx_channels_max, rdm_support,
        pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
      ) VALUES (
        (SELECT id FROM manufacturers WHERE slug = 'chauvet'),
        (SELECT id FROM fixture_types WHERE slug = 'wash'),
        'R2 Wash', 'R2 Wash', 'chauvet-r2-wash',
        'Compact RGBW LED wash with exceptional color rendering and versatile zoom range',
        2018,
        9.5, 20.9, 293, 410, 193,
        350, '100-240V', 'PowerCON',
        'LED', 6500, 90,
        10000, 10.0, 60.0, 'Linear',
        'RGBW',
        TRUE, TRUE, TRUE,
        18, 46, TRUE,
        540, 270, TRUE
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description
      RETURNING id, name, slug
    `);
    
    console.log('✅ SUCCESS: Fixture added/updated!');
    console.log(`   ID: ${result.id}`);
    console.log(`   Name: ${result.name}`);
    console.log(`   Slug: ${result.slug}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR: Failed to add fixture');
    console.error(error);
    process.exit(1);
  }
}

addChauvetR2Wash();
