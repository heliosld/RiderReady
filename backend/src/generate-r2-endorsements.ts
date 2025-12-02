// Generate endorsement data for Chauvet R2 Wash
import { db } from './db/connection.js';

async function generateR2WashEndorsements() {
  try {
    console.log('\n🔧 Generating endorsement data for Chauvet R2 Wash...\n');
    
    // Get fixture ID
    const fixture = await db.one(`
      SELECT id FROM fixtures WHERE slug = 'chauvet-r2-wash'
    `);
    
    // Get all endorsement categories
    const categories = await db.any(`
      SELECT id, name, slug FROM fixture_endorsement_categories
      ORDER BY display_order
    `);
    
    console.log(`Found ${categories.length} endorsement categories`);
    
    // Generate endorsement records with realistic Chauvet ratings (75-88% approval)
    let totalVotes = 0;
    for (const category of categories) {
      // Chauvet gets 6-12 votes per category
      const voteCount = Math.floor(Math.random() * 7) + 6;
      // Approval rating between 75-88%
      const approvalRate = 0.75 + Math.random() * 0.13;
      const upvotes = Math.floor(voteCount * approvalRate);
      const downvotes = voteCount - upvotes;
      
      await db.none(`
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (fixture_id, category_id) DO UPDATE SET
          upvotes = EXCLUDED.upvotes,
          downvotes = EXCLUDED.downvotes
      `, [fixture.id, category.id, upvotes, downvotes]);
      
      totalVotes += voteCount;
      console.log(`  ✓ ${category.name}: ${upvotes}↑ ${downvotes}↓ (${Math.round(approvalRate * 100)}%)`);
    }
    
    console.log(`\n✅ SUCCESS: Generated ${totalVotes} total votes across ${categories.length} categories`);
    
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
    
    console.log(`\nOverall Rating: ${approvalPct}% approval (${overall.total_upvotes}↑ / ${overall.total_downvotes}↓)\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR: Failed to generate endorsement data');
    console.error(error);
    process.exit(1);
  }
}

generateR2WashEndorsements();
