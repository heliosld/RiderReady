-- Vendor Endorsements Schema
-- Tracks community feedback on vendor strengths and weaknesses

-- ============================================================================
-- ENDORSEMENT CATEGORIES
-- ============================================================================

CREATE TABLE endorsement_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Icon name for UI
    is_positive BOOLEAN DEFAULT TRUE, -- TRUE for strengths, FALSE for weaknesses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- VENDOR ENDORSEMENTS
-- ============================================================================

CREATE TABLE vendor_endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES endorsement_categories(id) ON DELETE CASCADE,
    
    -- Vote counts
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    net_score INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(vendor_id, category_id)
);

CREATE INDEX idx_vendor_endorsements_vendor ON vendor_endorsements(vendor_id);
CREATE INDEX idx_vendor_endorsements_score ON vendor_endorsements(net_score DESC);

-- ============================================================================
-- USER VOTES (Track individual votes to prevent duplicate voting)
-- ============================================================================

CREATE TABLE endorsement_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endorsement_id UUID REFERENCES vendor_endorsements(id) ON DELETE CASCADE,
    
    -- For now, we'll use session-based tracking (can be upgraded to user accounts later)
    session_id VARCHAR(255) NOT NULL, -- Browser session or user ID
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(endorsement_id, session_id)
);

CREATE INDEX idx_endorsement_votes_endorsement ON endorsement_votes(endorsement_id);
CREATE INDEX idx_endorsement_votes_session ON endorsement_votes(session_id);

-- ============================================================================
-- SEED DATA - Endorsement Categories
-- ============================================================================

INSERT INTO endorsement_categories (name, slug, description, icon, is_positive) VALUES
-- Strengths (Positive)
('Inventory Depth', 'inventory-depth', 'Large selection and availability of equipment', 'Package', TRUE),
('Customer Service', 'customer-service', 'Responsive and helpful support team', 'Headphones', TRUE),
('Equipment Condition', 'equipment-condition', 'Well-maintained, clean gear', 'Sparkles', TRUE),
('Fast Turnaround', 'fast-turnaround', 'Quick quotes and efficient logistics', 'Zap', TRUE),
('Competitive Pricing', 'competitive-pricing', 'Fair and transparent pricing', 'DollarSign', TRUE),
('Technical Expertise', 'technical-expertise', 'Knowledgeable staff and tech support', 'Lightbulb', TRUE),
('Reliable Delivery', 'reliable-delivery', 'On-time delivery and pickup', 'Truck', TRUE),
('Flexibility', 'flexibility', 'Accommodating to last-minute changes', 'Shuffle', TRUE),
('Documentation', 'documentation', 'Clear paperwork and equipment specs', 'FileText', TRUE),
('Multi-City Coverage', 'multi-city', 'Strong presence across multiple markets', 'MapPin', TRUE),

-- Weaknesses (Negative)
('Limited Inventory', 'limited-inventory', 'Frequently out of stock on key items', 'Package', FALSE),
('Poor Communication', 'poor-communication', 'Slow to respond or unclear communication', 'MessageCircleX', FALSE),
('Equipment Issues', 'equipment-issues', 'Gear often needs service or is dirty', 'AlertTriangle', FALSE),
('Slow Response', 'slow-response', 'Delayed quotes or logistics coordination', 'Clock', FALSE),
('High Prices', 'high-prices', 'Above-market pricing', 'TrendingUp', FALSE),
('Inexperienced Staff', 'inexperienced-staff', 'Staff lacks technical knowledge', 'UserX', FALSE),
('Delivery Problems', 'delivery-problems', 'Late or missed deliveries', 'TruckOff', FALSE),
('Rigid Policies', 'rigid-policies', 'Inflexible terms and policies', 'Lock', FALSE),
('Poor Documentation', 'poor-documentation', 'Missing or incomplete paperwork', 'FileX', FALSE),
('Limited Coverage', 'limited-coverage', 'Only serves specific markets', 'MapPinOff', FALSE);

-- ============================================================================
-- FUNCTIONS - Update endorsement counts
-- ============================================================================

-- Function to update vote counts when a vote is added/changed
CREATE OR REPLACE FUNCTION update_endorsement_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'up' THEN
            UPDATE vendor_endorsements 
            SET upvotes = upvotes + 1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = NEW.endorsement_id;
        ELSE
            UPDATE vendor_endorsements 
            SET downvotes = downvotes + 1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = NEW.endorsement_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE vendor_endorsements 
            SET upvotes = upvotes - 1, downvotes = downvotes + 1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = NEW.endorsement_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE vendor_endorsements 
            SET upvotes = upvotes + 1, downvotes = downvotes - 1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = NEW.endorsement_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'up' THEN
            UPDATE vendor_endorsements 
            SET upvotes = upvotes - 1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = OLD.endorsement_id;
        ELSE
            UPDATE vendor_endorsements 
            SET downvotes = downvotes - 1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = OLD.endorsement_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update counts
CREATE TRIGGER endorsement_vote_changes
    AFTER INSERT OR UPDATE OR DELETE ON endorsement_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_endorsement_counts();
