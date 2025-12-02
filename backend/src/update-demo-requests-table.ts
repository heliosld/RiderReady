import { db } from './db/connection';

(async () => {
  try {
    console.log('Updating demo_requests table to support vendors and distributors...\n');
    
    // Add new columns for vendor and distributor
    await db.none(`
      ALTER TABLE demo_requests 
      ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS distributor_id UUID REFERENCES distributors(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS recipient_type VARCHAR(50) DEFAULT 'manufacturer', -- 'manufacturer', 'vendor', 'distributor'
      ADD COLUMN IF NOT EXISTS recipient_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS location_preference VARCHAR(255); -- For vendors with multiple locations
    `);

    console.log('✅ Added vendor_id, distributor_id, recipient_type, recipient_name, and location_preference columns');

    // Create index for vendor and distributor lookups
    await db.none(`
      CREATE INDEX IF NOT EXISTS idx_demo_vendor ON demo_requests(vendor_id);
      CREATE INDEX IF NOT EXISTS idx_demo_distributor ON demo_requests(distributor_id);
      CREATE INDEX IF NOT EXISTS idx_demo_recipient_type ON demo_requests(recipient_type);
    `);

    console.log('✅ Created indexes for new columns');

    // Verify the changes
    const columns = await db.any(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'demo_requests'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Updated demo_requests table structure:');
    columns.forEach((col, idx) => {
      console.log(`${idx + 1}. ${col.column_name} (${col.data_type})${col.is_nullable === 'YES' ? ' - nullable' : ''}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
