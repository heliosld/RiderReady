-- RiderReady Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- MANUFACTURERS
-- ============================================================================

CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    website VARCHAR(500),
    country VARCHAR(100),
    description TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manufacturers_slug ON manufacturers(slug);

-- ============================================================================
-- FIXTURE TYPES & CATEGORIES
-- ============================================================================

CREATE TABLE fixture_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES fixture_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example categories: Automated Lights, Conventional Lights, Consoles, etc.

CREATE TABLE fixture_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category_id UUID REFERENCES fixture_categories(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example types: Moving Head Spot, Moving Head Wash, Moving Head Beam, etc.

-- ============================================================================
-- FIXTURES (Automated Lights)
-- ============================================================================

CREATE TABLE fixtures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manufacturer_id UUID REFERENCES manufacturers(id) NOT NULL,
    fixture_type_id UUID REFERENCES fixture_types(id) NOT NULL,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    model_number VARCHAR(100),
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    year_introduced INTEGER,
    discontinued BOOLEAN DEFAULT FALSE,
    
    -- Physical Specifications
    weight_kg DECIMAL(6,2),
    weight_lbs DECIMAL(6,2),
    width_mm INTEGER,
    height_mm INTEGER,
    depth_mm INTEGER,
    
    -- Electrical Specifications
    power_consumption_watts INTEGER,
    voltage VARCHAR(50), -- e.g., "100-240V"
    power_connector VARCHAR(100), -- e.g., "powerCON TRUE1"
    auto_sensing_power BOOLEAN DEFAULT FALSE,
    
    -- Light Source
    light_source_type VARCHAR(100), -- LED, Discharge, Tungsten, etc.
    light_source_wattage INTEGER,
    lamp_life_hours INTEGER,
    color_temperature_kelvin INTEGER,
    cri_rating INTEGER, -- Color Rendering Index
    
    -- Optical Specifications
    total_lumens INTEGER,
    beam_angle_min DECIMAL(5,2),
    beam_angle_max DECIMAL(5,2),
    field_angle_min DECIMAL(5,2),
    field_angle_max DECIMAL(5,2),
    zoom_type VARCHAR(50), -- Linear, Non-linear, Fixed
    
    -- Color System
    color_mixing_type VARCHAR(100), -- CMY, RGB, RGBW, etc.
    color_wheels_count INTEGER DEFAULT 0,
    
    -- Effects
    gobo_wheels_count INTEGER DEFAULT 0,
    rotating_gobos_count INTEGER DEFAULT 0,
    static_gobos_count INTEGER DEFAULT 0,
    animation_wheel BOOLEAN DEFAULT FALSE,
    prism BOOLEAN DEFAULT FALSE,
    prism_facets VARCHAR(50), -- e.g., "3-facet, 5-facet"
    frost BOOLEAN DEFAULT FALSE,
    iris BOOLEAN DEFAULT FALSE,
    shutter_strobe BOOLEAN DEFAULT FALSE,
    
    -- Control
    dmx_channels_min INTEGER,
    dmx_channels_max INTEGER,
    rdm_support BOOLEAN DEFAULT FALSE,
    art_net BOOLEAN DEFAULT FALSE,
    sacn BOOLEAN DEFAULT FALSE,
    wireless_dmx BOOLEAN DEFAULT FALSE,
    
    -- Pan/Tilt (for moving heads)
    pan_range_degrees INTEGER,
    tilt_range_degrees INTEGER,
    pan_tilt_16bit BOOLEAN DEFAULT FALSE,
    
    -- Other Features
    noise_level_db INTEGER,
    ip_rating VARCHAR(20), -- e.g., "IP20", "IP65"
    
    -- Media
    primary_image_url VARCHAR(500),
    manual_url VARCHAR(500),
    dmx_chart_url VARCHAR(500),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fixtures_manufacturer_name_unique UNIQUE(manufacturer_id, name)
);

CREATE INDEX idx_fixtures_manufacturer ON fixtures(manufacturer_id);
CREATE INDEX idx_fixtures_type ON fixtures(fixture_type_id);
CREATE INDEX idx_fixtures_slug ON fixtures(slug);
CREATE INDEX idx_fixtures_weight ON fixtures(weight_kg);
CREATE INDEX idx_fixtures_power ON fixtures(power_consumption_watts);

-- ============================================================================
-- FIXTURE IMAGES
-- ============================================================================

CREATE TABLE fixture_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fixture_images_fixture ON fixture_images(fixture_id);

-- ============================================================================
-- FIXTURE FEATURES (Many-to-Many for flexible tagging)
-- ============================================================================

CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100), -- e.g., "color", "effects", "control"
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fixture_features (
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (fixture_id, feature_id)
);

-- ============================================================================
-- VENDORS & DEALERS
-- ============================================================================

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    vendor_type VARCHAR(50), -- Dealer, Rental House, Manufacturer Direct
    
    -- Contact Information
    website VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Geographic Information
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    service_radius_km INTEGER,
    
    -- Business Information
    established_year INTEGER,
    description TEXT,
    logo_url VARCHAR(500),
    
    -- Metadata
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_country ON vendors(country);
CREATE INDEX idx_vendors_city ON vendors(city);
CREATE INDEX idx_vendors_location ON vendors(latitude, longitude);

-- ============================================================================
-- VENDOR LOCATIONS (Multiple locations per vendor)
-- ============================================================================

CREATE TABLE vendor_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    location_name VARCHAR(255) NOT NULL,
    is_headquarters BOOLEAN DEFAULT FALSE,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Geographic coordinates
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contact
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(500),
    
    -- Services
    services TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendor_locations_vendor ON vendor_locations(vendor_id);
CREATE INDEX idx_vendor_locations_location ON vendor_locations(latitude, longitude);

-- ============================================================================
-- VENDOR INVENTORY (Which vendors have which fixtures)
-- ============================================================================

CREATE TABLE vendor_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    quantity INTEGER,
    available_for_rental BOOLEAN DEFAULT TRUE,
    available_for_purchase BOOLEAN DEFAULT FALSE,
    notes TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(vendor_id, fixture_id)
);

CREATE INDEX idx_vendor_inventory_vendor ON vendor_inventory(vendor_id);
CREATE INDEX idx_vendor_inventory_fixture ON vendor_inventory(fixture_id);

-- ============================================================================
-- DMX MODES
-- ============================================================================

CREATE TABLE dmx_modes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
    mode_name VARCHAR(100) NOT NULL,
    channel_count INTEGER NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(fixture_id, mode_name)
);

CREATE TABLE dmx_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dmx_mode_id UUID REFERENCES dmx_modes(id) ON DELETE CASCADE,
    channel_number INTEGER NOT NULL,
    channel_name VARCHAR(100) NOT NULL,
    channel_function VARCHAR(255),
    default_value INTEGER,
    
    CONSTRAINT dmx_channels_mode_number_unique UNIQUE(dmx_mode_id, channel_number)
);

-- ============================================================================
-- TRIGGER: Update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manufacturers_updated_at BEFORE UPDATE ON manufacturers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixtures_updated_at BEFORE UPDATE ON fixtures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_locations_updated_at BEFORE UPDATE ON vendor_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA SEEDS (for development)
-- ============================================================================

-- Insert sample fixture categories
INSERT INTO fixture_categories (name, slug, description) VALUES
('Automated Lighting', 'automated-lighting', 'Intelligent lighting fixtures with automated features'),
('Conventional Lighting', 'conventional-lighting', 'Traditional non-automated lighting fixtures'),
('Consoles', 'consoles', 'Lighting control consoles');

-- Insert sample fixture types
INSERT INTO fixture_types (name, slug, description, category_id) VALUES
('Moving Head Spot', 'moving-head-spot', 'Automated spot fixtures with hard edge', 
    (SELECT id FROM fixture_categories WHERE slug = 'automated-lighting')),
('Moving Head Wash', 'moving-head-wash', 'Automated wash fixtures with soft edge', 
    (SELECT id FROM fixture_categories WHERE slug = 'automated-lighting')),
('Moving Head Beam', 'moving-head-beam', 'Automated beam fixtures with tight parallel beam', 
    (SELECT id FROM fixture_categories WHERE slug = 'automated-lighting')),
('Moving Head Profile', 'moving-head-profile', 'Automated profile fixtures with shutters', 
    (SELECT id FROM fixture_categories WHERE slug = 'automated-lighting'));

-- Insert sample manufacturers
INSERT INTO manufacturers (name, slug, website, country) VALUES
('Robe Lighting', 'robe', 'https://www.robe.cz', 'Czech Republic'),
('Martin Professional', 'martin', 'https://www.martin.com', 'Denmark'),
('Clay Paky', 'clay-paky', 'https://www.claypaky.it', 'Italy'),
('Chauvet Professional', 'chauvet', 'https://www.chauvetprofessional.com', 'USA'),
('GLP', 'glp', 'https://www.glp.de', 'Germany'),
('Ayrton', 'ayrton', 'https://www.ayrton.eu', 'France'),
('ETC', 'etc', 'https://www.etcconnect.com', 'USA');

-- Insert sample features
INSERT INTO features (name, slug, category) VALUES
('CMY Color Mixing', 'cmy-color-mixing', 'color'),
('RGB Color Mixing', 'rgb-color-mixing', 'color'),
('Color Wheel', 'color-wheel', 'color'),
('Gobo Wheel', 'gobo-wheel', 'effects'),
('Rotating Gobo', 'rotating-gobo', 'effects'),
('Prism', 'prism', 'effects'),
('Animation Wheel', 'animation-wheel', 'effects'),
('Frost', 'frost', 'effects'),
('Iris', 'iris', 'effects'),
('Framing Shutters', 'framing-shutters', 'effects'),
('Zoom', 'zoom', 'optics'),
('RDM', 'rdm', 'control'),
('Art-Net', 'art-net', 'control'),
('sACN', 'sacn', 'control'),
('Wireless DMX', 'wireless-dmx', 'control');
