import { db } from './db/connection';

(async () => {
  try {
    console.log('Adding missing columns to vendor_inventory table...\n');
    
    // Add quantity_range column
    await db.none(`
      ALTER TABLE vendor_inventory 
      ADD COLUMN IF NOT EXISTS quantity_range VARCHAR(50)
    `);
    console.log('✅ Added quantity_range column');
    
    // Add show_on_vendor_page column
    await db.none(`
      ALTER TABLE vendor_inventory 
      ADD COLUMN IF NOT EXISTS show_on_vendor_page BOOLEAN DEFAULT true
    `);
    console.log('✅ Added show_on_vendor_page column');
    
    // Add added_by_user_id column
    await db.none(`
      ALTER TABLE vendor_inventory 
      ADD COLUMN IF NOT EXISTS added_by_user_id UUID REFERENCES users(id)
    `);
    console.log('✅ Added added_by_user_id column');
    
    // Add updated_at column
    await db.none(`
      ALTER TABLE vendor_inventory 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ Added updated_at column');
    
    // Create trigger for updated_at
    await db.none(`
      CREATE OR REPLACE FUNCTION update_vendor_inventory_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS update_vendor_inventory_updated_at ON vendor_inventory;
      
      CREATE TRIGGER update_vendor_inventory_updated_at
      BEFORE UPDATE ON vendor_inventory
      FOR EACH ROW
      EXECUTE FUNCTION update_vendor_inventory_updated_at();
    `);
    console.log('✅ Created updated_at trigger');
    
    console.log('\n✅ All columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
