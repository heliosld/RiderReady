-- ============================================================================
-- INTERACTIVE FEATURES FOR FIXTURE PAGES
-- Tracking user engagement, preferences, and behavior for manufacturer insights
-- ============================================================================

-- Use Case Selections (track what users are looking for)
CREATE TABLE IF NOT EXISTS fixture_use_case_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    use_case VARCHAR(100) NOT NULL, -- 'concert_touring', 'theater', 'corporate_events', 'broadcast', 'architectural', 'worship', 'club_dj', 'outdoor_events'
    user_role VARCHAR(100), -- 'lighting_designer', 'rental_company', 'venue_manager', 'production_company', 'student', 'other'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent duplicate selections per session
    UNIQUE(fixture_id, session_id)
);

CREATE INDEX idx_use_case_fixture ON fixture_use_case_selections(fixture_id);
CREATE INDEX idx_use_case_category ON fixture_use_case_selections(use_case);
CREATE INDEX idx_use_case_date ON fixture_use_case_selections(created_at);

-- Comparison Tracking (what fixtures are compared against each other)
CREATE TABLE IF NOT EXISTS fixture_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    fixture_ids UUID[] NOT NULL, -- Array of fixture IDs in comparison
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comparison_session ON fixture_comparisons(session_id);
CREATE INDEX idx_comparison_date ON fixture_comparisons(created_at);
CREATE INDEX idx_comparison_fixtures ON fixture_comparisons USING GIN(fixture_ids);

-- Feature Importance Votes (which specs matter most to users)
CREATE TABLE IF NOT EXISTS feature_importance_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    feature_name VARCHAR(100) NOT NULL, -- 'brightness', 'color_mixing', 'zoom_range', 'beam_effects', 'weight', 'price', 'reliability', 'noise_level'
    importance INT CHECK (importance BETWEEN 1 AND 5), -- 1=not important, 5=critical
    use_case VARCHAR(100), -- Context of importance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- One vote per feature per session
    UNIQUE(fixture_id, session_id, feature_name)
);

CREATE INDEX idx_feature_votes_fixture ON feature_importance_votes(fixture_id);
CREATE INDEX idx_feature_votes_feature ON feature_importance_votes(feature_name);

-- Demo Requests (direct lead generation for manufacturers)
CREATE TABLE IF NOT EXISTS demo_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    
    -- Contact Information
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    
    -- Context
    use_case VARCHAR(100),
    role VARCHAR(100),
    message TEXT,
    preferred_contact_method VARCHAR(50), -- 'email', 'phone', 'either'
    
    -- Tracking
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'contacted', 'scheduled', 'completed', 'declined'
    contacted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_demo_fixture ON demo_requests(fixture_id);
CREATE INDEX idx_demo_manufacturer ON demo_requests(manufacturer_id);
CREATE INDEX idx_demo_status ON demo_requests(status);
CREATE INDEX idx_demo_date ON demo_requests(created_at);

-- Page Views & Engagement (track what users look at)
CREATE TABLE IF NOT EXISTS fixture_page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    
    -- User Context
    referrer VARCHAR(500), -- Where they came from
    use_case VARCHAR(100), -- If they selected one
    user_role VARCHAR(100),
    
    -- Engagement Metrics
    time_on_page_seconds INT,
    scrolled_to_specs BOOLEAN DEFAULT FALSE,
    scrolled_to_vendors BOOLEAN DEFAULT FALSE,
    scrolled_to_ratings BOOLEAN DEFAULT FALSE,
    clicked_vendor BOOLEAN DEFAULT FALSE,
    clicked_comparison BOOLEAN DEFAULT FALSE,
    clicked_demo_request BOOLEAN DEFAULT FALSE,
    unit_toggled BOOLEAN DEFAULT FALSE, -- Did they toggle metric/imperial
    
    -- Geographic
    country_code VARCHAR(10),
    region VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_fixture ON fixture_page_views(fixture_id);
CREATE INDEX idx_page_views_session ON fixture_page_views(session_id);
CREATE INDEX idx_page_views_date ON fixture_page_views(created_at);
CREATE INDEX idx_page_views_country ON fixture_page_views(country_code);

-- User Fixture Ratings (quick star ratings)
CREATE TABLE IF NOT EXISTS fixture_user_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    
    -- Ratings (1-5 stars)
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
    reliability_rating INT CHECK (reliability_rating BETWEEN 1 AND 5),
    value_rating INT CHECK (value_rating BETWEEN 1 AND 5),
    support_rating INT CHECK (support_rating BETWEEN 1 AND 5),
    
    -- Context
    has_used BOOLEAN DEFAULT TRUE, -- Did they actually use this fixture?
    use_case VARCHAR(100),
    would_recommend BOOLEAN,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- One rating set per session
    UNIQUE(fixture_id, session_id)
);

CREATE INDEX idx_user_ratings_fixture ON fixture_user_ratings(fixture_id);
CREATE INDEX idx_user_ratings_overall ON fixture_user_ratings(overall_rating);
CREATE INDEX idx_user_ratings_date ON fixture_user_ratings(created_at);

-- Wishlist / Favorites (long-term interest tracking)
CREATE TABLE IF NOT EXISTS fixture_wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255), -- Optional, if they want notifications
    
    -- Context
    intent VARCHAR(50), -- 'rental', 'purchase', 'research', 'comparison'
    notes TEXT,
    
    -- Tracking
    is_active BOOLEAN DEFAULT TRUE,
    removed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(fixture_id, session_id)
);

CREATE INDEX idx_wishlist_fixture ON fixture_wishlist(fixture_id);
CREATE INDEX idx_wishlist_session ON fixture_wishlist(session_id);
CREATE INDEX idx_wishlist_active ON fixture_wishlist(is_active);

-- Spec Tooltip Interactions (which specs confuse users)
CREATE TABLE IF NOT EXISTS spec_tooltip_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    spec_name VARCHAR(100) NOT NULL, -- Which spec they clicked for help
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tooltip_fixture ON spec_tooltip_interactions(fixture_id);
CREATE INDEX idx_tooltip_spec ON spec_tooltip_interactions(spec_name);

-- Vendor Contact Clicks (track vendor interest)
CREATE TABLE IF NOT EXISTS vendor_contact_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    contact_type VARCHAR(50), -- 'email', 'phone', 'website', 'location_view'
    use_case VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendor_clicks_fixture ON vendor_contact_clicks(fixture_id);
CREATE INDEX idx_vendor_clicks_vendor ON vendor_contact_clicks(vendor_id);
CREATE INDEX idx_vendor_clicks_date ON vendor_contact_clicks(created_at);

-- ============================================================================
-- VIEWS FOR MANUFACTURER ANALYTICS
-- ============================================================================

-- Aggregated fixture insights
CREATE OR REPLACE VIEW manufacturer_fixture_insights AS
SELECT 
    f.id AS fixture_id,
    f.name AS fixture_name,
    f.manufacturer_id,
    m.name AS manufacturer_name,
    
    -- Page Traffic
    COUNT(DISTINCT pv.session_id) AS unique_visitors,
    AVG(pv.time_on_page_seconds) AS avg_time_on_page,
    SUM(CASE WHEN pv.clicked_vendor THEN 1 ELSE 0 END) AS vendor_clicks,
    SUM(CASE WHEN pv.clicked_comparison THEN 1 ELSE 0 END) AS comparison_adds,
    
    -- Use Cases
    (SELECT json_agg(json_build_object('use_case', use_case, 'count', count))
     FROM (
         SELECT use_case, COUNT(*) as count
         FROM fixture_use_case_selections
         WHERE fixture_id = f.id
         GROUP BY use_case
         ORDER BY count DESC
     ) uc) AS use_case_breakdown,
    
    -- Demo Requests
    (SELECT COUNT(*) FROM demo_requests WHERE fixture_id = f.id) AS demo_requests_count,
    
    -- Ratings
    (SELECT AVG(overall_rating) FROM fixture_user_ratings WHERE fixture_id = f.id) AS avg_overall_rating,
    (SELECT AVG(reliability_rating) FROM fixture_user_ratings WHERE fixture_id = f.id) AS avg_reliability_rating,
    (SELECT COUNT(*) FROM fixture_user_ratings WHERE fixture_id = f.id AND would_recommend = TRUE) AS recommend_count,
    
    -- Wishlist
    (SELECT COUNT(*) FROM fixture_wishlist WHERE fixture_id = f.id AND is_active = TRUE) AS wishlist_count

FROM fixtures f
JOIN manufacturers m ON f.manufacturer_id = m.id
LEFT JOIN fixture_page_views pv ON f.id = pv.fixture_id
GROUP BY f.id, f.name, f.manufacturer_id, m.name;

-- Feature importance trends
CREATE OR REPLACE VIEW feature_importance_trends AS
SELECT 
    f.id AS fixture_id,
    f.name AS fixture_name,
    fiv.feature_name,
    AVG(fiv.importance) AS avg_importance,
    COUNT(*) AS vote_count,
    fiv.use_case
FROM feature_importance_votes fiv
JOIN fixtures f ON fiv.fixture_id = f.id
GROUP BY f.id, f.name, fiv.feature_name, fiv.use_case
ORDER BY avg_importance DESC;

-- Competitive comparison matrix
CREATE OR REPLACE VIEW competitive_comparisons AS
SELECT 
    unnest(fc.fixture_ids) AS fixture_id,
    COUNT(*) AS times_compared,
    array_agg(DISTINCT fc.fixture_ids) AS compared_with_sets
FROM fixture_comparisons fc
GROUP BY unnest(fc.fixture_ids)
ORDER BY times_compared DESC;

COMMENT ON TABLE fixture_use_case_selections IS 'Tracks what use cases users are interested in for each fixture';
COMMENT ON TABLE fixture_comparisons IS 'Tracks which fixtures users compare against each other - competitive intelligence';
COMMENT ON TABLE demo_requests IS 'Direct lead generation for manufacturers';
COMMENT ON TABLE fixture_page_views IS 'Detailed engagement metrics for each page view';
COMMENT ON TABLE fixture_user_ratings IS 'Quick star ratings from users with experience';
COMMENT ON TABLE feature_importance_votes IS 'Which specs matter most to users in different contexts';
