-- Insert sample endorsements for vendors
-- This will add some initial votes to demonstrate the endorsement system

-- Get vendor IDs (assuming we have some vendors in the database)
DO $$
DECLARE
    vendor_record RECORD;
    category_record RECORD;
BEGIN
    -- Loop through first 5 vendors and add endorsements
    FOR vendor_record IN (SELECT id FROM vendors LIMIT 5) LOOP
        
        -- Add positive endorsements (strengths)
        -- Inventory Depth
        INSERT INTO vendor_endorsements (vendor_id, category_id, upvotes, downvotes)
        VALUES (
            vendor_record.id,
            (SELECT id FROM endorsement_categories WHERE slug = 'inventory-depth'),
            15, 2
        ) ON CONFLICT (vendor_id, category_id) DO UPDATE 
        SET upvotes = 15, downvotes = 2;
        
        -- Customer Service
        INSERT INTO vendor_endorsements (vendor_id, category_id, upvotes, downvotes)
        VALUES (
            vendor_record.id,
            (SELECT id FROM endorsement_categories WHERE slug = 'customer-service'),
            23, 1
        ) ON CONFLICT (vendor_id, category_id) DO UPDATE 
        SET upvotes = 23, downvotes = 1;
        
        -- Equipment Condition
        INSERT INTO vendor_endorsements (vendor_id, category_id, upvotes, downvotes)
        VALUES (
            vendor_record.id,
            (SELECT id FROM endorsement_categories WHERE slug = 'equipment-condition'),
            18, 3
        ) ON CONFLICT (vendor_id, category_id) DO UPDATE 
        SET upvotes = 18, downvotes = 3;
        
        -- Fast Turnaround
        INSERT INTO vendor_endorsements (vendor_id, category_id, upvotes, downvotes)
        VALUES (
            vendor_record.id,
            (SELECT id FROM endorsement_categories WHERE slug = 'fast-turnaround'),
            12, 4
        ) ON CONFLICT (vendor_id, category_id) DO UPDATE 
        SET upvotes = 12, downvotes = 4;
        
        -- Technical Expertise
        INSERT INTO vendor_endorsements (vendor_id, category_id, upvotes, downvotes)
        VALUES (
            vendor_record.id,
            (SELECT id FROM endorsement_categories WHERE slug = 'technical-expertise'),
            20, 2
        ) ON CONFLICT (vendor_id, category_id) DO UPDATE 
        SET upvotes = 20, downvotes = 2;
        
        -- Add one minor weakness to make it realistic
        -- Slow Response (but still more upvotes, so won't show as red)
        INSERT INTO vendor_endorsements (vendor_id, category_id, upvotes, downvotes)
        VALUES (
            vendor_record.id,
            (SELECT id FROM endorsement_categories WHERE slug = 'slow-response'),
            3, 8
        ) ON CONFLICT (vendor_id, category_id) DO UPDATE 
        SET upvotes = 3, downvotes = 8;
        
    END LOOP;
    
    RAISE NOTICE 'Sample endorsements added successfully!';
END $$;

-- Show summary
SELECT 
    v.name as vendor_name,
    ec.name as category,
    ve.upvotes,
    ve.downvotes,
    ve.net_score,
    ec.is_positive
FROM vendor_endorsements ve
INNER JOIN vendors v ON ve.vendor_id = v.id
INNER JOIN endorsement_categories ec ON ve.category_id = ec.id
ORDER BY v.name, ve.net_score DESC;
