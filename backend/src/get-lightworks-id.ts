import { db } from './db/connection';

(async () => {
  try {
    const vendor = await db.oneOrNone(`SELECT id, name, slug FROM vendors WHERE slug = 'lightworks-productions'`);
    if (vendor) {
      console.log(`Vendor ID: ${vendor.id}`);
      console.log(`Name: ${vendor.name}`);
      console.log(`Slug: ${vendor.slug}`);
    } else {
      console.log('LightWorks Productions vendor not found');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
