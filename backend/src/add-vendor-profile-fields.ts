import { db } from './db/connection';

(async () => {
  try {
    console.log('Adding profile enhancement fields to vendors table...\n');
    
    await db.none(`
      ALTER TABLE vendors 
      ADD COLUMN IF NOT EXISTS about TEXT,
      ADD COLUMN IF NOT EXISTS services TEXT[],
      ADD COLUMN IF NOT EXISTS certifications JSONB,
      ADD COLUMN IF NOT EXISTS specialties TEXT[],
      ADD COLUMN IF NOT EXISTS years_in_business INTEGER,
      ADD COLUMN IF NOT EXISTS team_size VARCHAR(50),
      ADD COLUMN IF NOT EXISTS response_time VARCHAR(50),
      ADD COLUMN IF NOT EXISTS service_area TEXT,
      ADD COLUMN IF NOT EXISTS hours_of_operation JSONB,
      ADD COLUMN IF NOT EXISTS social_media JSONB,
      ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0
    `);
    
    console.log('✅ All profile enhancement columns added successfully!\n');
    
    // Show the new structure
    const cols = await db.any(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vendors' 
      ORDER BY ordinal_position
    `);
    
    console.log('Updated vendors table structure:');
    cols.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
