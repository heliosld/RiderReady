-- Sample Fixture Endorsements
-- Add realistic endorsements for existing fixtures

-- ============================================================================
-- MAC Viper Profile - Well-regarded profile fixture
-- ============================================================================

-- Get the MAC Viper Profile fixture ID
DO $$
DECLARE
    viper_id UUID;
BEGIN
    SELECT id INTO viper_id FROM fixtures WHERE slug = 'martin-mac-viper-profile';
    
    IF viper_id IS NOT NULL THEN
        -- Bright Output
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            viper_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'bright-output'),
            45, 3
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Build Quality
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            viper_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'build-quality'),
            38, 2
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Optics Quality
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            viper_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'optics-quality'),
            42, 1
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Reliable
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            viper_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'reliable'),
            40, 4
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Heavy (negative)
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            viper_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'heavy'),
            28, 8
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- Claypaky Sharpy - Legendary beam fixture
-- ============================================================================

DO $$
DECLARE
    sharpy_id UUID;
BEGIN
    SELECT id INTO sharpy_id FROM fixtures WHERE slug = 'clay-paky-sharpy';
    
    IF sharpy_id IS NOT NULL THEN
        -- Bright Output
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            sharpy_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'bright-output'),
            52, 1
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Fast Movement
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            sharpy_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'fast-movement'),
            48, 2
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Lightweight
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            sharpy_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'lightweight'),
            50, 0
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Reliable
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            sharpy_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'reliable'),
            46, 3
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Limited Features (negative - it's a beam, not a spot)
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            sharpy_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'limited-features'),
            15, 12
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- Robe Robin Pointe - Versatile hybrid fixture
-- ============================================================================

DO $$
DECLARE
    pointe_id UUID;
BEGIN
    SELECT id INTO pointe_id FROM fixtures WHERE slug = 'robe-robin-pointe';
    
    IF pointe_id IS NOT NULL THEN
        -- Feature Rich
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            pointe_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'feature-rich'),
            44, 2
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Bright Output
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            pointe_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'bright-output'),
            39, 5
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Fast Movement
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            pointe_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'fast-movement'),
            42, 3
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Lightweight
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            pointe_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'lightweight'),
            35, 4
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- High End Systems Intellabeam 700HX - Classic scanner
-- ============================================================================

DO $$
DECLARE
    intellabeam_id UUID;
BEGIN
    SELECT id INTO intellabeam_id FROM fixtures WHERE slug = 'intellabeam-700hx';
    
    IF intellabeam_id IS NOT NULL THEN
        -- Reliable (these things never die)
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            intellabeam_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'reliable'),
            32, 2
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Easy Maintenance
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            intellabeam_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'easy-maintenance'),
            28, 3
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Dim Output (by modern standards)
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            intellabeam_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'dim-output'),
            25, 8
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Limited Features (negative)
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            intellabeam_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'limited-features'),
            22, 5
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Heavy
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            intellabeam_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'heavy'),
            30, 3
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
    END IF;
END $$;

-- ============================================================================
-- Chauvet Maverick MK3 Wash - LED wash fixture
-- ============================================================================

DO $$
DECLARE
    maverick_id UUID;
BEGIN
    SELECT id INTO maverick_id FROM fixtures WHERE slug = 'chauvet-maverick-mk3-wash';
    
    IF maverick_id IS NOT NULL THEN
        -- Color Mixing
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            maverick_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'color-mixing'),
            36, 4
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Quiet Operation
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            maverick_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'quiet-operation'),
            40, 2
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Power Efficient
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            maverick_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'power-efficient'),
            42, 1
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
        
        -- Lightweight
        INSERT INTO fixture_endorsements (fixture_id, category_id, upvotes, downvotes)
        VALUES (
            maverick_id,
            (SELECT id FROM fixture_endorsement_categories WHERE slug = 'lightweight'),
            38, 3
        ) ON CONFLICT (fixture_id, category_id) DO NOTHING;
    END IF;
END $$;

-- Query to verify the endorsements
SELECT 
    f.name as fixture_name,
    m.name as manufacturer,
    fec.name as category,
    fec.is_positive,
    fe.upvotes,
    fe.downvotes,
    fe.net_score
FROM fixture_endorsements fe
INNER JOIN fixtures f ON fe.fixture_id = f.id
INNER JOIN manufacturers m ON f.manufacturer_id = m.id
INNER JOIN fixture_endorsement_categories fec ON fe.category_id = fec.id
ORDER BY f.name, fe.net_score DESC;
