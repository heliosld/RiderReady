-- Insert fixtures data only
-- Make sure manufacturers and fixture_types exist first

-- Robe MegaPointe
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type, color_wheels_count,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, prism_facets, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support, art_net,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit,
    noise_level_db
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'robe'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'MegaPointe', 'MegaPointe', 'robe-megapointe',
    'Versatile beam/spot hybrid fixture with incredible output and effects package',
    2016,
    26.5, 58.4, 440, 570, 384,
    470, '100-240V', 'PowerCON TRUE1',
    'Discharge', 470, 8000, 70,
    22500, 1.8, 21.0, 'Linear',
    'CMY', 2,
    2, 6, 8,
    TRUE, '6-facet rotating', TRUE, TRUE, TRUE,
    28, 58, TRUE, TRUE,
    540, 270, TRUE,
    45
) ON CONFLICT (slug) DO NOTHING;

-- Robe BMFL Spot
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type, color_wheels_count,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, prism_facets, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'robe'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'BMFL Spot', 'BMFL Spot', 'robe-bmfl-spot',
    'Ultimate professional moving head spot with massive output',
    2013,
    42.0, 92.6, 505, 777, 420,
    1500, '100-240V', 'PowerCON TRUE1',
    'Discharge', 1700, 6000, 90,
    55000, 4.5, 55.0, 'Linear',
    'CMY', 2,
    3, 8, 10,
    TRUE, 'Rotating linear prism', TRUE, TRUE, TRUE,
    44, 72, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Clay Paky Sharpy
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin,
    total_lumens, beam_angle_min, zoom_type,
    color_wheels_count,
    gobo_wheels_count, rotating_gobos_count,
    prism, prism_facets, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'clay-paky'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-beam'),
    'Sharpy', 'Sharpy', 'clay-paky-sharpy',
    'The original parallel beam fixture that revolutionized the industry',
    2010,
    16.0, 35.3, 394, 572, 328,
    270, '100-240V', 'PowerCON',
    'Discharge', 189, 8000,
    5100, 2.0, 'Fixed',
    2,
    2, 6,
    TRUE, '5-facet rotating', TRUE,
    16, 26, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- GLP Impression X4 Bar 20
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support, art_net,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit,
    ip_rating
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'glp'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'Impression X4 Bar 20', 'X4 Bar 20', 'glp-x4-bar-20',
    'Revolutionary LED bar with individual pixel control and amazing output',
    2014,
    18.5, 40.8, 1072, 285, 115,
    450, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 90,
    34000, 7.0, 'Fixed',
    'RGBW',
    42, 164, TRUE, TRUE,
    660, 300, TRUE,
    'IP20'
) ON CONFLICT (slug) DO NOTHING;

-- Martin MAC Viper Profile
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type, color_wheels_count,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'martin'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'MAC Viper Profile', 'Viper Profile', 'martin-mac-viper-profile',
    'High-performance spot fixture with excellent color mixing and output',
    2010,
    37.0, 81.6, 435, 692, 353,
    1000, '100-240V', 'PowerCON',
    'Discharge', 1000, 8000, 75,
    26000, 7.0, 47.0, 'Linear',
    'CMY', 1,
    2, 5, 6,
    TRUE, TRUE, TRUE, TRUE,
    32, 46, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Martin MAC Aura XB
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'martin'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'MAC Aura XB', 'Aura XB', 'martin-mac-aura-xb',
    'Compact LED wash with aura backlight and incredible color mixing',
    2015,
    9.5, 20.9, 330, 398, 236,
    230, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 92,
    7500, 11.0, 58.0, 'Linear',
    'RGBW',
    24, 52, TRUE,
    540, 270
) ON CONFLICT (slug) DO NOTHING;

-- Robe Robin Pointe
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type, color_wheels_count,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, prism_facets, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'robe'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'Robin Pointe', 'Pointe', 'robe-robin-pointe',
    'Multi-functional spot/beam/wash with incredible versatility',
    2013,
    19.5, 43.0, 384, 530, 383,
    300, '100-240V', 'PowerCON',
    'Discharge', 280, 8000,
    13000, 2.5, 20.0, 'Linear',
    'CMY', 2,
    2, 5, 7,
    TRUE, '6-facet rotating', TRUE, TRUE, TRUE,
    26, 54, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Robe Spiider
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'robe'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'Spiider', 'Spiider', 'robe-spiider',
    'LED wash beam with unique central flower effect and individual LED control',
    2016,
    14.0, 30.9, 320, 459, 290,
    450, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 90,
    14000, 4.0, 60.0, 'Linear',
    'RGBW',
    34, 86, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Clay Paky Mythos 2
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type, color_wheels_count,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, prism_facets, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'clay-paky'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'Mythos 2', 'Mythos 2', 'clay-paky-mythos-2',
    'Next generation hybrid fixture with spot, beam, and wash capabilities',
    2016,
    26.0, 57.3, 440, 607, 365,
    500, '100-240V', 'PowerCON TRUE1',
    'Discharge', 470, 8000, 70,
    28000, 2.0, 50.0, 'Linear',
    'CMY', 2,
    2, 6, 10,
    TRUE, 'Linear rotating', TRUE, TRUE, TRUE,
    50, 79, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Clay Paky Axcor Profile 900
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'clay-paky'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'Axcor Profile 900', 'Axcor Profile 900', 'clay-paky-axcor-profile-900',
    'High-powered LED profile spot with exceptional performance',
    2019,
    35.5, 78.3, 456, 693, 391,
    950, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 90,
    38000, 5.0, 55.0, 'Linear',
    'RGB',
    2, 5, 9,
    TRUE, TRUE, TRUE, TRUE,
    48, 72, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Chauvet Maverick MK3 Wash
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'chauvet'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'Maverick MK3 Wash', 'MK3 Wash', 'chauvet-maverick-mk3-wash',
    'Professional LED wash with excellent color mixing and output',
    2020,
    15.4, 34.0, 372, 490, 298,
    580, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 90,
    22000, 11.0, 49.0, 'Linear',
    'RGBW',
    22, 71, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Elation Proteus Hybrid
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, light_source_wattage, color_temperature_kelvin,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type, color_wheels_count,
    gobo_wheels_count, rotating_gobos_count, static_gobos_count,
    prism, prism_facets, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support, art_net,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit,
    ip_rating
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'elation'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'Proteus Hybrid', 'Proteus Hybrid', 'elation-proteus-hybrid',
    'IP65-rated hybrid spot/beam/wash for outdoor touring',
    2018,
    31.0, 68.3, 428, 628, 381,
    720, '100-240V', 'PowerCON TRUE1',
    'Discharge', 550, 7800,
    32000, 2.5, 47.0, 'Linear',
    'CMY', 2,
    2, 7, 10,
    TRUE, '8-facet rotating', TRUE, TRUE, TRUE,
    26, 79, TRUE, TRUE,
    540, 270, TRUE,
    'IP65'
) ON CONFLICT (slug) DO NOTHING;

-- Elation Artiste Monet
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    gobo_wheels_count, rotating_gobos_count,
    prism, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'elation'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'Artiste Monet', 'Artiste Monet', 'elation-artiste-monet',
    'High-powered LED profile with framing shutters and animation wheel',
    2019,
    38.0, 83.8, 450, 735, 405,
    950, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 95,
    48000, 7.0, 49.0, 'Linear',
    'RGBMA (Mint, Amber)',
    1, 4,
    TRUE, TRUE, TRUE, TRUE,
    51, 95, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- GLP Impression X4 XL
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'glp'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'Impression X4 XL', 'X4 XL', 'glp-impression-x4-xl',
    'High-output LED wash with excellent color mixing and zoom range',
    2018,
    18.5, 40.8, 380, 481, 360,
    500, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 90,
    18000, 7.0, 50.0, 'Linear',
    'RGBW',
    20, 62, TRUE,
    540, 270, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Ayrton MagicPanel FX
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'ayrton'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'MagicPanel FX', 'MagicPanel FX', 'ayrton-magicpanel-fx',
    'Revolutionary LED matrix panel with continuous pan/tilt rotation and pixel effects',
    2018,
    23.0, 50.7, 586, 586, 265,
    850, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 92,
    24000, 4.5, 'Fixed',
    'RGBW',
    48, 216, TRUE,
    660, 300, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Ayrton Khamsin-S
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    gobo_wheels_count, rotating_gobos_count,
    prism, frost, iris, shutter_strobe,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit,
    ip_rating
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'ayrton'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-spot'),
    'Khamsin-S', 'Khamsin-S', 'ayrton-khamsin-s',
    'High-powered LED profile spot with full feature set and IP65 rating',
    2020,
    36.0, 79.4, 446, 711, 422,
    850, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 93,
    42000, 5.5, 50.0, 'Linear',
    'RGB',
    2, 6,
    TRUE, TRUE, TRUE, TRUE,
    48, 90, TRUE,
    540, 270, TRUE,
    'IP65'
) ON CONFLICT (slug) DO NOTHING;

-- SGM P-5 Wash
INSERT INTO fixtures (
    manufacturer_id, fixture_type_id, name, model_number, slug,
    description, year_introduced,
    weight_kg, weight_lbs, width_mm, height_mm, depth_mm,
    power_consumption_watts, voltage, power_connector,
    light_source_type, color_temperature_kelvin, cri_rating,
    total_lumens, beam_angle_min, beam_angle_max, zoom_type,
    color_mixing_type,
    dmx_channels_min, dmx_channels_max, rdm_support,
    pan_range_degrees, tilt_range_degrees, pan_tilt_16bit,
    ip_rating
) VALUES (
    (SELECT id FROM manufacturers WHERE slug = 'sgm'),
    (SELECT id FROM fixture_types WHERE slug = 'moving-head-wash'),
    'P-5 Wash', 'P-5 Wash', 'sgm-p5-wash',
    'Compact LED wash with excellent output and IP65 rating for outdoor use',
    2015,
    12.8, 28.2, 353, 439, 281,
    350, '100-240V', 'PowerCON TRUE1',
    'LED', 6500, 85,
    12500, 7.0, 50.0, 'Linear',
    'RGBW',
    16, 41, TRUE,
    540, 270, TRUE,
    'IP65'
) ON CONFLICT (slug) DO NOTHING;

-- Insert vendor inventory
INSERT INTO vendor_inventory (vendor_id, fixture_id, quantity, available_for_rental, notes)
SELECT 
    v.id,
    f.id,
    500,
    TRUE,
    'Large touring inventory available'
FROM vendors v, fixtures f
WHERE v.slug = 'prg' AND f.slug = 'robe-megapointe'
ON CONFLICT (vendor_id, fixture_id) DO NOTHING;

INSERT INTO vendor_inventory (vendor_id, fixture_id, quantity, available_for_rental, notes)
SELECT 
    v.id,
    f.id,
    400,
    TRUE,
    'Large Sharpy inventory'
FROM vendors v, fixtures f
WHERE v.slug = 'ver' AND f.slug = 'clay-paky-sharpy'
ON CONFLICT (vendor_id, fixture_id) DO NOTHING;