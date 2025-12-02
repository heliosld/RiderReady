import { db } from './db/connection';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  try {
    console.log('Creating interactive features tables...\n');
    
    const sqlPath = path.join(__dirname, '../../database/interactive_features.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await db.none(sql);
    
    console.log('✅ Interactive features tables created successfully!\n');
    
    // Verify tables were created
    const tables = await db.any(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'fixture_%' 
        AND table_name NOT IN ('fixtures')
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:');
    tables.forEach((t, idx) => {
      console.log(`${idx + 1}. ${t.table_name}`);
    });
    
    // Verify views were created
    const views = await db.any(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📈 Created views:');
    views.forEach((v, idx) => {
      console.log(`${idx + 1}. ${v.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
