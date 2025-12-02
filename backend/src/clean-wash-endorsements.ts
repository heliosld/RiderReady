import { db } from './db/connection';

async function cleanWashEndorsements() {
  console.log('🧹 Cleaning irrelevant endorsements from wash fixtures...\n');

  try {
    // Categories that should NOT exist on wash fixtures
    const washExcludedCategories = [
      'gobo-image-quality',
      'gobo-rotation-smoothness',
      'gobo-indexing-accuracy',
      'gobo-change-speed',
      'prism-effect-quality',
      'prism-rotation-speed',
      'prism-indexing'
    ];

    // Get all wash fixture types
    const fixtureTypes = await db.any(`
      SELECT id FROM fixture_types 
      WHERE slug IN ('wash', 'moving-head-wash', 'led-wash')
    `);

    if (!fixtureTypes || fixtureTypes.length === 0) {
      console.log('❌ No wash fixture types found');
      return;
    }

    const typeIds = fixtureTypes.map((t: any) => t.id);

    // Get all wash fixtures
    const fixtures = await db.any(`
      SELECT id, name, slug
      FROM fixtures
      WHERE fixture_type_id = ANY($1::uuid[])
    `, [typeIds]);

    console.log(`Found ${fixtures.length} wash fixtures\n`);

    // Get category IDs for excluded categories
    const categories = await db.any(`
      SELECT id, slug, name
      FROM fixture_endorsement_categories
      WHERE slug = ANY($1)
    `, [washExcludedCategories]);

    const categoryIds = categories.map((c: any) => c.id);
    console.log(`Categories to remove: ${categories.map((c: any) => c.name).join(', ')}\n`);

    // Delete endorsements for these categories from wash fixtures
    for (const fixture of fixtures) {
      const result = await db.result(`
        DELETE FROM fixture_endorsements
        WHERE fixture_id = $1 AND category_id = ANY($2::uuid[])
      `, [fixture.id, categoryIds]);

      if (result.rowCount > 0) {
        console.log(`✓ ${fixture.name}: Removed ${result.rowCount} irrelevant endorsements`);
      }
    }

    console.log('\n✅ Cleanup complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

cleanWashEndorsements();
