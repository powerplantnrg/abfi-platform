-- ============================================
-- ABFI Platform Comprehensive Seed Data
-- Realistic Australian Bioenergy Feedstock Data
-- ============================================

-- Note: Run this after migrations are applied
-- This script uses UUIDs that Supabase will generate

-- ============================================
-- 1. SUPPLIER PROFILES (via auth.users integration)
-- ============================================

-- First, we'll insert profiles that would normally be created by Supabase Auth
-- In production, users sign up and profiles are auto-created

-- Insert test profiles (suppliers)
INSERT INTO profiles (id, email, full_name, role, phone, avatar_url, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'operations@mackaysugar.com.au', 'James Mitchell', 'supplier', '+61 7 4963 2001', NULL, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'contact@wilmarsugar.com.au', 'Sarah Chen', 'supplier', '+61 7 4776 8101', NULL, NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'biomass@graincorp.com.au', 'Michael Thompson', 'supplier', '+61 2 9325 9101', NULL, NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'sales@aptimber.com.au', 'Emma Wilson', 'supplier', '+61 3 5174 9301', NULL, NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'operations@nswforestry.com.au', 'David Brown', 'supplier', '+61 2 6581 1001', NULL, NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'supply@sagrowers.com.au', 'Lisa Anderson', 'supplier', '+61 8 8531 2001', NULL, NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'feedstock@qldcanegrowers.com.au', 'Robert Taylor', 'supplier', '+61 7 3864 6001', NULL, NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'biowaste@cleanwaste.com.au', 'Jennifer Lee', 'supplier', '+61 3 9555 7001', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test profiles (buyers)
INSERT INTO profiles (id, email, full_name, role, phone, avatar_url, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'procurement@vivaenergy.com.au', 'Andrew Smith', 'buyer', '+61 3 9668 3001', NULL, NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'biofuels@ampol.com.au', 'Rachel Green', 'buyer', '+61 2 9250 5001', NULL, NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'renewables@originenergy.com.au', 'Mark Johnson', 'buyer', '+61 2 8345 5001', NULL, NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'saf@qantas.com.au', 'Kate Williams', 'buyer', '+61 2 9691 3001', NULL, NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'procurement@cleanergy.com.au', 'Peter Davis', 'buyer', '+61 7 3221 1001', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. SUPPLIERS
-- ============================================

INSERT INTO suppliers (id, profile_id, abn, company_name, trading_name, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state, postcode, country, website, description, logo_url, verification_status, subscription_tier, notify_new_inquiry, notify_inquiry_response, created_at, updated_at)
VALUES
  -- Mackay Sugar Limited
  ('s1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   '12345678901', 'Mackay Sugar Limited', 'Mackay Sugar',
   'James Mitchell', 'operations@mackaysugar.com.au', '+61 7 4963 2001',
   'Racecourse Mill, Racecourse Road', NULL, 'Mackay', 'QLD', '4740', 'Australia',
   'https://www.mackaysugar.com.au',
   'Leading sugar producer in Queensland with extensive cane crushing operations across Mackay region. Our mills produce over 750,000 tonnes of raw sugar annually and generate substantial bagasse for bioenergy applications. ISCC certified with strong sustainability credentials.',
   NULL, 'verified', 'professional', true, true, NOW(), NOW()),

  -- Wilmar Sugar Australia
  ('s2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
   '23456789012', 'Wilmar Sugar Australia', 'Wilmar Sugar',
   'Sarah Chen', 'contact@wilmarsugar.com.au', '+61 7 4776 8101',
   'Victoria Mill Road', 'Herbert River District', 'Ingham', 'QLD', '4850', 'Australia',
   'https://www.wilmarsugar-anz.com',
   'Australia''s largest sugar milling company operating 8 mills across Queensland. Major producer of bagasse-based renewable energy with 120MW co-generation capacity. Bonsucro and ISCC certified supply chain.',
   NULL, 'verified', 'enterprise', true, true, NOW(), NOW()),

  -- GrainCorp Operations
  ('s3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
   '34567890123', 'GrainCorp Operations Limited', 'GrainCorp',
   'Michael Thompson', 'biomass@graincorp.com.au', '+61 2 9325 9101',
   'Level 28, 175 Liverpool Street', NULL, 'Sydney', 'NSW', '2000', 'Australia',
   'https://www.graincorp.com.au',
   'Australia''s largest grain handler with access to substantial agricultural residues. Our network spans 280+ receival sites across NSW, Victoria and Queensland, providing reliable cereal straw and stubble feedstocks.',
   NULL, 'verified', 'professional', true, true, NOW(), NOW()),

  -- Australian Plantation Timber
  ('s4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444',
   '45678901234', 'Australian Plantation Timber Pty Ltd', 'APT',
   'Emma Wilson', 'sales@aptimber.com.au', '+61 3 5174 9301',
   '45 Plantation Road', 'Gippsland Region', 'Sale', 'VIC', '3850', 'Australia',
   'https://www.aptimber.com.au',
   'Sustainable plantation forestry operation in Gippsland, Victoria. FSC and PEFC certified. Specializing in premium wood chips and sawmill residues for domestic and export bioenergy markets.',
   NULL, 'verified', 'starter', true, true, NOW(), NOW()),

  -- NSW Forestry Corporation
  ('s5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555',
   '56789012345', 'Forestry Corporation of NSW', 'FCNSW',
   'David Brown', 'operations@nswforestry.com.au', '+61 2 6581 1001',
   '121 King Street', NULL, 'Port Macquarie', 'NSW', '2444', 'Australia',
   'https://www.forestrycorporation.com.au',
   'State-owned forestry enterprise managing over 2 million hectares. Sustainable supply of plantation thinnings, harvesting residues and mill by-products. ISO 14001 environmental certification.',
   NULL, 'verified', 'professional', true, true, NOW(), NOW()),

  -- SA Growers Cooperative
  ('s6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666',
   '67890123456', 'South Australian Growers Cooperative', 'SA Growers',
   'Lisa Anderson', 'supply@sagrowers.com.au', '+61 8 8531 2001',
   '22 Murray Street', NULL, 'Murray Bridge', 'SA', '5253', 'Australia',
   'https://www.sagrowers.com.au',
   'Farmer cooperative representing 450+ grain producers across SA. Aggregating wheat straw, barley straw and canola stubble for bioenergy. Member of Australian Farm Institute sustainability program.',
   NULL, 'verified', 'starter', true, true, NOW(), NOW()),

  -- QLD Cane Growers
  ('s7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777',
   '78901234567', 'Queensland Cane Growers Organisation', 'CANEGROWERS',
   'Robert Taylor', 'feedstock@qldcanegrowers.com.au', '+61 7 3864 6001',
   'Level 6, 100 Edward Street', NULL, 'Brisbane', 'QLD', '4000', 'Australia',
   'https://www.canegrowers.com.au',
   'Peak body representing 3,000+ cane farming businesses. Coordinating bagasse and cane trash supply for renewable energy projects. Strong focus on sustainable agriculture practices.',
   NULL, 'verified', 'professional', true, true, NOW(), NOW()),

  -- Clean Waste Solutions
  ('s8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888',
   '89012345678', 'Clean Waste Solutions Pty Ltd', 'CleanWaste',
   'Jennifer Lee', 'biowaste@cleanwaste.com.au', '+61 3 9555 7001',
   '150 Industrial Avenue', 'Dandenong South', 'Melbourne', 'VIC', '3175', 'Australia',
   'https://www.cleanwaste.com.au',
   'Leading organic waste processor in Victoria. Operating anaerobic digestion and composting facilities. Processing food waste, green waste and agricultural organics into biogas and soil amendments.',
   NULL, 'verified', 'starter', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. BUYERS
-- ============================================

INSERT INTO buyers (id, profile_id, abn, company_name, trading_name, company_type, contact_name, contact_email, contact_phone, address_line1, address_line2, city, state, postcode, country, facility_latitude, facility_longitude, website, description, logo_url, verification_status, subscription_tier, preferred_categories, preferred_states, annual_volume_requirement, min_abfi_score, max_carbon_intensity, notify_new_feedstock, notify_price_change, created_at, updated_at)
VALUES
  -- Viva Energy
  ('b1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '98765432101', 'Viva Energy Australia Pty Ltd', 'Viva Energy', 'refinery',
   'Andrew Smith', 'procurement@vivaenergy.com.au', '+61 3 9668 3001',
   'Refinery Road', 'Geelong Refinery', 'Geelong', 'VIC', '3220', 'Australia',
   -38.1485, 144.3907,
   'https://www.vivaenergy.com.au',
   'Operating Australia''s largest oil refinery at Geelong. Investing in renewable diesel production capacity targeting 50% SAF blend by 2030. Seeking ISCC certified feedstocks.',
   NULL, 'verified', 'enterprise', '{"UCO", "tallow", "oilseed"}', '{"VIC", "SA", "NSW"}', 150000, 75, 30.0, true, true, NOW(), NOW()),

  -- Ampol
  ('b2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '87654321012', 'Ampol Limited', 'Ampol', 'refinery',
   'Rachel Green', 'biofuels@ampol.com.au', '+61 2 9250 5001',
   'Ampol Place, 29-33 Bourke Road', NULL, 'Alexandria', 'NSW', '2015', 'Australia',
   -33.9083, 151.1943,
   'https://www.ampol.com.au',
   'Australia''s leading transport fuel supplier. Lytton Refinery in Brisbane developing advanced biofuels capability. Target: 10% sustainable aviation fuel production by 2028.',
   NULL, 'verified', 'enterprise', '{"UCO", "tallow", "lignocellulosic"}', '{"QLD", "NSW"}', 200000, 70, 35.0, true, true, NOW(), NOW()),

  -- Origin Energy
  ('b3333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
   '76543210123', 'Origin Energy Limited', 'Origin', 'biofuel_producer',
   'Mark Johnson', 'renewables@originenergy.com.au', '+61 2 8345 5001',
   'Level 32, Tower 1', '100 Barangaroo Avenue', 'Sydney', 'NSW', '2000', 'Australia',
   -33.8621, 151.2025,
   'https://www.originenergy.com.au',
   'Integrated energy company with renewable energy portfolio. Developing biomass co-firing at Eraring Power Station and exploring biogas-to-electricity projects across NSW.',
   NULL, 'verified', 'professional', '{"lignocellulosic", "waste"}', '{"NSW", "QLD", "VIC"}', 300000, 65, 40.0, true, true, NOW(), NOW()),

  -- Qantas
  ('b4444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
   '65432101234', 'Qantas Airways Limited', 'Qantas', 'saf_producer',
   'Kate Williams', 'saf@qantas.com.au', '+61 2 9691 3001',
   '10 Bourke Road', 'Mascot', 'Sydney', 'NSW', '2020', 'Australia',
   -33.9399, 151.1753,
   'https://www.qantas.com',
   'Australia''s flagship carrier committed to net zero by 2050. Partnering on domestic SAF production. Seeking CORSIA-eligible feedstocks with verified low carbon intensity.',
   NULL, 'verified', 'enterprise', '{"UCO", "oilseed", "tallow"}', '{"NSW", "QLD", "VIC", "WA"}', 100000, 80, 25.0, true, true, NOW(), NOW()),

  -- Cleanergy
  ('b5555555-5555-5555-5555-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
   '54321012345', 'Cleanergy Pty Ltd', 'Cleanergy', 'biofuel_producer',
   'Peter Davis', 'procurement@cleanergy.com.au', '+61 7 3221 1001',
   'Level 12, 240 Queen Street', NULL, 'Brisbane', 'QLD', '4000', 'Australia',
   -27.4705, 153.0260,
   'https://www.cleanergy.com.au',
   'Independent renewable fuels company developing Australia''s first commercial-scale renewable diesel refinery in Queensland. Planning 200ML annual capacity using domestic feedstocks.',
   NULL, 'verified', 'professional', '{"tallow", "UCO", "oilseed"}', '{"QLD", "NSW"}', 180000, 75, 28.0, true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. FEEDSTOCKS
-- ============================================

INSERT INTO feedstocks (id, feedstock_id, supplier_id, category, type, name, description, latitude, longitude, state, region, abfi_score, sustainability_score, carbon_intensity_score, quality_score, reliability_score, carbon_intensity_value, ci_rating, annual_capacity_tonnes, available_volume_current, min_order_quantity, price_indicative, price_currency, price_basis, moisture_content, energy_content_mj_kg, ash_content, status, verification_status, created_at, updated_at)
VALUES
  -- Mackay Sugar - Bagasse
  ('f1111111-1111-1111-1111-111111111111', 'ABFI-BAG-QLD-000001', 's1111111-1111-1111-1111-111111111111',
   'lignocellulosic', 'Sugarcane Bagasse', 'Premium Mackay Bagasse',
   'High-quality bagasse from Mackay Sugar mills. Consistent moisture content, low contamination. Suitable for co-generation, cellulosic ethanol, and pyrolysis applications. ISCC certified.',
   -21.1417, 149.1858, 'QLD', 'Mackay-Whitsunday',
   89, 90, 85, 92, 88, 12.5, 'A', 280000, 180000, 1000, 45.00, 'AUD', 'ex-mill',
   48.5, 8.2, 2.8, 'active', 'verified', NOW(), NOW()),

  -- Wilmar Sugar - Bagasse
  ('f2222222-2222-2222-2222-222222222222', 'ABFI-BAG-QLD-000002', 's2222222-2222-2222-2222-222222222222',
   'lignocellulosic', 'Sugarcane Bagasse', 'Wilmar Bulk Bagasse',
   'Industrial-grade bagasse from Victoria and Herbert mills. Large volumes available during crushing season (June-December). Bonsucro certified sustainable sugarcane.',
   -18.6500, 146.1833, 'QLD', 'Herbert-Burdekin',
   86, 88, 82, 88, 90, 14.2, 'A', 350000, 220000, 5000, 42.00, 'AUD', 'ex-mill',
   50.0, 7.9, 3.2, 'active', 'verified', NOW(), NOW()),

  -- GrainCorp - Wheat Straw
  ('f3333333-3333-3333-3333-333333333333', 'ABFI-STR-NSW-000001', 's3333333-3333-3333-3333-333333333333',
   'lignocellulosic', 'Wheat Straw', 'NSW Grain Belt Wheat Straw',
   'Premium wheat straw bales from NSW grain belt. Harvested and baled with GPS tracking for full traceability. Low moisture, consistent quality. RSB certified.',
   -34.2833, 146.0500, 'NSW', 'Riverina',
   83, 82, 78, 88, 85, 18.5, 'B+', 75000, 50000, 500, 85.00, 'AUD', 'delivered',
   12.0, 15.2, 5.8, 'active', 'verified', NOW(), NOW()),

  -- GrainCorp - Canola Stubble
  ('f4444444-4444-4444-4444-444444444444', 'ABFI-STB-VIC-000001', 's3333333-3333-3333-3333-333333333333',
   'lignocellulosic', 'Canola Stubble', 'Victorian Canola Residue',
   'Canola stubble from Victorian Wimmera farms. Lower ash content than cereal straws. Suitable for advanced conversion processes. Available March-August post-harvest.',
   -36.7178, 142.1992, 'VIC', 'Wimmera',
   81, 80, 80, 84, 82, 16.8, 'B+', 40000, 28000, 250, 75.00, 'AUD', 'farm-gate',
   10.5, 16.8, 4.2, 'active', 'verified', NOW(), NOW()),

  -- APT - Wood Chips
  ('f5555555-5555-5555-5555-555555555555', 'ABFI-WCH-VIC-000001', 's4444444-4444-4444-4444-444444444444',
   'lignocellulosic', 'Wood Chips', 'Gippsland Plantation Pine Chips',
   'Clean wood chips from FSC/PEFC certified plantation pine. Uniform chip size (30-50mm), low moisture. Ideal for biomass boilers and pellet production. Year-round availability.',
   -38.1000, 147.0667, 'VIC', 'Gippsland',
   91, 92, 88, 94, 95, 10.2, 'A+', 90000, 72000, 100, 95.00, 'AUD', 'ex-yard',
   25.0, 18.5, 1.2, 'active', 'verified', NOW(), NOW()),

  -- APT - Sawdust
  ('f6666666-6666-6666-6666-666666666666', 'ABFI-SAW-VIC-000001', 's4444444-4444-4444-4444-444444444444',
   'lignocellulosic', 'Sawdust', 'Softwood Sawmill Sawdust',
   'Fine sawdust from plantation softwood milling. Suitable for pellet production, animal bedding or direct combustion. Consistent supply from operational sawmill.',
   -38.1000, 147.0667, 'VIC', 'Gippsland',
   87, 88, 86, 90, 88, 11.5, 'A', 25000, 18000, 50, 55.00, 'AUD', 'ex-mill',
   18.0, 17.2, 0.8, 'active', 'verified', NOW(), NOW()),

  -- FCNSW - Forest Residues
  ('f7777777-7777-7777-7777-777777777777', 'ABFI-FRS-NSW-000001', 's5555555-5555-5555-5555-555555555555',
   'lignocellulosic', 'Forest Residues', 'NSW Plantation Harvest Residues',
   'Mixed forestry residues from sustainable plantation operations. Includes logging slash, thinnings and processing residues. ISO 14001 certified operations.',
   -31.4333, 152.9000, 'NSW', 'Mid North Coast',
   79, 82, 75, 80, 78, 22.0, 'B', 60000, 42000, 500, 65.00, 'AUD', 'roadside',
   35.0, 14.5, 3.5, 'active', 'verified', NOW(), NOW()),

  -- SA Growers - Barley Straw
  ('f8888888-8888-8888-8888-888888888888', 'ABFI-STR-SA-000001', 's6666666-6666-6666-6666-666666666666',
   'lignocellulosic', 'Barley Straw', 'Mallee Barley Straw Bales',
   'Quality barley straw from SA Mallee region. Baled at optimal moisture for long-term storage. Aggregated supply from cooperative members ensures reliability.',
   -34.8500, 139.8333, 'SA', 'Murray-Mallee',
   80, 78, 77, 84, 82, 19.2, 'B', 35000, 25000, 200, 80.00, 'AUD', 'delivered',
   11.0, 15.8, 6.2, 'active', 'verified', NOW(), NOW()),

  -- QLD Cane Growers - Cane Trash
  ('f9999999-9999-9999-9999-999999999999', 'ABFI-CTR-QLD-000001', 's7777777-7777-7777-7777-777777777777',
   'lignocellulosic', 'Cane Trash', 'Queensland Cane Tops & Trash',
   'Sugarcane harvest residues including tops and trash. Previously burnt, now collected for bioenergy. Significant soil carbon benefits from residue removal management.',
   -19.4914, 147.1200, 'QLD', 'Burdekin',
   77, 85, 72, 75, 76, 24.5, 'B', 45000, 32000, 500, 35.00, 'AUD', 'farm-gate',
   55.0, 7.5, 8.5, 'active', 'verified', NOW(), NOW()),

  -- CleanWaste - Food Waste
  ('fa000000-0000-0000-0000-000000000001', 'ABFI-FDW-VIC-000001', 's8888888-8888-8888-8888-888888888888',
   'waste', 'Food Waste', 'Melbourne Metro FOGO',
   'Source-separated food and garden organics from Melbourne metropolitan councils. Processed through modern AD facility. Consistent feedstock quality from established collection contracts.',
   -38.0489, 145.1831, 'VIC', 'Greater Melbourne',
   82, 90, 88, 75, 80, 8.5, 'A', 55000, 48000, 100, 25.00, 'AUD', 'gate-fee',
   70.0, 4.5, 12.0, 'active', 'verified', NOW(), NOW()),

  -- Additional UCO listing
  ('fa000000-0000-0000-0000-000000000002', 'ABFI-UCO-VIC-000001', 's8888888-8888-8888-8888-888888888888',
   'UCO', 'Used Cooking Oil', 'Metro Melbourne UCO Collection',
   'Restaurant and food service used cooking oil. Collected from 500+ venues across Melbourne. Tested for FFA and moisture content. ISCC mass balance certified.',
   -37.8136, 144.9631, 'VIC', 'Greater Melbourne',
   88, 92, 90, 85, 86, 6.5, 'A+', 8000, 6500, 20, 850.00, 'AUD', 'collected',
   0.5, 37.0, 0.1, 'active', 'verified', NOW(), NOW()),

  -- Tallow Category 3
  ('fa000000-0000-0000-0000-000000000003', 'ABFI-TAL-QLD-000001', 's7777777-7777-7777-7777-777777777777',
   'tallow', 'Tallow Category 3', 'Queensland Beef Tallow',
   'Food-grade beef tallow from QLD processing facilities. Category 3 (edible grade), suitable for premium biodiesel and SAF. Regular supply from major meatworks.',
   -27.5598, 153.0912, 'QLD', 'South East Queensland',
   85, 80, 88, 90, 88, 15.0, 'A', 25000, 18000, 100, 1100.00, 'AUD', 'ex-works',
   0.3, 39.5, 0.05, 'active', 'verified', NOW(), NOW()),

  -- Canola Oil (HEFA-grade)
  ('fa000000-0000-0000-0000-000000000004', 'ABFI-CAN-NSW-000001', 's3333333-3333-3333-3333-333333333333',
   'oilseed', 'Canola Oil', 'NSW Crush Canola Oil',
   'HEFA-grade canola oil from NSW crushing facilities. Meeting EU RED II sustainability criteria. ISCC certified with full chain of custody documentation.',
   -35.1082, 147.3598, 'NSW', 'Riverina',
   84, 82, 85, 88, 86, 28.0, 'B+', 15000, 10000, 100, 1450.00, 'AUD', 'ex-crush',
   0.1, 37.5, 0.02, 'active', 'verified', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CERTIFICATES
-- ============================================

INSERT INTO certificates (id, feedstock_id, type, name, issuer, certificate_number, issue_date, expiry_date, status, verification_url, created_at)
VALUES
  -- Mackay Sugar certs
  (gen_random_uuid(), 'f1111111-1111-1111-1111-111111111111', 'sustainability', 'ISCC EU', 'ISCC System GmbH', 'ISCC-EU-2024-0001234', '2024-01-15', '2025-01-14', 'active', 'https://iscc-system.org/verify', NOW()),
  (gen_random_uuid(), 'f1111111-1111-1111-1111-111111111111', 'quality', 'ISO 9001:2015', 'SAI Global', 'QMS-2024-5678', '2024-03-01', '2027-02-28', 'active', NULL, NOW()),

  -- Wilmar certs
  (gen_random_uuid(), 'f2222222-2222-2222-2222-222222222222', 'sustainability', 'Bonsucro', 'Bonsucro Ltd', 'BON-2024-AU-0089', '2024-02-01', '2025-01-31', 'active', 'https://bonsucro.com/verify', NOW()),
  (gen_random_uuid(), 'f2222222-2222-2222-2222-222222222222', 'sustainability', 'ISCC PLUS', 'ISCC System GmbH', 'ISCC-PLUS-2024-0002345', '2024-01-20', '2025-01-19', 'active', 'https://iscc-system.org/verify', NOW()),

  -- GrainCorp certs
  (gen_random_uuid(), 'f3333333-3333-3333-3333-333333333333', 'sustainability', 'RSB Global', 'Roundtable on Sustainable Biomaterials', 'RSB-2024-0567', '2024-04-01', '2025-03-31', 'active', 'https://rsb.org/verify', NOW()),

  -- APT certs
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', 'sustainability', 'FSC Chain of Custody', 'Forest Stewardship Council', 'FSC-C123456', '2023-06-01', '2028-05-31', 'active', 'https://fsc.org/verify', NOW()),
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', 'sustainability', 'PEFC Chain of Custody', 'PEFC International', 'PEFC-2024-0234', '2024-01-01', '2029-12-31', 'active', 'https://pefc.org/verify', NOW()),
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', 'sustainability', 'ISCC PLUS', 'ISCC System GmbH', 'ISCC-PLUS-2024-0003456', '2024-02-15', '2025-02-14', 'active', 'https://iscc-system.org/verify', NOW()),

  -- UCO certs
  (gen_random_uuid(), 'fa000000-0000-0000-0000-000000000002', 'sustainability', 'ISCC EU', 'ISCC System GmbH', 'ISCC-EU-2024-0004567', '2024-03-01', '2025-02-28', 'active', 'https://iscc-system.org/verify', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. QUALITY TESTS
-- ============================================

INSERT INTO quality_tests (id, feedstock_id, test_type, test_date, laboratory, moisture_content, ash_content, energy_content_mj_kg, volatile_matter, fixed_carbon, sulfur_content, chlorine_content, nitrogen_content, bulk_density, particle_size_distribution, notes, created_at)
VALUES
  -- Mackay Bagasse tests
  (gen_random_uuid(), 'f1111111-1111-1111-1111-111111111111', 'proximate', '2024-11-01', 'ALS Environmental Brisbane', 48.5, 2.8, 8.2, 78.5, 18.7, 0.05, 0.02, 0.35, 120, '{"<5mm": 15, "5-20mm": 65, ">20mm": 20}', 'Sample from Racecourse Mill discharge', NOW()),
  (gen_random_uuid(), 'f1111111-1111-1111-1111-111111111111', 'ultimate', '2024-11-15', 'ALS Environmental Brisbane', 48.2, 2.9, 8.1, 78.2, 18.9, 0.04, 0.02, 0.33, 118, NULL, 'Monthly quality verification', NOW()),

  -- Wood Chips tests
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', 'proximate', '2024-10-15', 'SGS Melbourne', 25.0, 1.2, 18.5, 82.5, 16.3, 0.01, 0.01, 0.15, 280, '{"<30mm": 8, "30-50mm": 85, ">50mm": 7}', 'Quarterly chip quality assessment', NOW()),

  -- UCO tests
  (gen_random_uuid(), 'fa000000-0000-0000-0000-000000000002', 'full', '2024-11-10', 'Intertek Melbourne', 0.5, 0.1, 37.0, NULL, NULL, 0.001, NULL, NULL, 920, NULL, 'FFA: 3.2%, MIU: 0.8%', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SAMPLE INQUIRIES
-- ============================================

INSERT INTO inquiries (id, buyer_id, supplier_id, feedstock_id, subject, initial_message, volume_requested, delivery_location, delivery_date_start, delivery_date_end, status, created_at, updated_at)
VALUES
  -- Viva Energy inquiring about bagasse
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111',
   'Bagasse Supply for Geelong Renewable Diesel Project',
   'We are developing renewable diesel production at our Geelong refinery and are interested in securing long-term bagasse supply. Could you provide details on: 1) Available volumes for 2025-2027, 2) Delivered pricing to Geelong, 3) ISCC certification documentation. We anticipate requiring 50,000 tonnes annually.',
   50000, 'Geelong Refinery, VIC', '2025-06-01', '2025-12-31', 'pending', NOW(), NOW()),

  -- Qantas inquiring about UCO
  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 's8888888-8888-8888-8888-888888888888', 'fa000000-0000-0000-0000-000000000002',
   'UCO Sourcing for SAF Production Partnership',
   'Qantas is partnering with a SAF producer and seeking ISCC-certified UCO feedstock. We require: 1) Volumes available for dedicated supply contract, 2) Carbon intensity documentation, 3) Collection logistics to Brisbane. Our partner facility will require consistent monthly deliveries.',
   5000, 'Brisbane Airport Fuel Facility', '2025-03-01', '2026-02-28', 'responded', NOW(), NOW()),

  -- Cleanergy inquiring about tallow
  (gen_random_uuid(), 'b5555555-5555-5555-5555-555555555555', 's7777777-7777-7777-7777-777777777777', 'fa000000-0000-0000-0000-000000000003',
   'Category 3 Tallow for Renewable Diesel Facility',
   'Cleanergy is commissioning a renewable diesel facility in Queensland and requires Category 3 tallow supply. Please advise on: 1) Annual supply capacity, 2) Pricing structure, 3) Quality specifications and consistency, 4) Delivery to Gladstone industrial area.',
   15000, 'Gladstone Industrial Estate, QLD', '2025-07-01', '2026-06-30', 'pending', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. SHORTLISTS
-- ============================================

INSERT INTO shortlists (id, buyer_id, feedstock_id, notes, created_at)
VALUES
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Priority feedstock for renewable diesel - good CI score', NOW()),
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 'f2222222-2222-2222-2222-222222222222', 'Backup bagasse supply option', NOW()),
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 'fa000000-0000-0000-0000-000000000002', 'UCO for blending - excellent CI', NOW()),

  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 'fa000000-0000-0000-0000-000000000002', 'Key UCO source for SAF project', NOW()),
  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 'fa000000-0000-0000-0000-000000000003', 'Tallow option - good for CORSIA', NOW()),
  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 'fa000000-0000-0000-0000-000000000004', 'Canola oil alternative', NOW()),

  (gen_random_uuid(), 'b3333333-3333-3333-3333-333333333333', 'f5555555-5555-5555-5555-555555555555', 'Wood chips for Eraring co-firing trial', NOW()),
  (gen_random_uuid(), 'b3333333-3333-3333-3333-333333333333', 'f7777777-7777-7777-7777-777777777777', 'Forest residues - cost competitive', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. NOTIFICATIONS
-- ============================================

INSERT INTO notifications (id, user_id, type, title, message, link, read, created_at)
VALUES
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'inquiry', 'New Feedstock Match', 'A new bagasse listing matches your procurement criteria', '/buyer/search?category=lignocellulosic', false, NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'inquiry', 'New Inquiry Received', 'Viva Energy has submitted an inquiry for your bagasse', '/supplier/inquiries', false, NOW()),
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'system', 'ISCC Certification Reminder', 'Your preferred feedstock UCO certification expires in 60 days', '/buyer/shortlist', false, NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. MARKET SIGNALS (for commodity markets)
-- ============================================

INSERT INTO market_signals (id, user_id, commodity_id, commodity_name, signal_type, volume, unit, notes, status, created_at)
VALUES
  -- Buy signals
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bagasse', 'Bagasse', 'buy', 50000, 'tonne', 'Seeking ISCC certified bagasse for 2025', 'active', NOW()),
  (gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'uco-restaurant', 'UCO (restaurant collection)', 'buy', 10000, 'litre/tonne', 'Metro collection areas preferred', 'active', NOW()),
  (gen_random_uuid(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'wood-chips-softwood', 'Wood chips (softwood)', 'buy', 100000, 'tonne', 'For Eraring co-firing project', 'active', NOW()),
  (gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tallow-cat3', 'Tallow (Category 3/edible)', 'buy', 20000, 'tonne', 'CORSIA-eligible for SAF', 'active', NOW()),

  -- Sell signals
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'bagasse', 'Bagasse', 'sell', 180000, 'tonne', '2025 crushing season availability', 'active', NOW()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'bagasse', 'Bagasse', 'sell', 220000, 'tonne', 'Wilmar multi-mill supply', 'active', NOW()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'wheat-straw', 'Wheat straw', 'sell', 50000, 'tonne/bale', '2025 harvest expected', 'active', NOW()),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'wood-chips-softwood', 'Wood chips (softwood)', 'sell', 72000, 'tonne', 'Continuous supply from Gippsland', 'active', NOW()),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 'uco-restaurant', 'UCO (restaurant collection)', 'sell', 6500, 'litre/tonne', 'Melbourne metro collection network', 'active', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ ABFI Seed Data Complete!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - 13 user profiles (8 suppliers, 5 buyers)';
  RAISE NOTICE '  - 8 supplier companies';
  RAISE NOTICE '  - 5 buyer companies';
  RAISE NOTICE '  - 14 feedstock listings with ABFI scores';
  RAISE NOTICE '  - 9 certificates';
  RAISE NOTICE '  - 4 quality test records';
  RAISE NOTICE '  - 3 sample inquiries';
  RAISE NOTICE '  - 8 shortlist entries';
  RAISE NOTICE '  - 3 notifications';
  RAISE NOTICE '  - 9 market signals';
END $$;
