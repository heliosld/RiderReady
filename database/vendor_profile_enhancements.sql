-- Add profile enhancement fields to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS services TEXT[], -- Array of services offered
ADD COLUMN IF NOT EXISTS certifications JSONB, -- Array of certification objects
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS years_in_business INTEGER,
ADD COLUMN IF NOT EXISTS team_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS response_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS service_area TEXT,
ADD COLUMN IF NOT EXISTS hours_of_operation JSONB,
ADD COLUMN IF NOT EXISTS social_media JSONB,
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Example data structure for certifications:
-- [
--   {
--     "name": "ETCP Certification",
--     "issuer": "ESTA",
--     "year": 2020,
--     "description": "Entertainment Technician Certification Program"
--   }
-- ]

-- Example data structure for hours_of_operation:
-- {
--   "monday": "8:00 AM - 6:00 PM",
--   "tuesday": "8:00 AM - 6:00 PM",
--   "wednesday": "8:00 AM - 6:00 PM",
--   "thursday": "8:00 AM - 6:00 PM",
--   "friday": "8:00 AM - 6:00 PM",
--   "saturday": "9:00 AM - 3:00 PM",
--   "sunday": "Closed",
--   "notes": "24/7 emergency service available"
-- }

-- Example data structure for social_media:
-- {
--   "website": "https://prg.com",
--   "facebook": "https://facebook.com/prg",
--   "instagram": "@prglighting",
--   "linkedin": "https://linkedin.com/company/prg",
--   "twitter": "@prglighting"
-- }

COMMENT ON COLUMN vendors.about IS 'Detailed company description';
COMMENT ON COLUMN vendors.services IS 'Array of services: rental, sales, installation, design, support, etc.';
COMMENT ON COLUMN vendors.certifications IS 'Array of certification objects with name, issuer, year, description';
COMMENT ON COLUMN vendors.specialties IS 'Array of specialties: concerts, theater, corporate, broadcast, etc.';
COMMENT ON COLUMN vendors.years_in_business IS 'Number of years the company has been in business';
COMMENT ON COLUMN vendors.team_size IS 'Size of team: 1-10, 11-50, 51-200, 201-500, 500+';
COMMENT ON COLUMN vendors.response_time IS 'Typical response time: Within 1 hour, Same day, Within 24 hours, etc.';
COMMENT ON COLUMN vendors.service_area IS 'Geographic service area description';
COMMENT ON COLUMN vendors.hours_of_operation IS 'Operating hours by day with optional notes';
COMMENT ON COLUMN vendors.social_media IS 'Social media links and website';
COMMENT ON COLUMN vendors.profile_completion_percentage IS 'Calculated percentage of profile fields completed';
