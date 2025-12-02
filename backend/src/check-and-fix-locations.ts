import { db } from './db/connection';

(async () => {
  try {
    const locs = await db.any(`
      SELECT id, location_name, city, state_province
      FROM vendor_locations 
      WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
      ORDER BY location_name
    `);
    
    console.log(`\nFound ${locs.length} locations for LightWorks Productions:\n`);
    locs.forEach((l, idx) => {
      console.log(`${idx + 1}. ${l.location_name} (${l.city}, ${l.state_province})`);
    });
    
    // Now update any that still have PRG
    const updated = await db.result(`
      UPDATE vendor_locations
      SET location_name = REPLACE(location_name, 'PRG', 'LightWorks')
      WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
        AND location_name LIKE '%PRG%'
    `);
    
    if (updated.rowCount > 0) {
      console.log(`\n✅ Updated ${updated.rowCount} locations to replace PRG with LightWorks`);
      
      // Show updated names
      const updatedLocs = await db.any(`
        SELECT id, location_name, city, state_province
        FROM vendor_locations 
        WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
        ORDER BY location_name
      `);
      
      console.log('\nUpdated locations:');
      updatedLocs.forEach((l, idx) => {
        console.log(`${idx + 1}. ${l.location_name} (${l.city}, ${l.state_province})`);
      });
    } else {
      console.log('\n✅ All locations already have correct names');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
