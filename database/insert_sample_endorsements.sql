-- Sample Endorsement Data for RiderReady
-- This script generates realistic voting patterns for fixtures across all feature-specific categories
-- Voting patterns are based on fixture type, manufacturer reputation, and realistic usage scenarios

-- Clear existing endorsement data (optional - comment out if you want to keep existing data)
-- DELETE FROM fixture_endorsement_issues;
-- DELETE FROM fixture_endorsements;

-- Generate sample endorsements for popular fixtures
-- Pattern: High-end fixtures get better ratings, older fixtures get more mixed reviews

-- Session IDs for sample voters (simulating different users)
DO $$
DECLARE
  fixture_record RECORD;
  category_record RECORD;
  session_ids TEXT[] := ARRAY[
    'session_sample_001', 'session_sample_002', 'session_sample_003', 'session_sample_004',
    'session_sample_005', 'session_sample_006', 'session_sample_007', 'session_sample_008',
    'session_sample_009', 'session_sample_010', 'session_sample_011', 'session_sample_012',
    'session_sample_013', 'session_sample_014', 'session_sample_015', 'session_sample_016',
    'session_sample_017', 'session_sample_018', 'session_sample_019', 'session_sample_020'
  ];
  votes_to_add INT;
  upvote_ratio FLOAT;
  i INT;
  vote_type TEXT;
  endorsement_id UUID;
  issue_tag_id UUID;
  random_val FLOAT;
BEGIN
  -- Loop through all fixtures
  FOR fixture_record IN 
    SELECT f.id, f.slug, f.name, f.manufacturer_id, m.name as manufacturer_name,
           f.color_mixing_type, 
           (f.gobo_wheels_count > 0) as has_gobo_wheel,
           f.prism as has_prism,
           (f.zoom_type IS NOT NULL AND f.zoom_type != '') as has_zoom,
           f.frost as has_frost
    FROM fixtures f
    JOIN manufacturers m ON f.manufacturer_id = m.id
    LIMIT 50  -- Process first 50 fixtures for sample data
  LOOP
    RAISE NOTICE 'Processing fixture: %', fixture_record.name;
    
    -- Determine vote pattern based on manufacturer (some manufacturers have better reputations)
    upvote_ratio := CASE 
      WHEN fixture_record.manufacturer_name IN ('Robe', 'Martin', 'Claypaky', 'Ayrton') THEN 0.85 + (random() * 0.10)
      WHEN fixture_record.manufacturer_name IN ('Elation', 'Chauvet Professional', 'ADJ') THEN 0.75 + (random() * 0.15)
      ELSE 0.65 + (random() * 0.20)
    END;
    
    -- Get applicable categories for this fixture
    FOR category_record IN
      SELECT id, slug, name, requires_color_mixing, requires_gobo_wheel, 
             requires_prism, requires_zoom, requires_frost, applies_to_all
      FROM fixture_endorsement_categories
      WHERE applies_to_all = true
         OR (requires_color_mixing = true AND fixture_record.color_mixing_type IS NOT NULL 
             AND fixture_record.color_mixing_type NOT IN ('None', 'Fixed'))
         OR (requires_gobo_wheel = true AND fixture_record.has_gobo_wheel = true)
         OR (requires_prism = true AND fixture_record.has_prism = true)
         OR (requires_zoom = true AND fixture_record.has_zoom = true)
         OR (requires_frost = true AND fixture_record.has_frost = true)
    LOOP
      -- Random number of votes per category (3-15)
      votes_to_add := 3 + floor(random() * 13)::INT;
      
      -- Create or get endorsement record
      INSERT INTO fixture_endorsements (fixture_id, category_id)
      VALUES (fixture_record.id, category_record.id)
      ON CONFLICT (fixture_id, category_id) DO NOTHING
      RETURNING id INTO endorsement_id;
      
      -- If no ID returned, fetch existing one
      IF endorsement_id IS NULL THEN
        SELECT id INTO endorsement_id 
        FROM fixture_endorsements 
        WHERE fixture_id = fixture_record.id AND category_id = category_record.id;
      END IF;
      
      -- Add votes
      FOR i IN 1..votes_to_add LOOP
        random_val := random();
        
        IF random_val < upvote_ratio THEN
          vote_type := 'up';
        ELSE
          vote_type := 'down';
          
          -- For downvotes, add an issue report (50% of the time)
          IF random() < 0.5 THEN
            -- Select a random issue tag appropriate to the category
            SELECT id INTO issue_tag_id
            FROM endorsement_issue_tags
            WHERE category IN ('mechanical', 'electrical', 'software', 'thermal', 'optical', 'other')
            ORDER BY random()
            LIMIT 1;
            
            IF issue_tag_id IS NOT NULL THEN
              INSERT INTO fixture_endorsement_issues (
                endorsement_id, issue_tag_id, count
              ) VALUES (
                endorsement_id, issue_tag_id, 1
              )
              ON CONFLICT ON CONSTRAINT fixture_endorsement_issues_endorsement_id_issue_tag_id_key
              DO UPDATE SET count = fixture_endorsement_issues.count + 1;
            END IF;
          END IF;
        END IF;
        
        -- Record the vote
        INSERT INTO fixture_endorsement_votes (
          endorsement_id, session_id, vote_type
        ) VALUES (
          endorsement_id, session_ids[1 + floor(random() * 20)::INT], vote_type
        )
        ON CONFLICT ON CONSTRAINT fixture_endorsement_votes_endorsement_id_session_id_key DO NOTHING;
      END LOOP;
      
    END LOOP;
    
  END LOOP;
  
  RAISE NOTICE 'Sample endorsement data generation complete!';
END $$;

-- Update vote counts for all endorsements
UPDATE fixture_endorsements fe
SET 
  upvotes = (
    SELECT COUNT(*) 
    FROM fixture_endorsement_votes ev 
    WHERE ev.endorsement_id = fe.id AND ev.vote_type = 'up'
  ),
  downvotes = (
    SELECT COUNT(*) 
    FROM fixture_endorsement_votes ev 
    WHERE ev.endorsement_id = fe.id AND ev.vote_type = 'down'
  );

-- Note: net_score is a generated column and updates automatically

-- Identify and insert certified fixtures (90%+ approval, minimum 5 votes per category)
INSERT INTO certified_fixtures (fixture_id, certified_date, notes)
SELECT 
  f.id,
  NOW(),
  'Automatically certified: ' || 
  CAST((SUM(fe.upvotes)::FLOAT / NULLIF(SUM(fe.upvotes + fe.downvotes), 0)) * 100 AS NUMERIC(5,2)) || 
  '% approval with ' || SUM(fe.upvotes + fe.downvotes) || ' total votes'
FROM fixtures f
JOIN fixture_endorsements fe ON f.id = fe.fixture_id
GROUP BY f.id
HAVING 
  SUM(fe.upvotes + fe.downvotes) >= 30  -- At least 30 total votes
  AND (SUM(fe.upvotes)::FLOAT / NULLIF(SUM(fe.upvotes + fe.downvotes), 0)) >= 0.90
  AND COUNT(CASE WHEN (fe.upvotes + fe.downvotes) >= 5 THEN 1 END) = COUNT(*)  -- All categories have at least 5 votes
ON CONFLICT (fixture_id) DO UPDATE
SET 
  last_review_date = NOW(),
  notes = EXCLUDED.notes;

-- Display summary statistics
SELECT 
  'Total Fixtures with Endorsements' as metric,
  COUNT(DISTINCT fixture_id) as value
FROM fixture_endorsements
WHERE upvotes + downvotes > 0
UNION ALL
SELECT 
  'Total Endorsement Records',
  COUNT(*)
FROM fixture_endorsements
WHERE upvotes + downvotes > 0
UNION ALL
SELECT 
  'Total Votes Cast',
  SUM(upvotes + downvotes)
FROM fixture_endorsements
UNION ALL
SELECT 
  'Certified Fixtures',
  COUNT(*)
FROM certified_fixtures
UNION ALL
SELECT 
  'Total Issue Reports',
  COUNT(*)
FROM fixture_endorsement_issues;

-- Show top-rated fixtures
SELECT 
  f.name,
  m.name as manufacturer,
  COUNT(fe.id) as categories_rated,
  SUM(fe.upvotes) as total_upvotes,
  SUM(fe.downvotes) as total_downvotes,
  CAST((SUM(fe.upvotes)::FLOAT / NULLIF(SUM(fe.upvotes + fe.downvotes), 0)) * 100 AS NUMERIC(5,1)) as approval_percent,
  CASE WHEN cf.fixture_id IS NOT NULL THEN 'Yes' ELSE 'No' END as certified
FROM fixtures f
JOIN manufacturers m ON f.manufacturer_id = m.id
LEFT JOIN fixture_endorsements fe ON f.id = fe.fixture_id
LEFT JOIN certified_fixtures cf ON f.id = cf.fixture_id
WHERE fe.upvotes + fe.downvotes > 0
GROUP BY f.id, f.name, m.name, cf.fixture_id
ORDER BY approval_percent DESC, total_upvotes DESC
LIMIT 20;
