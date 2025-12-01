-- Sample Image Inserts for Testing
-- This file shows how to add images to fixtures

-- Add primary image to an existing fixture
UPDATE fixtures 
SET primary_image_url = '/images/fixtures/robe-pointe.jpg',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'robe-pointe';

-- Insert multiple images for a fixture
-- First, let's assume we have a Robe Pointe fixture
INSERT INTO fixture_images (fixture_id, image_url, alt_text, is_primary, display_order)
SELECT 
    id,
    '/images/fixtures/robe-pointe-front.jpg',
    'Robe Pointe - Front View',
    true,
    1
FROM fixtures WHERE slug = 'robe-pointe';

INSERT INTO fixture_images (fixture_id, image_url, alt_text, is_primary, display_order)
SELECT 
    id,
    '/images/fixtures/robe-pointe-side.jpg',
    'Robe Pointe - Side View',
    false,
    2
FROM fixtures WHERE slug = 'robe-pointe';

INSERT INTO fixture_images (fixture_id, image_url, alt_text, is_primary, display_order)
SELECT 
    id,
    '/images/fixtures/robe-pointe-rear.jpg',
    'Robe Pointe - Rear View',
    false,
    3
FROM fixtures WHERE slug = 'robe-pointe';

-- Add manufacturer logos
UPDATE manufacturers 
SET logo_url = '/images/manufacturers/robe.png'
WHERE slug = 'robe';

UPDATE manufacturers 
SET logo_url = '/images/manufacturers/martin.png'
WHERE slug = 'martin';

UPDATE manufacturers 
SET logo_url = '/images/manufacturers/clay-paky.png'
WHERE slug = 'clay-paky';

UPDATE manufacturers 
SET logo_url = '/images/manufacturers/chauvet.png'
WHERE slug = 'chauvet';

-- Using external URLs (from manufacturer websites)
UPDATE fixtures 
SET primary_image_url = 'https://www.robe.cz/res/img/products-detail/pointe-1-1920x1080.jpg'
WHERE slug = 'robe-pointe';

-- Query to see all fixtures without images
SELECT 
    f.name,
    m.name as manufacturer,
    f.primary_image_url
FROM fixtures f
JOIN manufacturers m ON f.manufacturer_id = m.id
WHERE f.primary_image_url IS NULL OR f.primary_image_url = '';

-- Query to see fixtures with images
SELECT 
    f.name,
    m.name as manufacturer,
    f.primary_image_url,
    COUNT(fi.id) as additional_images
FROM fixtures f
JOIN manufacturers m ON f.manufacturer_id = m.id
LEFT JOIN fixture_images fi ON f.id = fi.fixture_id
WHERE f.primary_image_url IS NOT NULL
GROUP BY f.id, f.name, m.name, f.primary_image_url;
