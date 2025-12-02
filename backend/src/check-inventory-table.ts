import { db } from './db/connection';

(async () => {
  try {
    const cols = await db.any(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vendor_inventory' 
      ORDER BY ordinal_position
    `);
    
    console.log('vendor_inventory columns:');
    cols.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
