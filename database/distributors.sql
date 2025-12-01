-- Distributors/Dealers table
CREATE TABLE IF NOT EXISTS distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  established_year INTEGER,
  distributor_type VARCHAR(100), -- 'manufacturer_direct', 'independent', 'regional', 'national'
  brands_carried TEXT[], -- Array of brand names they distribute
  territories_served TEXT[], -- Geographic territories they cover
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Distributor locations for multi-location distributors
CREATE TABLE IF NOT EXISTS distributor_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
  location_name VARCHAR(255),
  is_headquarters BOOLEAN DEFAULT false,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  email VARCHAR(255),
  services_offered TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_distributors_slug ON distributors(slug);
CREATE INDEX IF NOT EXISTS idx_distributors_country ON distributors(country);
CREATE INDEX IF NOT EXISTS idx_distributors_active ON distributors(active);
CREATE INDEX IF NOT EXISTS idx_distributor_locations_distributor_id ON distributor_locations(distributor_id);

-- Insert sample distributors
INSERT INTO distributors (name, slug, description, website, email, phone, city, state_province, country, latitude, longitude, established_year, distributor_type, brands_carried, territories_served) VALUES
('Barbizon Lighting Company', 'barbizon-lighting', 'Leading entertainment technology distributor serving the Americas with a comprehensive portfolio of lighting, rigging, and control systems.', 'https://www.barbizon.com', 'info@barbizon.com', '+1 (800) 638-5880', 'Dallas', 'TX', 'United States', 32.7767, -96.7970, 1947, 'national', ARRAY['ETC', 'Martin', 'Chauvet', 'Ayrton', 'Robe', 'GLP'], ARRAY['United States', 'Canada', 'Latin America']),
('Production Resource Group (PRG)', 'prg-distribution', 'Global distributor and manufacturer of entertainment production technology with exclusive distribution rights for major brands.', 'https://www.prg.com', 'sales@prg.com', '+1 (818) 843-2900', 'New Windsor', 'NY', 'United States', 41.4759, -74.0221, 1975, 'manufacturer_direct', ARRAY['PRG', 'Bad Boy', 'Best Boy'], ARRAY['Global']),
('LightMoves', 'lightmoves', 'Premier Australian distributor specializing in entertainment lighting, audio, and video solutions.', 'https://www.lightmoves.com.au', 'sales@lightmoves.com.au', '+61 3 9555 3000', 'Melbourne', 'VIC', 'Australia', -37.8136, 144.9631, 1992, 'national', ARRAY['Robe', 'Claypaky', 'MA Lighting', 'Robert Juliat', 'SGM'], ARRAY['Australia', 'New Zealand']),
('Ambersphere Solutions', 'ambersphere', 'Exclusive North American distributor for Ayrton and other premium European lighting brands.', 'https://www.ambersphere.com', 'info@ambersphere.com', '+1 (818) 769-5000', 'Burbank', 'CA', 'United States', 34.1808, -118.3090, 2001, 'manufacturer_direct', ARRAY['Ayrton', 'SGM', 'Elation'], ARRAY['North America']),
('AC Entertainment Technologies (AC-ET)', 'ac-et', 'UK-based distributor representing leading manufacturers in lighting, sound, and staging technology.', 'https://www.ac-et.com', 'info@ac-et.com', '+44 1494 446000', 'High Wycombe', NULL, 'United Kingdom', 51.6287, -0.7482, 2000, 'national', ARRAY['Martin', 'Robe', 'Chauvet Professional', 'Prolights'], ARRAY['United Kingdom', 'Ireland']),
('A.C. Lighting Inc.', 'ac-lighting', 'Canadian distributor offering comprehensive lighting, audio, and video solutions from world-class manufacturers.', 'https://www.aclightingcorp.com', 'info@aclighting.com', '+1 (416) 255-9494', 'Toronto', 'ON', 'Canada', 43.6532, -79.3832, 1979, 'national', ARRAY['Chauvet', 'Elation', 'ADJ', 'TMB'], ARRAY['Canada']),
('Ushio America', 'ushio-america', 'Leading distributor of professional lamps and light sources for entertainment and architectural lighting.', 'https://www.ushio.com', 'entertainment@ushio.com', '+1 (800) 838-7446', 'Cypress', 'CA', 'United States', 33.8169, -118.0372, 1967, 'manufacturer_direct', ARRAY['Ushio'], ARRAY['Americas']),
('Tomcat USA', 'tomcat-usa', 'North American distributor specializing in truss, staging, and rigging solutions for the entertainment industry.', 'https://www.tomcatglobal.com', 'sales@tomcatusa.com', '+1 (615) 641-7774', 'Midland', 'TX', 'United States', 32.0252, -102.0779, 2003, 'manufacturer_direct', ARRAY['Tomcat', 'Milos'], ARRAY['North America']),
('ACT Lighting', 'act-lighting', 'Leading North American distributor representing premium entertainment technology brands across lighting, rigging, and control.', 'https://www.actlighting.com', 'info@actlighting.com', '+1 (888) 258-5483', 'Littleton', 'MA', 'United States', 42.5334, -71.4882, 2012, 'national', ARRAY['MA Lighting', 'ETC', 'Robert Juliat', 'Acclaim'], ARRAY['United States', 'Canada']),
('Inner Circle Distribution', 'inner-circle', 'Boutique distributor specializing in high-end European lighting fixtures and innovative entertainment technology.', 'https://www.innercircledist.com', 'info@innercircledist.com', '+1 (818) 990-7550', 'Los Angeles', 'CA', 'United States', 34.0522, -118.2437, 2008, 'independent', ARRAY['Claypaky', 'DTS', 'Spotlight', 'PR Lighting'], ARRAY['United States'])
ON CONFLICT (slug) DO NOTHING;
