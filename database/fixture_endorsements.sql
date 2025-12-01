-- Fixture Endorsements Schema
-- Tracks community feedback on fixture characteristics by fixture type

-- ============================================================================
-- FIXTURE ENDORSEMENT CATEGORIES
-- ============================================================================

CREATE TABLE fixture_endorsement_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Icon name for UI
    is_positive BOOLEAN DEFAULT TRUE, -- TRUE for strengths, FALSE for weaknesses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- FIXTURE ENDORSEMENTS
-- ============================================================================

CREATE TABLE fixture_endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    category_id UUID REFERENCES fixture_endorsement_categories(id) ON DELETE CASCADE,
    
    -- Vote counts
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    net_score INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(fixture_id, category_id)
);

CREATE INDEX idx_fixture_endorsements_fixture ON fixture_endorsements(fixture_id);
CREATE INDEX idx_fixture_endorsements_score ON fixture_endorsements(net_score DESC);

-- ============================================================================
-- USER VOTES (Track individual votes to prevent duplicate voting)
-- ============================================================================

CREATE TABLE fixture_endorsement_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endorsement_id UUID REFERENCES fixture_endorsements(id) ON DELETE CASCADE,
    
    -- Session-based tracking (can be upgraded to user accounts later)
    session_id VARCHAR(255) NOT NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(endorsement_id, session_id)
);

CREATE INDEX idx_fixture_endorsement_votes_endorsement ON fixture_endorsement_votes(endorsement_id);
CREATE INDEX idx_fixture_endorsement_votes_session ON fixture_endorsement_votes(session_id);

-- ============================================================================
-- SEED DATA - Fixture Endorsement Categories
-- ============================================================================

INSERT INTO fixture_endorsement_categories (name, slug, description, icon, is_positive) VALUES
-- Strengths (Positive)
('Bright Output', 'bright-output', 'Exceptional brightness and intensity', 'Sun', TRUE),
('Color Mixing', 'color-mixing', 'Excellent color reproduction and mixing', 'Palette', TRUE),
('Smooth Dimming', 'smooth-dimming', 'Flicker-free dimming curve', 'SlidersHorizontal', TRUE),
('Fast Movement', 'fast-movement', 'Quick and precise pan/tilt movement', 'Zap', TRUE),
('Quiet Operation', 'quiet-operation', 'Low noise levels during operation', 'Volume', TRUE),
('Build Quality', 'build-quality', 'Rugged and well-constructed', 'Shield', TRUE),
('Easy Maintenance', 'easy-maintenance', 'Simple to service and maintain', 'Wrench', TRUE),
('Optics Quality', 'optics-quality', 'Sharp, clean beam quality', 'Eye', TRUE),
('Feature Rich', 'feature-rich', 'Extensive effects and programming options', 'Sparkles', TRUE),
('Reliable', 'reliable', 'Consistent performance show after show', 'CheckCircle', TRUE),
('Lightweight', 'lightweight', 'Easy to transport and rig', 'Feather', TRUE),
('Power Efficient', 'power-efficient', 'Low power consumption', 'Battery', TRUE),

-- Weaknesses (Negative)
('Dim Output', 'dim-output', 'Below expected brightness levels', 'CloudOff', FALSE),
('Poor Color', 'poor-color', 'Limited or inaccurate color reproduction', 'PaletteOff', FALSE),
('Flickering', 'flickering', 'Visible flicker on camera or at low levels', 'FlashlightOff', FALSE),
('Slow Movement', 'slow-movement', 'Sluggish pan/tilt response', 'Turtle', FALSE),
('Loud Operation', 'loud-operation', 'Excessive fan or mechanical noise', 'Volume2', FALSE),
('Poor Build', 'poor-build', 'Flimsy construction or frequent failures', 'AlertTriangle', FALSE),
('Hard to Service', 'hard-to-service', 'Difficult or expensive to maintain', 'WrenchOff', FALSE),
('Poor Optics', 'poor-optics', 'Fuzzy or inconsistent beam', 'EyeOff', FALSE),
('Limited Features', 'limited-features', 'Lacks expected functionality', 'MinusCircle', FALSE),
('Unreliable', 'unreliable', 'Frequent failures or inconsistent behavior', 'XCircle', FALSE),
('Heavy', 'heavy', 'Difficult to transport or rig', 'Weight', FALSE),
('Power Hungry', 'power-hungry', 'High power consumption', 'BatteryWarning', FALSE);

-- ============================================================================
-- FUNCTIONS - Update endorsement counts
-- ============================================================================

-- Function to update vote counts when a vote is added/changed
CREATE OR REPLACE FUNCTION update_fixture_endorsement_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- New vote
        IF NEW.vote_type = 'up' THEN
            UPDATE fixture_endorsements 
            SET upvotes = upvotes + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.endorsement_id;
        ELSE
            UPDATE fixture_endorsements 
            SET downvotes = downvotes + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.endorsement_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Vote changed
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE fixture_endorsements 
            SET upvotes = upvotes - 1, downvotes = downvotes + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.endorsement_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE fixture_endorsements 
            SET upvotes = upvotes + 1, downvotes = downvotes - 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.endorsement_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Vote removed
        IF OLD.vote_type = 'up' THEN
            UPDATE fixture_endorsements 
            SET upvotes = upvotes - 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.endorsement_id;
        ELSE
            UPDATE fixture_endorsements 
            SET downvotes = downvotes - 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.endorsement_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update counts
CREATE TRIGGER trg_update_fixture_endorsement_counts
AFTER INSERT OR UPDATE OR DELETE ON fixture_endorsement_votes
FOR EACH ROW
EXECUTE FUNCTION update_fixture_endorsement_counts();

-- ============================================================================
-- VIEWS - Helpful queries
-- ============================================================================

-- View for top endorsed fixtures
CREATE OR REPLACE VIEW top_endorsed_fixtures AS
SELECT 
    f.id,
    f.name,
    f.slug,
    m.name as manufacturer_name,
    ft.name as fixture_type,
    SUM(fe.net_score) as total_endorsement_score,
    COUNT(fe.id) as endorsement_count
FROM fixtures f
INNER JOIN manufacturers m ON f.manufacturer_id = m.id
INNER JOIN fixture_types ft ON f.fixture_type_id = ft.id
LEFT JOIN fixture_endorsements fe ON f.id = fe.fixture_id
GROUP BY f.id, f.name, f.slug, m.name, ft.name
HAVING COUNT(fe.id) > 0
ORDER BY total_endorsement_score DESC;
