-- ============================================================================
-- VENDOR LOCATIONS (For vendors with multiple locations)
-- ============================================================================

CREATE TABLE vendor_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    
    -- Location Name/Identifier
    location_name VARCHAR(255) NOT NULL, -- e.g., "New York Office", "Los Angeles Branch"
    is_headquarters BOOLEAN DEFAULT FALSE,
    
    -- Contact Information
    phone VARCHAR(50),
    email VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    
    -- Geographic Information
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    service_radius_km INTEGER,
    
    -- Operating Information
    hours_of_operation TEXT, -- JSON or text like "Mon-Fri: 9am-5pm"
    services_offered TEXT[], -- Array: ["Rental", "Sales", "Service", "Installation"]
    
    -- Metadata
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendor_locations_vendor ON vendor_locations(vendor_id);
CREATE INDEX idx_vendor_locations_country ON vendor_locations(country);
CREATE INDEX idx_vendor_locations_city ON vendor_locations(city);
CREATE INDEX idx_vendor_locations_location ON vendor_locations(latitude, longitude);

-- ============================================================================
-- SAMPLE DATA: Multi-Location Vendors
-- ============================================================================

-- Global Vendor: PRG (Production Resource Group) - Major international rental house
INSERT INTO vendors (name, slug, vendor_type, website, email, phone, description, established_year, verified, active)
VALUES 
(
    'PRG',
    'prg',
    'Rental House',
    'https://www.prg.com',
    'contact@prg.com',
    '+1-888-774-7467',
    'PRG is a leading global provider of entertainment and event technology solutions. With offices worldwide, PRG delivers rental, sales, and production services for live events, broadcast, and fixed installations.',
    1995,
    TRUE,
    TRUE
);

-- PRG Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, phone, email, address_line1, city, state_province, postal_code, country, latitude, longitude, services_offered)
VALUES
-- North America
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG New York', FALSE, '+1-212-777-1000', 'newyork@prg.com', '630 Ninth Avenue', 'New York', 'NY', '10036', 'United States', 40.7589, -73.9894, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Los Angeles', FALSE, '+1-818-567-6688', 'losangeles@prg.com', '5439 San Fernando Road West', 'Los Angeles', 'CA', '90039', 'United States', 34.1234, -118.2415, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Las Vegas', FALSE, '+1-702-942-4774', 'lasvegas@prg.com', '4660 South Wynn Road', 'Las Vegas', 'NV', '89103', 'United States', 36.0920, -115.1739, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Nashville', FALSE, '+1-615-565-8484', 'nashville@prg.com', '11 Music Circle South', 'Nashville', 'TN', '37203', 'United States', 36.1540, -86.7810, ARRAY['Rental', 'Sales', 'Service']),
-- Europe
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG London', FALSE, '+44-20-7482-9200', 'london@prg.com', '115 Chalk Farm Road', 'London', 'England', 'NW1 8AG', 'United Kingdom', 51.5432, -0.1501, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Hamburg', FALSE, '+49-40-55-56-30-0', 'hamburg@prg.com', 'Wendenstrasse 300', 'Hamburg', 'Hamburg', '20537', 'Germany', 53.5511, 10.0253, ARRAY['Rental', 'Sales', 'Service']),
-- Asia Pacific
((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Singapore', FALSE, '+65-6291-7773', 'singapore@prg.com', '8 Pandan Crescent', 'Singapore', '', '128464', 'Singapore', 1.3116, 103.7496, ARRAY['Rental', 'Sales', 'Service']);

-- Large US Vendor: 4Wall Entertainment
INSERT INTO vendors (name, slug, vendor_type, website, email, phone, description, established_year, verified, active)
VALUES 
(
    '4Wall Entertainment',
    '4wall-entertainment',
    'Rental House',
    'https://www.4wall.com',
    'info@4wall.com',
    '+1-888-999-9255',
    '4Wall Entertainment provides full production services for concerts, Broadway, corporate events, and more. With locations across North America, 4Wall offers lighting, video, rigging, and audio equipment.',
    1997,
    TRUE,
    TRUE
);

INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, phone, email, address_line1, city, state_province, postal_code, country, latitude, longitude, services_offered)
VALUES
((SELECT id FROM vendors WHERE slug = '4wall-entertainment'), '4Wall Los Angeles', TRUE, '+1-818-252-2000', 'la@4wall.com', '6255 Sunset Boulevard', 'Los Angeles', 'CA', '90028', 'United States', 34.0983, -118.3267, ARRAY['Rental', 'Sales', 'Service', 'Installation']),
((SELECT id FROM vendors WHERE slug = '4wall-entertainment'), '4Wall New York', FALSE, '+1-212-244-4470', 'ny@4wall.com', '315 West 36th Street', 'New York', 'NY', '10018', 'United States', 40.7549, -73.9927, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = '4wall-entertainment'), '4Wall Las Vegas', FALSE, '+1-702-942-5554', 'lv@4wall.com', '3890 South Jones Boulevard', 'Las Vegas', 'NV', '89103', 'United States', 36.1215, -115.2245, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = '4wall-entertainment'), '4Wall Nashville', FALSE, '+1-615-873-6000', 'nash@4wall.com', '1201 Hamilton Street', 'Nashville', 'TN', '37208', 'United States', 36.1790, -86.7892, ARRAY['Rental', 'Sales']),
((SELECT id FROM vendors WHERE slug = '4wall-entertainment'), '4Wall Orlando', FALSE, '+1-407-352-6060', 'orlando@4wall.com', '2820 Old Winter Garden Road', 'Orlando', 'FL', '32805', 'United States', 28.5411, -81.4145, ARRAY['Rental', 'Sales']);

-- European Vendor: Neg Earth
INSERT INTO vendors (name, slug, vendor_type, website, email, phone, description, established_year, verified, active)
VALUES 
(
    'Neg Earth',
    'neg-earth',
    'Rental House',
    'https://www.negearth.com',
    'info@negearth.com',
    '+44-115-986-6123',
    'Neg Earth is one of the UK and Europe''s leading suppliers of lighting, sound, video, and rigging equipment for live events, touring, and installations.',
    1973,
    TRUE,
    TRUE
);

INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, phone, email, address_line1, city, state_province, postal_code, country, latitude, longitude, services_offered)
VALUES
((SELECT id FROM vendors WHERE slug = 'neg-earth'), 'Neg Earth Nottingham', TRUE, '+44-115-986-6123', 'nottingham@negearth.com', 'Phoenix Park', 'Nottingham', 'Nottinghamshire', 'NG8 6AS', 'United Kingdom', 52.9770, -1.1978, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'neg-earth'), 'Neg Earth London', FALSE, '+44-20-8965-4444', 'london@negearth.com', 'Park Royal', 'London', 'Greater London', 'NW10 7XR', 'United Kingdom', 51.5274, -0.2739, ARRAY['Rental', 'Sales']);

-- Australian Vendor: Chameleon Touring Systems
INSERT INTO vendors (name, slug, vendor_type, website, email, phone, description, established_year, verified, active)
VALUES 
(
    'Chameleon Touring Systems',
    'chameleon-touring-systems',
    'Rental House',
    'https://www.chameleon.com.au',
    'info@chameleon.com.au',
    '+61-3-9800-4455',
    'Chameleon is Australia''s leading provider of professional audio, lighting, and video equipment for touring productions, corporate events, and festivals.',
    1984,
    TRUE,
    TRUE
);

INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, phone, email, address_line1, city, state_province, postal_code, country, latitude, longitude, services_offered)
VALUES
((SELECT id FROM vendors WHERE slug = 'chameleon-touring-systems'), 'Chameleon Melbourne', TRUE, '+61-3-9800-4455', 'melbourne@chameleon.com.au', '85 Garden Drive', 'Melbourne', 'Victoria', '3170', 'Australia', -37.9949, 145.1206, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'chameleon-touring-systems'), 'Chameleon Sydney', FALSE, '+61-2-9669-8555', 'sydney@chameleon.com.au', '1 Harrick Road', 'Sydney', 'New South Wales', '2170', 'Australia', -33.9168, 150.9822, ARRAY['Rental', 'Sales']),
((SELECT id FROM vendors WHERE slug = 'chameleon-touring-systems'), 'Chameleon Brisbane', FALSE, '+61-7-3274-4999', 'brisbane@chameleon.com.au', '275 Bradman Street', 'Brisbane', 'Queensland', '4178', 'Australia', -27.5598, 153.1435, ARRAY['Rental', 'Sales']);

-- Regional US Vendor: Volt Lites
INSERT INTO vendors (name, slug, vendor_type, website, email, phone, description, established_year, verified, active)
VALUES 
(
    'Volt Lites',
    'volt-lites',
    'Rental House',
    'https://www.voltlites.com',
    'info@voltlites.com',
    '+1-609-882-8000',
    'Volt Lites provides lighting, video, and rigging services for concerts, corporate events, and broadcast productions across the eastern United States.',
    1989,
    TRUE,
    TRUE
);

INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, phone, email, address_line1, city, state_province, postal_code, country, latitude, longitude, services_offered)
VALUES
((SELECT id FROM vendors WHERE slug = 'volt-lites'), 'Volt Lites Pennsauken (HQ)', TRUE, '+1-609-882-8000', 'nj@voltlites.com', '124 Industrial Way East', 'Pennsauken', 'NJ', '08110', 'United States', 39.9659, -75.0485, ARRAY['Rental', 'Sales', 'Service']),
((SELECT id FROM vendors WHERE slug = 'volt-lites'), 'Volt Lites Nashville', FALSE, '+1-615-232-4488', 'nashville@voltlites.com', '700 President Ronald Reagan Way', 'Nashville', 'TN', '37210', 'United States', 36.1540, -86.7489, ARRAY['Rental', 'Sales']);

-- Single Location Vendors (for comparison)
INSERT INTO vendors (name, slug, vendor_type, website, email, phone, address_line1, city, state_province, postal_code, country, description, established_year, verified, active)
VALUES 
(
    'Barbizon Lighting Company',
    'barbizon-lighting',
    'Dealer',
    'https://www.barbizon.com',
    'boston@barbizon.com',
    '+1-617-426-5230',
    '40 Guest Street',
    'Boston',
    'MA',
    '02135',
    'United States',
    'Theatrical and entertainment lighting dealer serving New England. Offering sales, rentals, and service for stage lighting, rigging, and control systems.',
    1947,
    TRUE,
    TRUE
),
(
    'Theatrix Lighting',
    'theatrix-lighting',
    'Rental House',
    'https://www.theatrixlighting.com',
    'info@theatrixlighting.com',
    '+1-312-555-0100',
    '2525 West 16th Street',
    'Chicago',
    'IL',
    '60608',
    'United States',
    'Chicago-based lighting and production services for theatre, corporate events, and concerts. Family-owned and operated for over 30 years.',
    1990,
    TRUE,
    TRUE
);

-- ============================================================================
-- NOTES ON USAGE
-- ============================================================================

-- Query to get all locations for a vendor:
-- SELECT v.name, vl.location_name, vl.city, vl.country, vl.services_offered
-- FROM vendors v
-- JOIN vendor_locations vl ON v.id = vl.vendor_id
-- WHERE v.slug = 'prg'
-- ORDER BY vl.is_headquarters DESC, vl.location_name;

-- Query to find all vendors with multiple locations:
-- SELECT v.name, COUNT(vl.id) as location_count
-- FROM vendors v
-- JOIN vendor_locations vl ON v.id = vl.vendor_id
-- GROUP BY v.id, v.name
-- HAVING COUNT(vl.id) > 1
-- ORDER BY location_count DESC;

-- Query to show vendors by location (including both single and multi-location):
-- SELECT 
--     v.name,
--     COALESCE(vl.city, v.city) as city,
--     COALESCE(vl.country, v.country) as country,
--     CASE WHEN vl.id IS NOT NULL THEN vl.location_name ELSE 'Single Location' END as location_name
-- FROM vendors v
-- LEFT JOIN vendor_locations vl ON v.id = vl.vendor_id
-- WHERE v.active = TRUE;
