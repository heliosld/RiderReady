import { db } from './db/connection';

(async () => {
  try {
    console.log('Checking fixture data...\n');
    
    // Find Martin Aura
    const aura = await db.oneOrNone(`
      SELECT 
        f.id, f.name, f.slug,
        f.fixture_type_id,
        ft.name as fixture_type_name,
        f.light_source_type,
        f.total_lumens,
        f.power_consumption_watts,
        f.weight_kg,
        f.beam_angle_min,
        f.color_mixing_type,
        f.gobo_wheels_count
      FROM fixtures f
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      WHERE f.name ILIKE '%aura%'
      LIMIT 1
    `);

    console.log('Martin Aura:');
    console.log(JSON.stringify(aura, null, 2));

    // Find Chauvet R2
    const r2 = await db.oneOrNone(`
      SELECT 
        f.id, f.name, f.slug,
        f.fixture_type_id,
        ft.name as fixture_type_name,
        f.light_source_type,
        f.total_lumens,
        f.power_consumption_watts,
        f.weight_kg,
        f.beam_angle_min,
        f.color_mixing_type,
        f.gobo_wheels_count
      FROM fixtures f
      LEFT JOIN fixture_types ft ON f.fixture_type_id = ft.id
      WHERE f.name ILIKE '%chauvet%r2%'
      LIMIT 1
    `);

    console.log('\nChauvet R2 Wash:');
    console.log(JSON.stringify(r2, null, 2));

    // Count total fixtures
    const count = await db.one(`SELECT COUNT(*) FROM fixtures`);
    console.log(`\nTotal fixtures: ${count.count}`);

    // Try running the similar query manually for Aura
    if (aura) {
      console.log('\nRunning similarity query for Aura...');
      const similar = await db.any(`
        WITH fixture_scores AS (
          SELECT 
            f.id,
            f.name,
            f.fixture_type_id,
            (
              CASE 
                WHEN f.fixture_type_id = $2 THEN 35
                WHEN f.fixture_type_id IS NOT NULL AND $2 IS NOT NULL THEN 5
                ELSE 3
              END +
              CASE 
                WHEN f.light_source_type = $3 THEN 25
                WHEN f.light_source_type IS NOT NULL AND $3 IS NOT NULL THEN 12
                ELSE 5
              END
            ) as similarity_score
          FROM fixtures f
          WHERE f.id != $1
        )
        SELECT *
        FROM fixture_scores
        ORDER BY similarity_score DESC
        LIMIT 5
      `, [aura.id, aura.fixture_type_id, aura.light_source_type]);

      console.log('\nTop 5 similar fixtures:');
      similar.forEach((f, idx) => {
        console.log(`${idx + 1}. ${f.name} (score: ${f.similarity_score})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
