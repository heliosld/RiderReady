import { db } from './db/connection';

(async () => {
  try {
    const fixtures = await db.any(`SELECT name FROM fixtures WHERE name ILIKE '%chauvet%'`);
    console.log('Chauvet fixtures:', fixtures);
    
    const wash = await db.any(`SELECT name FROM fixtures WHERE name ILIKE '%wash%' LIMIT 10`);
    console.log('\nWash fixtures:', wash);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
