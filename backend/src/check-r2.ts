import { db } from './db/connection';

(async () => {
  try {
    const r2 = await db.one(`
      SELECT 
        f.id, f.name, f.slug,
        m.name as manufacturer,
        f.fixture_type_id,
        ft.name as fixture_type_name,
        f.light_source_type,
        f.total_lumens,
        f.power_consumption_watts,
        f.weight_kg,
        f.beam_angle_min,
        f.color_mixing_type
      FROM fixtures f
      LEFT JOIN manufacturers m ON f.manufacturer_id = m.id
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      WHERE f.name = 'R2 Wash'
    `);
    console.log('R2 Wash fixture:');
    console.log(JSON.stringify(r2, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
