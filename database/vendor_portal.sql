-- Vendor Portal Schema
-- Enables vendors to manage their inventory and profile

-- ============================================================================
-- USERS & AUTHENTICATION (Guest accounts for now)
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE,
    is_guest BOOLEAN DEFAULT true,
    
    -- Will be populated when auth is added
    username VARCHAR(255),
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    
    -- Profile
    full_name VARCHAR(255),
    company VARCHAR(255),
    role VARCHAR(100), -- 'vendor_admin', 'manufacturer_rep', 'user', etc.
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_session ON users(session_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- VENDOR CLAIMS (Who manages which vendor)
-- ============================================================================

CREATE TABLE vendor_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Claim status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    verification_method VARCHAR(50), -- 'email_domain', 'manual', 'contact_form'
    verification_notes TEXT,
    
    -- Contact info used for verification
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    
    -- Approval
    approved_by_user_id UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(vendor_id, user_id)
);

CREATE INDEX idx_vendor_claims_vendor ON vendor_claims(vendor_id);
CREATE INDEX idx_vendor_claims_user ON vendor_claims(user_id);
CREATE INDEX idx_vendor_claims_status ON vendor_claims(status);

-- ============================================================================
-- VENDOR INVENTORY
-- ============================================================================

CREATE TABLE vendor_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    
    -- Tier 1: Simple tracking
    quantity_range VARCHAR(20), -- '1-10', '10-50', '50-100', '100+', 'in-stock'
    available_for_rental BOOLEAN DEFAULT true,
    available_for_purchase BOOLEAN DEFAULT false,
    show_on_vendor_page BOOLEAN DEFAULT true,
    
    -- Tier 2: Advanced tracking (optional)
    exact_quantity INTEGER,
    pricing_per_day DECIMAL(10,2),
    pricing_per_week DECIMAL(10,2),
    pricing_notes TEXT,
    condition_notes TEXT,
    last_maintenance_date DATE,
    
    -- Which locations have this fixture
    -- NULL means all locations, otherwise specific location IDs
    location_ids UUID[],
    
    -- Metadata
    added_by_user_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(vendor_id, fixture_id)
);

CREATE INDEX idx_vendor_inventory_vendor ON vendor_inventory(vendor_id);
CREATE INDEX idx_vendor_inventory_fixture ON vendor_inventory(fixture_id);
CREATE INDEX idx_vendor_inventory_rental ON vendor_inventory(available_for_rental) WHERE available_for_rental = true;
CREATE INDEX idx_vendor_inventory_purchase ON vendor_inventory(available_for_purchase) WHERE available_for_purchase = true;

-- ============================================================================
-- USER FAVORITES
-- ============================================================================

CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, fixture_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_fixture ON user_favorites(fixture_id);

-- ============================================================================
-- USER ENDORSEMENT VOTES
-- ============================================================================

CREATE TABLE user_endorsement_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    category_id UUID REFERENCES fixture_endorsement_categories(id) ON DELETE CASCADE,
    
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, fixture_id, category_id)
);

CREATE INDEX idx_user_votes_user ON user_endorsement_votes(user_id);
CREATE INDEX idx_user_votes_fixture ON user_endorsement_votes(fixture_id);
CREATE INDEX idx_user_votes_category ON user_endorsement_votes(category_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_claims_updated_at BEFORE UPDATE ON vendor_claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_inventory_updated_at BEFORE UPDATE ON vendor_inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_votes_updated_at BEFORE UPDATE ON user_endorsement_votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
