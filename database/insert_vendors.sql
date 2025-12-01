-- RiderReady Vendor Location Data
-- Real vendor locations with GPS coordinates

-- ============================================================================
-- INSERT VENDORS
-- ============================================================================

-- PRG (Production Resource Group)
INSERT INTO vendors (name, slug, vendor_type, website, description, verified, active)
VALUES (
    'PRG',
    'prg',
    'Rental House',
    'https://www.prg.com',
    'PRG is a leading global provider of entertainment and event technology solutions.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- 4Wall Entertainment
INSERT INTO vendors (name, slug, vendor_type, website, description, verified, active)
VALUES (
    '4Wall Entertainment',
    '4wall',
    'Rental House',
    'https://www.4wall.com',
    '4Wall is one of North America''s largest lighting, video, and rigging rental companies.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Neg Earth
INSERT INTO vendors (name, slug, vendor_type, website, description, verified, active)
VALUES (
    'Neg Earth',
    'neg-earth',
    'Rental House',
    'https://www.negearth.com',
    'Neg Earth is a leading UK-based provider of lighting, video, and rigging solutions.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Solotech
INSERT INTO vendors (name, slug, vendor_type, website, description, verified, active)
VALUES (
    'Solotech',
    'solotech',
    'Rental House',
    'https://www.solotech.com',
    'Solotech is a global leader in entertainment technology and live events.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- VER (Video Equipment Rentals)
INSERT INTO vendors (name, slug, vendor_type, website, description, verified, active)
VALUES (
    'VER',
    'ver',
    'Rental House',
    'https://www.ver.com',
    'VER provides advanced video solutions and LED technology for live events.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- MBS Equipment Co.
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'MBS Equipment Co.',
    'mbs-equipment',
    'Rental House',
    'https://www.mbseco.com',
    'info@mbseco.com',
    'World''s largest studio-based equipment vendor with global presence.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Panavision / Panalux
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Panavision',
    'panavision',
    'Rental House',
    'https://www.panavision.com',
    'info@panavision.com',
    'Industry standard camera and lighting equipment provider.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- ARRI Rental
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'ARRI Rental',
    'arri-rental',
    'Rental House',
    'https://www.arrirental.com',
    'contact@arrirental.de',
    'High-end cinema proprietary lighting and camera systems.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Cinelease
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Cinelease',
    'cinelease',
    'Rental House',
    'https://www.cinelease.com',
    'info@cinelease.com',
    'Heavy inventory grip trucks and studio infrastructure across the USA.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Wooden Nickel Lighting
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Wooden Nickel Lighting',
    'wooden-nickel',
    'Rental House',
    'https://www.woodennickellighting.com',
    'rentals@woodennickellighting.com',
    'Indie film and music video production staple in Los Angeles.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Volt Lites
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Volt Lites',
    'volt-lites',
    'Rental House',
    'https://www.voltlites.com',
    'rentals@voltlites.com',
    'Cutting-edge LED and intelligent lighting solutions.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Barbizon Lighting
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Barbizon Lighting',
    'barbizon',
    'Rental House',
    'https://www.barbizon.com',
    'inquiry@barbizon.com',
    'Sales, expendables, and systems integration with national presence.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Eastern Effects
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Eastern Effects',
    'eastern-effects',
    'Rental House',
    'https://www.easterneffects.com',
    'info@easterneffects.com',
    'New York independent film favorite based in Brooklyn.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- PC&E
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'PC&E',
    'pce-atlanta',
    'Rental House',
    'https://www.pce-atlanta.com',
    'rental@pce-atlanta.com',
    'Major Atlanta stage and grip house serving the Southeast.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Serious Grippage & Light
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Serious Grippage & Light',
    'serious-grippage',
    'Rental House',
    'https://www.seriousgrippage.com',
    'rentals@seriousgrippage.com',
    'Key vendor for Netflix and New Mexico production hub.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- William F. White International
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'William F. White International',
    'whites',
    'Rental House',
    'https://www.whites.com',
    'info@whites.com',
    'Canada''s largest equipment provider with national coverage.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Pixipixel
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Pixipixel',
    'pixipixel',
    'Rental House',
    'https://www.pixipixel.com',
    'office@pixipixel.com',
    'Boutique eco-friendly lighting for commercials in London.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- TSF
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'TSF',
    'tsf',
    'Rental House',
    'https://www.tsf.fr',
    'contact@tsf.fr',
    'Premier French cinema rental house based in Paris.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Maier Bros.
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Maier Bros.',
    'maier-bros',
    'Rental House',
    'https://www.maierbros.de',
    'kontakt@maierbros.de',
    'German cinema standard with locations in Cologne and Berlin.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Vantage Film
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Vantage Film',
    'vantage-film',
    'Rental House',
    'https://www.vantagefilm.com',
    'prague@vantagefilm.com',
    'Eastern Europe hub for major features based in Prague.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Sanwa Cine Equipment
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Sanwa Cine Equipment',
    'sanwa-cine',
    'Rental House',
    'https://www.sanwa-group.com',
    'info@sanwa-group.com',
    'Major Japanese rental house serving Tokyo and beyond.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Gear Head
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Gear Head',
    'gear-head',
    'Rental House',
    'https://www.gearheadthailand.com',
    'marketing@gearheadthailand.com',
    'Largest equipment provider in Southeast Asia based in Bangkok.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- EFD International
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'EFD International',
    'efd-international',
    'Rental House',
    'https://www.efd-studios.com',
    'programacion@efd.com.mx',
    'Latin American production titan based in Mexico City.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- MCC (Movie Camera Co)
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'MCC (Movie Camera Co)',
    'mcc-south-africa',
    'Rental House',
    'https://www.mccsa.co.za',
    'saleswc@mccsa.co.za',
    'Services major international shoots in South Africa from Cape Town.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Bandit Lites
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Bandit Lites',
    'bandit-lites',
    'Rental House',
    'https://www.banditlites.com',
    'info@banditlites.com',
    'Pure touring lighting specialist with deep inventory in Knoxville and Nashville.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Upstaging Inc.
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Upstaging Inc.',
    'upstaging',
    'Rental House',
    'https://www.upstaging.com',
    'info@upstaging.com',
    'Major stadium tours provider specializing in lighting and trucking.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Christie Lites
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Christie Lites',
    'christie-lites',
    'Rental House',
    'https://www.christielites.com',
    'rentals-us@christielites.com',
    'Pure lighting provider with global presence and standardized efficiency model.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- LMG Touring
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'LMG Touring',
    'lmg-touring',
    'Rental House',
    'https://www.lmg.net',
    'touring@lmg.net',
    'High-tech integration specialist for lighting, video, and audio systems.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Fuse Technical Group
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Fuse Technical Group',
    'fuse-technical',
    'Rental House',
    'https://www.fuse-tg.com',
    'info@fusetg.com',
    'Complex LED video and lighting integration for major events.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Clearwing Productions
INSERT INTO vendors (name, slug, vendor_type, website, email, description, verified, active)
VALUES (
    'Clearwing Productions',
    'clearwing',
    'Rental House',
    'https://www.clearwing.com',
    'info@clearwing.com',
    'Full-service production company serving Milwaukee and Phoenix markets.',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- INSERT VENDOR LOCATIONS WITH COORDINATES
-- ============================================================================

-- PRG Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG New York', true, '630 Ninth Avenue', 'New York', 'NY', 'USA', '10036', '+1 212-757-5300', 40.76019500, -73.99250700),
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Los Angeles', false, '8617 Hayden Place', 'Culver City', 'CA', 'USA', '90232', '+1 310-840-5000', 34.01013000, -118.39668000),
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Las Vegas', false, '3635 West Post Road', 'Las Vegas', 'NV', 'USA', '89118', '+1 702-942-4774', 36.10870000, -115.20130000),
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Nashville', false, '750 Cowan Street', 'Nashville', 'TN', 'USA', '37207', '+1 615-726-5600', 36.18130000, -86.74510000),
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG London', false, 'Units 1-4 Mead Business Centre', 'London', 'England', 'UK', 'N9 0DQ', '+44 20-8807-0909', 51.61380000, -0.05290000),
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Hamburg', false, 'Wendenstrasse 130', 'Hamburg', 'Hamburg', 'Germany', '20537', '+49 40-253-168-0', 53.54800000, 10.03370000),
    ((SELECT id FROM vendors WHERE slug = 'prg'), 'PRG Singapore', false, '33 Ubi Avenue 3', 'Singapore', 'Singapore', 'Singapore', '408868', '+65 6444-7117', 1.33270000, 103.89430000);

-- 4Wall Entertainment Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = '4wall'), '4Wall California HQ', true, '6605 Eleanor Avenue', 'Los Angeles', 'CA', 'USA', '90038', '+1 323-860-0100', 34.07620000, -118.32830000),
    ((SELECT id FROM vendors WHERE slug = '4wall'), '4Wall Las Vegas', false, '4975 W. Sunset Road', 'Las Vegas', 'NV', 'USA', '89118', '+1 702-263-3858', 36.07030000, -115.20650000),
    ((SELECT id FROM vendors WHERE slug = '4wall'), '4Wall New York', false, '333 Johnson Avenue', 'Brooklyn', 'NY', 'USA', '11206', '+1 718-963-0237', 40.71000000, -73.93720000),
    ((SELECT id FROM vendors WHERE slug = '4wall'), '4Wall Nashville', false, '1228 3rd Avenue North', 'Nashville', 'TN', 'USA', '37208', '+1 615-726-6275', 36.17290000, -86.78840000),
    ((SELECT id FROM vendors WHERE slug = '4wall'), '4Wall Orlando', false, '1044 Distribution Drive', 'Orlando', 'FL', 'USA', '32824', '+1 407-857-5050', 28.51460000, -81.28120000);

-- Neg Earth Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'neg-earth'), 'Neg Earth London', true, 'Unit 5 Nimbus Park', 'London', 'England', 'UK', 'SE28 0BG', '+44 20-8316-3030', 51.50130000, 0.09690000),
    ((SELECT id FROM vendors WHERE slug = 'neg-earth'), 'Neg Earth Wakefield', false, 'Unit 3, Rutland Mills', 'Wakefield', 'England', 'UK', 'WF1 2TE', '+44 19-2437-4600', 53.68150000, -1.48960000);

-- Solotech Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'solotech'), 'Solotech Montreal', true, '3000 Rue Griffith', 'Montreal', 'QC', 'Canada', 'H4T 1W5', '+1 514-526-1950', 45.48890000, -73.72210000),
    ((SELECT id FROM vendors WHERE slug = 'solotech'), 'Solotech Los Angeles', false, '2612 E. 46th Street', 'Los Angeles', 'CA', 'USA', '90058', '+1 323-582-7777', 33.99130000, -118.23100000),
    ((SELECT id FROM vendors WHERE slug = 'solotech'), 'Solotech London', false, 'Unit 1, Western International Market', 'London', 'England', 'UK', 'UB2 5SH', '+44 20-8571-7817', 51.52230000, -0.38960000);

-- VER Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'ver'), 'VER Los Angeles', true, '1335 North Seward Street', 'Los Angeles', 'CA', 'USA', '90028', '+1 323-468-3400', 34.09510000, -118.32610000),
    ((SELECT id FROM vendors WHERE slug = 'ver'), 'VER New York', false, '221 W 26th Street', 'New York', 'NY', 'USA', '10001', '+1 212-206-1475', 40.74640000, -73.99600000);

-- MBS Equipment Co. Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'mbs-equipment'), 'MBS Los Angeles', true, 'Culver City', 'Los Angeles', 'CA', 'USA', NULL, '+1 310-727-2700', 34.02110000, -118.39680000),
    ((SELECT id FROM vendors WHERE slug = 'mbs-equipment'), 'MBS London', false, 'Pinewood Studios', 'London', 'England', 'UK', NULL, '+1 310-727-2700', 51.54890000, -0.53720000);

-- Panavision Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'panavision'), 'Panavision Woodland Hills', true, '6735 Selma Avenue', 'Woodland Hills', 'CA', 'USA', '91367', '+1 818-316-1000', 34.17010000, -118.60540000),
    ((SELECT id FROM vendors WHERE slug = 'panavision'), 'Panalux London', false, 'Metropolitan Centre', 'London', 'England', 'UK', 'TW8 0EE', '+44 20-8758-8638', 51.49020000, -0.30660000);

-- ARRI Rental Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'arri-rental'), 'ARRI Munich', true, 'Türkenstraße 89', 'Munich', 'Bavaria', 'Germany', '80799', '+49 89 3809 1040', 48.15290000, 11.57610000),
    ((SELECT id FROM vendors WHERE slug = 'arri-rental'), 'ARRI Berlin', false, 'Türkenstraße 89', 'Berlin', 'Berlin', 'Germany', '10115', '+49 30 678 233 0', 52.52690000, 13.38850000),
    ((SELECT id FROM vendors WHERE slug = 'arri-rental'), 'ARRI Los Angeles', false, '600 N Victory Blvd', 'Burbank', 'CA', 'USA', '91502', '+1 818-841-7070', 34.18280000, -118.33890000);

-- Cinelease Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'cinelease'), 'Cinelease Los Angeles', true, '11101 West Pico Blvd', 'Los Angeles', 'CA', 'USA', '90064', '+1 818-956-4343', 34.03920000, -118.43630000);

-- Wooden Nickel Lighting Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'wooden-nickel'), 'Wooden Nickel North Hollywood', true, '11021 Cantara Street', 'North Hollywood', 'CA', 'USA', '91605', '+1 818-760-9611', 34.23380000, -118.37660000);

-- Volt Lites Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'volt-lites'), 'Volt Lites Burbank', true, '1728 W Magnolia Blvd', 'Burbank', 'CA', 'USA', '91506', '+1 818-433-7972', 34.16980000, -118.33130000);

-- Barbizon Lighting Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'barbizon'), 'Barbizon New York', true, '456 West 55th Street', 'New York', 'NY', 'USA', '10019', '+1 212-586-1620', 40.76930000, -73.99040000);

-- Eastern Effects Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'eastern-effects'), 'Eastern Effects Brooklyn', true, '650 3rd Street', 'Brooklyn', 'NY', 'USA', '11215', '+1 718-855-1197', 40.66410000, -73.98700000);

-- PC&E Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'pce-atlanta'), 'PC&E Atlanta', true, '1650 Enterprise Way', 'Atlanta', 'GA', 'USA', '30318', '+1 404-609-9001', 33.80950000, -84.43320000);

-- Serious Grippage & Light Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'serious-grippage'), 'Serious Grippage Albuquerque', true, '5650 2nd Street NW', 'Albuquerque', 'NM', 'USA', '87107', '+1 505-888-6300', 35.16000000, -106.66480000);

-- William F. White International Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'whites'), 'Whites Toronto', true, '46 Thorncliffe Park Drive', 'Toronto', 'ON', 'Canada', 'M4H 1J8', '+1 416-239-5050', 43.70970000, -79.34830000);

-- Pixipixel Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'pixipixel'), 'Pixipixel London', true, 'Unit 4, Bream Buildings', 'London', 'England', 'UK', 'EC4A 1DT', '+44 20 7739 3626', 51.51640000, -0.10500000);

-- TSF Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'tsf'), 'TSF Paris', true, '128 Rue de Turenne', 'Paris', 'Île-de-France', 'France', '75003', '+33 1 49 17 60 00', 48.86330000, 2.36480000);

-- Maier Bros. Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'maier-bros'), 'Maier Bros. Cologne', true, 'Hamburger Allee 45', 'Cologne', 'North Rhine-Westphalia', 'Germany', '50668', '+49 221 474780', 50.94680000, 6.94820000),
    ((SELECT id FROM vendors WHERE slug = 'maier-bros'), 'Maier Bros. Berlin', false, 'Herzbergstraße 87-99', 'Berlin', 'Berlin', 'Germany', '10365', '+49 221 474780', 52.51860000, 13.49960000);

-- Vantage Film Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'vantage-film'), 'Vantage Film Prague', true, 'Cimburkova 44', 'Prague', 'Prague', 'Czech Republic', '130 00', '+420 222 924 924', 50.08370000, 14.44980000);

-- Sanwa Cine Equipment Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'sanwa-cine'), 'Sanwa Tokyo', true, '2-12-3 Shibuya', 'Tokyo', 'Tokyo', 'Japan', '150-0002', '+81 3-5210-3322', 35.65860000, 139.70170000);

-- Gear Head Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'gear-head'), 'Gear Head Bangkok', true, '88 Soi Sukhumvit 50', 'Bangkok', 'Bangkok', 'Thailand', '10110', '+66 2 039 3999', 13.71800000, 100.59580000);

-- EFD International Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'efd-international'), 'EFD Mexico City', true, 'Estudios Churubusco', 'Mexico City', 'CDMX', 'Mexico', '04220', '+52 55 5659 8304', 19.35930000, -99.13660000);

-- MCC (Movie Camera Co) Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'mcc-south-africa'), 'MCC Cape Town', true, '14 Edison Way', 'Cape Town', 'Western Cape', 'South Africa', '7560', '+27 21 934 0373', -33.98150000, 18.63120000);

-- Bandit Lites Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'bandit-lites'), 'Bandit Lites Knoxville', true, '118 W Depot Avenue', 'Knoxville', 'TN', 'USA', '37917', '+1 865-971-3071', 35.97820000, -83.95690000),
    ((SELECT id FROM vendors WHERE slug = 'bandit-lites'), 'Bandit Lites Nashville', false, '1316 4th Avenue South', 'Nashville', 'TN', 'USA', '37210', '+1 615-259-9960', 36.14490000, -86.77160000);

-- Upstaging Inc. Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'upstaging'), 'Upstaging Chicago', true, '10 S 980 Kingery Highway', 'Willowbrook', 'IL', 'USA', '60527', '+1 815-899-9888', 41.76550000, -87.93240000),
    ((SELECT id FROM vendors WHERE slug = 'upstaging'), 'Upstaging Los Angeles', false, '11511 Hart Street', 'North Hollywood', 'CA', 'USA', '91605', '+1 818-982-4871', 34.21910000, -118.38020000);

-- Christie Lites Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'christie-lites'), 'Christie Lites Orlando', true, '1400 Distribution Drive', 'Orlando', 'FL', 'USA', '32824', '+1 407-856-0016', 28.52100000, -81.28350000),
    ((SELECT id FROM vendors WHERE slug = 'christie-lites'), 'Christie Lites Toronto', false, '46 Thorncliffe Park Drive', 'Toronto', 'ON', 'Canada', 'M4H 1J8', '+1 416-696-5893', 43.70970000, -79.34830000),
    ((SELECT id FROM vendors WHERE slug = 'christie-lites'), 'Christie Lites UK', false, 'Pinewood Studios', 'Iver Heath', 'England', 'UK', 'SL0 0NH', '+44 1753 656 166', 51.54890000, -0.53720000);

-- LMG Touring Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'lmg-touring'), 'LMG Orlando', true, '4940 Hoffner Avenue', 'Orlando', 'FL', 'USA', '32812', '+1 407-850-0505', 28.51070000, -81.29820000),
    ((SELECT id FROM vendors WHERE slug = 'lmg-touring'), 'LMG Las Vegas', false, '3235 W Post Road', 'Las Vegas', 'NV', 'USA', '89118', '+1 702-260-4000', 36.10650000, -115.19930000);

-- Fuse Technical Group Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'fuse-technical'), 'Fuse Technical Chicago', true, '221 W. Cerritos Avenue', 'Anaheim', 'CA', 'USA', '92805', '+1 248-545-0800', 33.82460000, -117.91660000),
    ((SELECT id FROM vendors WHERE slug = 'fuse-technical'), 'Fuse Technical Las Vegas', false, '3235 W Post Road', 'Las Vegas', 'NV', 'USA', '89118', '+1 702-260-7000', 36.10650000, -115.19930000);

-- Clearwing Productions Locations
INSERT INTO vendor_locations (vendor_id, location_name, is_headquarters, address_line1, city, state_province, country, postal_code, phone, latitude, longitude)
VALUES
    ((SELECT id FROM vendors WHERE slug = 'clearwing'), 'Clearwing Milwaukee', true, '5680 N. 91st Street', 'Milwaukee', 'WI', 'USA', '53225', '+1 414-258-6333', 43.16050000, -87.99690000),
    ((SELECT id FROM vendors WHERE slug = 'clearwing'), 'Clearwing Phoenix', false, '2727 N 16th Street', 'Phoenix', 'AZ', 'USA', '85006', '+1 602-254-5710', 33.47930000, -112.04750000);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'Vendor locations inserted successfully!' as status,
       COUNT(*) as total_locations
FROM vendor_locations;
