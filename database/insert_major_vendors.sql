-- Insert Major Production Vendors
-- Based on industry data collected December 2025

-- Solotech & Acquisitions
INSERT INTO vendors (name, slug, vendor_type, description, country, city, state_province, active) VALUES
('Solotech', 'solotech', 'Rental House', 'One of the world''s largest production companies providing full production services including audio, lighting, and video. Has acquired SSE Audio, Wigwam, Capital Sound, and Morris Light & Sound.', 'Canada', 'Montreal', 'Quebec', true),
('SSE Audio', 'sse-audio', 'Rental House', 'Leading UK audio rental company. Maintains brand identity under Solotech UK Group.', 'United Kingdom', 'London', 'England', true),
('Wigwam', 'wigwam', 'Rental House', 'Prestigious UK audio rental house. Maintains brand identity under Solotech UK Group.', 'United Kingdom', 'London', 'England', true),
('Capital Sound', 'capital-sound', 'Rental House', 'Premier UK audio rental company. Maintains brand identity under Solotech UK Group.', 'United Kingdom', 'London', 'England', true),
('Morris Light & Sound', 'morris-light-sound', 'Rental House', 'Leading Nashville-based audio and lighting provider. Acquired by Solotech in 2021; continues to operate with strong Nashville presence.', 'United States', 'Nashville', 'TN', true),

-- Clair Global & Acquisitions
('Clair Global', 'clair-global', 'Rental House', 'The largest audio company in the world. Now offers full production services including audio, data, and broadcast. Based in Lititz, PA.', 'United States', 'Lititz', 'PA', true),
('Eighth Day Sound', 'eighth-day-sound', 'Rental House', 'Global audio production company with operations in Cleveland, UK, and Australia. Acquired by Clair; maintains distinct brand and operations.', 'United States', 'Cleveland', 'OH', true),
('Sound Image', 'sound-image', 'Rental House', 'Major California-based audio production company with global reach. Acquired by Clair; maintains distinct brand and management.', 'United States', 'Escondido', 'CA', true),
('Britannia Row Productions', 'britannia-row', 'Rental House', 'Legendary UK audio production firm. Acquired by Clair; maintains distinct brand.', 'United Kingdom', 'London', 'England', true),
('ATK Audiotek', 'atk-audiotek', 'Rental House', 'Specializes in audio for broadcast and televised live events including Super Bowl and Grammy Awards. Acquired by Clair.', 'United States', 'Valencia', 'CA', true),

-- PRG
('PRG (Production Resource Group)', 'prg-production-resource-group', 'Rental House', 'Massive global production company providing lighting, video, audio, and scenic services. Acquired VER (Video Equipment Rentals).', 'United States', 'New Windsor', 'NY', true),

-- Major Independents
('Upstaging', 'upstaging', 'Rental House', 'Unique model combining high-end lighting rental with tour trucking services. Based in Chicago.', 'United States', 'Chicago', 'IL', true),
('LMG Touring', 'lmg-touring', 'Rental House', 'Major player in touring video and full production services. Part of Entertainment Technology Partners (ETP). Locations in Orlando, Vegas, and Nashville.', 'United States', 'Orlando', 'FL', true),
('Rat Sound Systems', 'rat-sound-systems', 'Rental House', 'Famous for technical innovation and serving major rock acts including Red Hot Chili Peppers and Pearl Jam.', 'United States', 'Camarillo', 'CA', true),
('Firehouse Productions', 'firehouse-productions', 'Rental House', 'High-end touring and complex broadcast audio specialist with locations in New York and Las Vegas.', 'United States', 'New York', 'NY', true),
('Thunder Audio', 'thunder-audio', 'Rental House', 'Strong reputation in rock and metal touring. Based in Livonia, Michigan.', 'United States', 'Livonia', 'MI', true),
('Special Event Services (SES)', 'special-event-services', 'Rental House', 'Large inventory audio, lighting, and video rental house. Part of Concert Stuff Group. Services many stadium tours including Luke Combs.', 'United States', 'Greensboro', 'NC', true),
('Brown Note Productions', 'brown-note-productions', 'Rental House', 'Fast-growing full production house popular in EDM and jam band scenes. Based in Colorado.', 'United States', 'Denver', 'CO', true),
('Adlib', 'adlib', 'Rental House', 'Leading independent UK supplier for full production including audio, lighting, and video.', 'United Kingdom', 'Liverpool', 'England', true),
('Major Tom', 'major-tom', 'Rental House', 'Boutique high-end audio specialist serving artists like Ed Sheeran. Based in UK.', 'United Kingdom', 'London', 'England', true),
('Spectrum Sound', 'spectrum-sound', 'Rental House', 'Major Nashville player with deep inventory of audio equipment.', 'United States', 'Nashville', 'TN', true),
('Elite Multimedia', 'elite-multimedia', 'Rental House', 'Touring and live event production support providing audio, lighting, and video services.', 'United States', 'Nashville', 'TN', true),
('Allstar Audio', 'allstar-audio', 'Rental House', 'Long-running Nashville rental house providing audio and lighting services.', 'United States', 'Nashville', 'TN', true),
('LD Systems', 'ld-systems', 'Rental House', 'Huge inventory provider, L-Acoustics partner. Handles major festivals including RodeoHouston. Based in Houston and San Antonio.', 'United States', 'Houston', 'TX', true),
('Creative Technology (CT)', 'creative-technology', 'Rental House', 'Massive global video and broadcast capabilities. Part of NEP Group. Also handles concert touring.', 'United Kingdom', 'London', 'England', true),
('Main Light', 'main-light', 'Rental House', 'Primary source for dry hire lighting rental to other production companies. Locations in Wilmington, DE and Las Vegas.', 'United States', 'Wilmington', 'DE', true)
ON CONFLICT (slug) DO NOTHING;

-- Note: The following vendors are already in the database and will be skipped:
-- - Clearwing Productions
-- - Christie Lites
-- - 4Wall Entertainment
-- - Bandit Lites
-- - Neg Earth Lights (listed as "Neg Earth" in existing data)
