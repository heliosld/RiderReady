// Update Mac Viper Profile ratings to 95%+
import { db } from './db/connection.js';

async function updateViperRatings() {
  try {
    console.log('\n🔧 Updating Mac Viper Profile ratings to 95%+...\n');
    
    // Get fixture
    const fixture = await db.one(`
      SELECT id, name FROM fixtures WHERE slug = 'martin-mac-viper-profile'
    `);
    
    console.log(`Found: ${fixture.name} (${fixture.id})`);
    
    // Get all endorsement categories for this fixture
    const endorsements = await db.any(`
      SELECT 
        fe.id,
        fe.upvotes,
        fe.downvotes,
        fec.name
      FROM fixture_endorsements fe
      JOIN fixture_endorsement_categories fec ON fe.category_id = fec.id
      WHERE fe.fixture_id = $1
      ORDER BY fec.display_order
    `, [fixture.id]);
    
    console.log(`Found ${endorsements.length} endorsement categories\n`);
    
    // Update each category to have excellent ratings
    for (const endorsement of endorsements) {
      // Generate 15-22 total votes per category
      const totalVotes = Math.floor(Math.random() * 8) + 15;
      // 80% of categories get 0 downvotes, rest get 1
      const downvotes = Math.random() < 0.8 ? 0 : 1;
      const upvotes = totalVotes - downvotes;
      
      await db.none(`
        UPDATE fixture_endorsements
        SET upvotes = $1, downvotes = $2
        WHERE id = $3
      `, [upvotes, downvotes, endorsement.id]);
      
      const approval = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;
      console.log(`  ✓ ${endorsement.name}: ${upvotes}↑ ${downvotes}↓ (${approval}%)`);
    }
    
    // Calculate overall approval
    const overall = await db.one(`
      SELECT 
        SUM(upvotes) as total_upvotes,
        SUM(downvotes) as total_downvotes
      FROM fixture_endorsements
      WHERE fixture_id = $1
    `, [fixture.id]);
    
    const totalVotesCheck = parseInt(overall.total_upvotes) + parseInt(overall.total_downvotes);
    const approvalPct = (parseInt(overall.total_upvotes) / totalVotesCheck * 100).toFixed(1);
    
    console.log(`\n✅ SUCCESS: Overall Rating: ${approvalPct}% approval (${overall.total_upvotes}↑ / ${overall.total_downvotes}↓)\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR: Failed to update ratings');
    console.error(error);
    process.exit(1);
  }
}

updateViperRatings();
