// Create best-in-class endorsements for specific fixtures
import { db } from './db/connection.js';

async function createBestInClass() {
  try {
    console.log('\n🔧 Creating best-in-class endorsements...\n');
    
    // Define best in class fixtures and their specialties
    const bestInClass = [
      {
        slug: 'robe-bmfl-spot',
        name: 'BMFL Spot',
        specialty: 'Overall Excellence & Brightness',
        categories: ['Beam Output', 'Gobo Image Quality', 'Zoom Range', 'Build Quality', 'Electronics Reliability'],
        rating: 0.98
      },
      {
        slug: 'clay-paky-sharpy',
        name: 'Sharpy',
        specialty: 'Beam Performance & Speed',
        categories: ['Beam Output', 'Movement Noise', 'Pan/Tilt Speed', 'Weight Balance', 'Power Efficiency'],
        rating: 0.97
      },
      {
        slug: 'robe-megapointe',
        name: 'MegaPointe',
        specialty: 'Versatility & Effects',
        categories: ['Prism Effect Quality', 'Gobo Rotation Smoothness', 'Color Mixing Speed', 'Zoom Speed', 'Strobe Speed'],
        rating: 0.96
      },
      {
        slug: 'ayrton-magicpanel-fx',
        name: 'MagicPanel FX',
        specialty: 'Color Rendering & Mixing',
        categories: ['Color Rendering (CRI)', 'Color Accuracy', 'Color Mixing Speed', 'Field Evenness', 'Camera Flicker'],
        rating: 0.97
      },
      {
        slug: 'martin-mac-aura-xb',
        name: 'MAC Aura XB',
        specialty: 'Smooth Movement & Reliability',
        categories: ['Movement Smoothness', 'Pan/Tilt Accuracy', 'Dimming Smoothness', 'Mechanical Reliability', 'Thermal Management'],
        rating: 0.96
      },
      {
        slug: 'glp-impression-x4-xl',
        name: 'Impression X4 XL',
        specialty: 'LED Efficiency & Color',
        categories: ['Power Efficiency', 'Color Rendering (CRI)', 'Thermal Management', 'Ease of Service', 'Electronics Reliability'],
        rating: 0.95
      }
    ];
    
    for (const fixture of bestInClass) {
      console.log(`\n📌 ${fixture.name} - ${fixture.specialty}`);
      
      // Get fixture
      const fixtureData = await db.oneOrNone(`
        SELECT id FROM fixtures WHERE slug = $1
      `, [fixture.slug]);
      
      if (!fixtureData) {
        console.log(`   ⚠️  Fixture not found, skipping...`);
        continue;
      }
      
      // Get all categories
      const categories = await db.any(`
        SELECT 
          fec.id,
          fec.name,
          fec.slug
        FROM fixture_endorsement_categories fec
      `);
      
      // Update endorsements
      for (const cat of categories) {
        const isSpecialty = fixture.categories.includes(cat.name);
        
        // Specialty categories get near-perfect scores
        const totalVotes = Math.floor(Math.random() * 8) + 15;
        let upvotes, downvotes;
        
        if (isSpecialty) {
          // 98-100% for specialty areas
          downvotes = Math.random() < 0.85 ? 0 : 1;
          upvotes = totalVotes - downvotes;
        } else {
          // 92-96% for other areas
          const approvalRate = 0.92 + Math.random() * 0.04;
          upvotes = Math.floor(totalVotes * approvalRate);
          downvotes = totalVotes - upvotes;
        }
        
        await db.none(`
          INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (fixture_id, category_id) DO UPDATE SET
            upvotes = EXCLUDED.upvotes,
            downvotes = EXCLUDED.downvotes
        `, [fixtureData.id, cat.id, upvotes, downvotes]);
      }
      
      // Calculate overall
      const overall = await db.one(`
        SELECT 
          SUM(upvotes) as total_upvotes,
          SUM(downvotes) as total_downvotes
        FROM fixture_endorsements
        WHERE fixture_id = $1
      `, [fixtureData.id]);
      
      const totalVotes = parseInt(overall.total_upvotes) + parseInt(overall.total_downvotes);
      const approval = (parseInt(overall.total_upvotes) / totalVotes * 100).toFixed(1);
      
      console.log(`   ✅ ${approval}% overall (${overall.total_upvotes}↑ / ${overall.total_downvotes}↓)`);
      console.log(`   🌟 Excellence in: ${fixture.categories.join(', ')}`);
    }
    
    console.log('\n✅ Best-in-class endorsements created!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  }
}

createBestInClass();
