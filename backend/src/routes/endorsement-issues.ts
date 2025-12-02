import { Router, Request, Response } from 'express';
import { db } from '../db/connection';

const router = Router();

// GET /endorsement-issues/tags - Get all issue tags
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const tags = await db.any(`
      SELECT id, name, category, description, display_order
      FROM endorsement_issue_tags
      ORDER BY display_order ASC
    `);

    res.json({ tags });
  } catch (error) {
    console.error('Error fetching issue tags:', error);
    res.status(500).json({ error: 'Failed to fetch issue tags' });
  }
});

// GET /endorsement-issues/fixture/:fixtureId - Get issues for a fixture
router.get('/fixture/:fixtureId', async (req: Request, res: Response) => {
  try {
    const { fixtureId } = req.params;

    const issues = await db.any(`
      SELECT 
        fe.id as endorsement_id,
        fec.name as category_name,
        eit.id as issue_tag_id,
        eit.name as issue_name,
        eit.category as issue_category,
        fei.count,
        fe.downvotes
      FROM fixture_endorsement_issues fei
      JOIN fixture_endorsements fe ON fei.endorsement_id = fe.id
      JOIN fixture_endorsement_categories fec ON fe.category_id = fec.id
      JOIN endorsement_issue_tags eit ON fei.issue_tag_id = eit.id
      WHERE fe.fixture_id = $1 AND fe.downvotes > 0
      ORDER BY fei.count DESC
    `, [fixtureId]);

    // Group by endorsement category
    const issuesByCategory: any = {};
    issues.forEach((issue: any) => {
      if (!issuesByCategory[issue.category_name]) {
        issuesByCategory[issue.category_name] = {
          category: issue.category_name,
          total_downvotes: issue.downvotes,
          issues: []
        };
      }
      issuesByCategory[issue.category_name].issues.push({
        issue_tag_id: issue.issue_tag_id,
        issue_name: issue.issue_name,
        issue_category: issue.issue_category,
        count: issue.count,
        percentage: Math.round((issue.count / issue.downvotes) * 100)
      });
    });

    res.json({ issues: Object.values(issuesByCategory) });
  } catch (error) {
    console.error('Error fetching fixture issues:', error);
    res.status(500).json({ error: 'Failed to fetch fixture issues' });
  }
});

// POST /endorsement-issues/report - Report an issue with a downvote
router.post('/report', async (req: Request, res: Response) => {
  try {
    const { endorsement_id, issue_tag_id, session_id } = req.body;

    if (!endorsement_id || !issue_tag_id || !session_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if this session already reported this issue
    const existingVote = await db.oneOrNone(`
      SELECT fev.id, fei.id as issue_id
      FROM fixture_endorsement_votes fev
      LEFT JOIN fixture_endorsement_issues fei 
        ON fei.endorsement_id = fev.endorsement_id 
        AND fei.issue_tag_id = $3
      WHERE fev.endorsement_id = $1 
        AND fev.session_id = $2
        AND fev.vote_type = 'down'
    `, [endorsement_id, session_id, issue_tag_id]);

    if (existingVote && existingVote.issue_id) {
      return res.status(400).json({ error: 'Issue already reported for this downvote' });
    }

    // Increment or create issue record
    await db.none(`
      INSERT INTO fixture_endorsement_issues (endorsement_id, issue_tag_id, count)
      VALUES ($1, $2, 1)
      ON CONFLICT (endorsement_id, issue_tag_id) 
      DO UPDATE SET 
        count = fixture_endorsement_issues.count + 1,
        updated_at = CURRENT_TIMESTAMP
    `, [endorsement_id, issue_tag_id]);

    res.json({ success: true, message: 'Issue reported successfully' });
  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({ error: 'Failed to report issue' });
  }
});

// GET /endorsement-issues/certified - Get all certified fixtures
router.get('/certified', async (req: Request, res: Response) => {
  try {
    const certified = await db.any(`
      SELECT 
        cf.fixture_id,
        f.name as fixture_name,
        f.slug,
        cf.certified_date,
        cf.min_threshold_score
      FROM certified_fixtures cf
      JOIN fixtures f ON cf.fixture_id = f.id
      ORDER BY cf.certified_date DESC
    `);

    res.json({ certified });
  } catch (error) {
    console.error('Error fetching certified fixtures:', error);
    res.status(500).json({ error: 'Failed to fetch certified fixtures' });
  }
});

// POST /endorsement-issues/certify - Check and certify a fixture if eligible
router.post('/certify/:fixtureId', async (req: Request, res: Response) => {
  try {
    const { fixtureId } = req.params;
    const threshold = parseInt(req.body.threshold) || 90;

    // Check if fixture meets certification criteria
    const endorsements = await db.any(`
      SELECT 
        category_id,
        upvotes,
        downvotes,
        net_score,
        CASE 
          WHEN (upvotes + downvotes) > 0 
          THEN (upvotes::float / (upvotes + downvotes)) * 100 
          ELSE 0 
        END as approval_rate
      FROM fixture_endorsements
      WHERE fixture_id = $1
    `, [fixtureId]);

    if (endorsements.length === 0) {
      return res.status(400).json({ error: 'No endorsements found for this fixture' });
    }

    // All categories must be above threshold
    const allAboveThreshold = endorsements.every(e => e.approval_rate >= threshold);
    const minVotesPerCategory = 5;
    const hasEnoughVotes = endorsements.every(e => (e.upvotes + e.downvotes) >= minVotesPerCategory);

    if (!allAboveThreshold || !hasEnoughVotes) {
      return res.status(400).json({ 
        error: 'Fixture does not meet certification criteria',
        details: {
          allAboveThreshold,
          hasEnoughVotes,
          minVotesRequired: minVotesPerCategory
        }
      });
    }

    // Add or update certification
    await db.none(`
      INSERT INTO certified_fixtures (fixture_id, min_threshold_score)
      VALUES ($1, $2)
      ON CONFLICT (fixture_id) 
      DO UPDATE SET 
        last_review_date = CURRENT_TIMESTAMP,
        min_threshold_score = $2
    `, [fixtureId, threshold]);

    res.json({ success: true, message: 'Fixture certified', threshold });
  } catch (error) {
    console.error('Error certifying fixture:', error);
    res.status(500).json({ error: 'Failed to certify fixture' });
  }
});

export default router;
