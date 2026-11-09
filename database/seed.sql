-- ============================================================================
-- D'Bai Cui Artisan Bakery & Cake Management System
-- Comprehensive Seed Data for 18 Relational Tables
-- Compatible with PostgreSQL 15+ and SQLite 3.35+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ROLES
-- ----------------------------------------------------------------------------
INSERT INTO roles (id, code, name, description) VALUES
('r-owner', 'owner', 'Owner / Executive', 'Akses penuh ke semua modul bisnis, keuangan, P&L, dan audit'),
('r-manager', 'manager', 'Store & Kitchen Manager', 'Manajemen operasional dapur, oven batching, resep BOM, dan opname bahan'),
('r-cashier', 'cashier', 'Cashier / Front-Desk', 'Operasional kasir POS cepat, custom cake order taker, dan cetak struk'),
('r-customer', 'customer', 'VIP Customer', 'Katalog pre-order mandiri, pelacakan live status kue, dan loyalty points')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. PERMISSIONS
-- ----------------------------------------------------------------------------
INSERT INTO permissions (id, code, module, description) VALUES
('p-pnl-read', 'reports.pnl.read', 'analytics', 'Melihat laporan laba rugi dan margin HPP riil'),
('p-sales-read', 'reports.sales.read', 'analytics', 'Melihat ringkasan omzet dan chart tren penjualan'),
('p-pos-create', 'pos.order.create', 'pos', 'Melakukan transaksi kasir dan quick tender'),
('p-pos-void', 'pos.order.void', 'pos', 'Membatalkan atau void struk kasir'),
('p-oven-manage', 'kitchen.oven.manage', 'production', 'Mengatur antrean loyang dan status baking oven'),
('p-bom-update', 'kitchen.recipe.update', 'production', 'Mengubah takaran formula resep dan kalkulasi HPP'),
('p-inv-opname', 'inventory.opname.adjust', 'inventory', 'Melakukan stock opname dan penyesuaian bahan baku'),
('p-inv-view', 'inventory.stock.read', 'inventory', 'Melihat sisa stok bahan baku dan peringatan kedaluwarsa')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. ROLE PERMISSIONS
-- ----------------------------------------------------------------------------
INSERT INTO role_permissions (role_id, permission_id) VALUES
('r-owner', 'p-pnl-read'),
('r-owner', 'p-sales-read'),
('r-owner', 'p-pos-create'),
('r-owner', 'p-pos-void'),
('r-owner', 'p-oven-manage'),
('r-owner', 'p-bom-update'),
('r-owner', 'p-inv-opname'),
('r-owner', 'p-inv-view'),
('r-manager', 'p-sales-read'),
('r-manager', 'p-pos-create'),
('r-manager', 'p-oven-manage'),
('r-manager', 'p-bom-update'),
('r-manager', 'p-inv-opname'),
('r-manager', 'p-inv-view'),
('r-cashier', 'p-pos-create'),
('r-cashier', 'p-inv-view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. MEMBER TIERS
-- ----------------------------------------------------------------------------
INSERT INTO member_tiers (id, code, name, min_points, discount_percent, point_multiplier, perks_summary) VALUES
('tier-classic', 'classic', 'Classic Member', 0, 0.00, 1.00, 'Poin dasar 1x setiap transaksi'),
('tier-silver', 'silver', 'Silver Artisan', 500, 5.00, 1.25, 'Diskon 5% viennoiserie & poin 1.25x'),
('tier-gold', 'gold', 'Gold Patisserie', 1500, 10.00, 1.50, 'Diskon 10% all cakes, lilin gratis & prioritas antrean custom cake'),
('tier-platinum', 'platinum', 'Platinum VVIP', 5000, 15.00, 2.00, 'Diskon 15% all items, free delivery Jabodetabek, personalized cake board inscription')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. USERS (Akun demo: Password123! hashed $2a$12$...)
-- PIN Owner: 888888, Manager: 123456, Cashier: 112233
-- ----------------------------------------------------------------------------
INSERT INTO users (id, role_id, member_tier_id, full_name, email, phone, password_hash, pin_hash, loyalty_points, commission_rate_percent, avatar_url, is_active) VALUES
('usr-owner-01', 'r-owner', NULL, 'Hendra Wijaya, B.B.A', 'owner@dbaicui.id', '081122334455', '$2a$12$e0M2/4i5PqC93qT2Wf1yEeoYmU0O/k20fF3RkYlU31gL.cMfs9lcy', '$2a$12$G8jF2wLhA1zFzE1o7.N3geiWnL3v2V3sL.2k3F2R1kLmNoPqRsTuV', 0, 0.00, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', TRUE),
('usr-mgr-01', 'r-manager', NULL, 'Chef Pierre Sutanto', 'manager@dbaicui.id', '081299887766', '$2a$12$e0M2/4i5PqC93qT2Wf1yEeoYmU0O/k20fF3RkYlU31gL.cMfs9lcy', '$2a$12$XyZ12345678901234567890123456789012345678901234567890', 0, 1.50, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150', TRUE),
('usr-csh-01', 'r-cashier', NULL, 'Siti Nurhaliza (Kasir Shift A)', 'kasir@dbaicui.id', '081377665544', '$2a$12$e0M2/4i5PqC93qT2Wf1yEeoYmU0O/k20fF3RkYlU31gL.cMfs9lcy', '$2a$12$AbC98765432109876543210987654321098765432109876543210', 0, 2.00, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', TRUE),
('usr-vip-01', 'r-customer', 'tier-gold', 'Nadia Salsabila', 'nadia@vip.dbaicui.id', '081234567890', '$2a$12$e0M2/4i5PqC93qT2Wf1yEeoYmU0O/k20fF3RkYlU31gL.cMfs9lcy', NULL, 1850, 0.00, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', TRUE),
('usr-vip-02', 'r-customer', 'tier-platinum', 'Budi Hartono', 'budi@vip.dbaicui.id', '081987654321', '$2a$12$e0M2/4i5PqC93qT2Wf1yEeoYmU0O/k20fF3RkYlU31gL.cMfs9lcy', NULL, 6420, 0.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO categories (id, slug, name, description, sort_order, is_active) VALUES
('cat-croissant', 'viennoiserie', 'Viennoiserie & Croissant', 'Croissant butter lamination, Danish, Pain au Chocolat', 1, TRUE),
('cat-sourdough', 'artisan-bread', 'Artisan Sourdough & Loaf', 'Roti fermentasi alami 24 jam dengan crust renyah & crumb kenyal', 2, TRUE),
('cat-signature', 'signature-cake', 'Signature Whole Cake', 'Entremets mewah, Basque Burnt Cheesecake, Chocolate Truffle', 3, TRUE),
('cat-custom', 'custom-cake', 'Bespoke Custom Cake', 'Kue ulang tahun dan pernikahan khusus dengan pesan kustom', 4, TRUE),
('cat-beverage', 'specialty-coffee', 'Artisan Coffee & Drinks', 'Espresso single origin, Matcha Latte Uji, dan Cold Brew', 5, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. INGREDIENTS (Bahan Baku Premium & Expiry Tracking)
-- ----------------------------------------------------------------------------
INSERT INTO ingredients (id, code, name, unit, current_stock, min_stock_threshold, cost_per_unit, supplier_name, nearest_expiry_date, storage_location, is_active) VALUES
('ing-butter-anchor', 'ING-BTR-01', 'Anchor Unsalted Butter Sheet 82%', 'gram', 24500.000, 5000.000, 0.1750, 'PT Fonterra Brands Indonesia', '2026-12-15', 'Chiller A (4°C)', TRUE),
('ing-flour-komachi', 'ING-FLR-01', 'Tepung Terigu Komachi Premium (Protein Tinggi)', 'gram', 95000.000, 20000.000, 0.0240, 'Nippon Flour Mills Import', '2027-04-30', 'Dry Pantry Rack 1', TRUE),
('ing-choc-valrhona', 'ING-CHC-01', 'Valrhona Guanaja Dark Chocolate 70%', 'gram', 8200.000, 2500.000, 0.4200, 'Classic Fine Foods ID', '2027-01-20', 'Dry Pantry Dark Room', TRUE),
('ing-cheese-ellevire', 'ING-CHS-01', 'Elle & Vire Cream Cheese French Origin', 'gram', 14000.000, 4000.000, 0.1900, 'Sukanda Djaya', '2026-11-28', 'Chiller B (3°C)', TRUE),
('ing-egg-pasteurized', 'ING-EGG-01', 'Telur Omega Pasteurisasi Fresh', 'pcs', 320.000, 80.000, 2800.0000, 'Farm Fresh Lembang', '2026-11-24', 'Chiller Eggs Rack', TRUE),
('ing-vanilla-madagascar', 'ING-VAN-01', 'Madagascar Bourbon Vanilla Bean Pod', 'pcs', 45.000, 15.000, 28000.0000, 'Spice Island Import', '2027-08-10', 'Aroma Vault Safe', TRUE),
('ing-cream-anchor', 'ING-CRM-01', 'Anchor Whipping Cream 35.5% Dairy', 'ml', 18500.000, 4000.000, 0.0850, 'PT Fonterra Brands Indonesia', '2026-12-05', 'Chiller A (4°C)', TRUE),
('ing-sugar-fine', 'ING-SGR-01', 'Gula Kastor Halus Gulaku Premium', 'gram', 60000.000, 15000.000, 0.0190, 'Distributor Sembako Mandiri', '2027-10-01', 'Dry Pantry Rack 2', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. PRODUCTS
-- ----------------------------------------------------------------------------
INSERT INTO products (id, category_id, sku, name, slug, description, base_price, calculated_hpp, stock_qty, is_custom_cake, is_preorder_only, prep_lead_hours, image_url, allergen_tags, is_available) VALUES
('prd-croissant-classic', 'cat-croissant', 'VNS-CRO-01', 'French Butter Croissant (Isigny Lamination)', 'french-butter-croissant', 'Croissant lapis renyah dengan aroma karamelisasi butter Anchor 82% autentik Paris', 32000.00, 11800.00, 28, FALSE, FALSE, 0, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 'gluten,dairy', TRUE),
('prd-pain-choc', 'cat-croissant', 'VNS-PAC-01', 'Pain au Chocolat Double Valrhona', 'pain-au-chocolat', 'Viennoiserie klasik Prancis dengan isian double bar Valrhona Guanaja 70%', 38000.00, 14500.00, 19, FALSE, FALSE, 0, 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400', 'gluten,dairy', TRUE),
('prd-sourdough-country', 'cat-sourdough', 'BRD-SRD-01', 'Artisan Country Sourdough Batard', 'country-sourdough-batard', 'Roti fermentasi 28 jam dengan starter ragi alami wild yeast, crust renyah & sarang lebah kenyal', 55000.00, 16200.00, 14, FALSE, FALSE, 0, 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400', 'gluten', TRUE),
('prd-basque-cheesecake', 'cat-signature', 'CAK-BSQ-01', 'San Sebastian Basque Burnt Cheesecake (D16)', 'basque-burnt-cheesecake', 'Cheesecake lumer khas Spanyol dengan karamelisasi gosong nikmat & cream cheese Elle & Vire', 285000.00, 89500.00, 8, FALSE, FALSE, 0, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', 'dairy,eggs', TRUE),
('prd-custom-bday-cake', 'cat-custom', 'CAK-CUS-01', 'Bespoke Celebration Cake (Custom Decor & Piping)', 'bespoke-celebration-cake', 'Kue ulang tahun / anniversary custom dengan sponge lembut, buttercream swiss, dan ucapan khusus', 450000.00, 142000.00, 99, TRUE, TRUE, 6, 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=400', 'gluten,dairy,eggs', TRUE),
('prd-latte-single-origin', 'cat-beverage', 'BEV-LAT-01', 'Artisan Cafe Latte (Single Origin Flores)', 'artisan-cafe-latte', 'Espresso double shot Flores Bajawa dengan steamed fresh dairy milk microfoam', 38000.00, 9200.00, 50, FALSE, FALSE, 0, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400', 'dairy', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. PRODUCT VARIANTS
-- ----------------------------------------------------------------------------
INSERT INTO product_variants (id, product_id, sku_suffix, name, price_delta, hpp_multiplier, is_active) VALUES
('var-cro-reg', 'prd-croissant-classic', 'REG', 'Standard Size (80g)', 0.00, 1.000, TRUE),
('var-cro-mini', 'prd-croissant-classic', 'MINI', 'Mini Box (4 pcs @35g)', 28000.00, 1.650, TRUE),
('var-bsq-d16', 'prd-basque-cheesecake', 'D16', 'Diameter 16cm (4-6 Porsi)', 0.00, 1.000, TRUE),
('var-bsq-d20', 'prd-basque-cheesecake', 'D20', 'Diameter 20cm (8-10 Porsi)', 140000.00, 1.580, TRUE),
('var-cus-d18', 'prd-custom-bday-cake', 'D18', 'Diameter 18cm Standard Tier', 0.00, 1.000, TRUE),
('var-cus-d22', 'prd-custom-bday-cake', 'D22', 'Diameter 22cm Grand Tier', 200000.00, 1.550, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. RECIPES (BOM Header)
-- ----------------------------------------------------------------------------
INSERT INTO recipes (id, product_id, yield_qty, prep_minutes, bake_minutes, oven_temp_celsius, overhead_cost_per_batch, notes, updated_by) VALUES
('rcp-cro-01', 'prd-croissant-classic', 12, 180, 22, 195, 12000.00, 'Batch lamination 3x single fold, istirahat chiller 45 min per fold', 'usr-mgr-01'),
('rcp-bsq-01', 'prd-basque-cheesecake', 2, 40, 28, 230, 18000.00, 'Oven dek api atas 240C, api bawah 210C untuk efek burnt karamel sempurna', 'usr-mgr-01'),
('rcp-cus-01', 'prd-custom-bday-cake', 1, 90, 35, 175, 25000.00, 'Kue dasar vanila sponge dengan isian Valrhona ganache & Swiss meringue', 'usr-mgr-01')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. RECIPE ITEMS (BOM Detail per Batch)
-- ----------------------------------------------------------------------------
INSERT INTO recipe_items (id, recipe_id, ingredient_id, quantity_required, waste_factor_percent) VALUES
('ri-cro-01', 'rcp-cro-01', 'ing-flour-komachi', 1000.000, 2.00),
('ri-cro-02', 'rcp-cro-01', 'ing-butter-anchor', 520.000, 3.50),
('ri-cro-03', 'rcp-cro-01', 'ing-sugar-fine', 120.000, 1.00),
('ri-bsq-01', 'rcp-bsq-01', 'ing-cheese-ellevire', 860.000, 1.50),
('ri-bsq-02', 'rcp-bsq-01', 'ing-cream-anchor', 480.000, 2.00),
('ri-bsq-03', 'rcp-bsq-01', 'ing-egg-pasteurized', 6.000, 0.00),
('ri-bsq-04', 'rcp-bsq-01', 'ing-sugar-fine', 210.000, 1.00),
('ri-cus-01', 'rcp-cus-01', 'ing-flour-komachi', 350.000, 2.00),
('ri-cus-02', 'rcp-cus-01', 'ing-butter-anchor', 250.000, 2.00),
('ri-cus-03', 'rcp-cus-01', 'ing-choc-valrhona', 180.000, 1.00),
('ri-cus-04', 'rcp-cus-01', 'ing-egg-pasteurized', 5.000, 0.00),
('ri-cus-05', 'rcp-cus-01', 'ing-cream-anchor', 300.000, 2.00)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. PRODUCTION BATCHES (Kitchen Queue / Oven KDS)
-- ----------------------------------------------------------------------------
INSERT INTO production_batches (id, batch_code, recipe_id, baker_id, planned_qty, actual_yield_qty, status, oven_slot, started_at, completed_at, notes) VALUES
('bat-001', 'OVN-20261109-001', 'rcp-cro-01', 'usr-mgr-01', 24, 24, 'completed', 'Deck Oven #1 (Left)', '2026-11-09 05:30:00', '2026-11-09 06:15:00', 'Morning batch batch display etalase buka'),
('bat-002', 'OVN-20261109-002', 'rcp-bsq-01', 'usr-mgr-01', 4, 4, 'baking', 'Deck Oven #2 (Middle)', '2026-11-09 09:45:00', NULL, 'Restock chiller sore & preorder VVIP'),
('bat-003', 'OVN-20261109-003', 'rcp-cus-01', 'usr-mgr-01', 2, 0, 'proofing', 'Convection Oven #3', '2026-11-09 10:30:00', NULL, 'Pesanan Custom Cake Nadia & Budi')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 13. INVENTORY LOGS (Audit Mutasi Bahan & FEFO)
-- ----------------------------------------------------------------------------
INSERT INTO inventory_logs (id, ingredient_id, actor_id, change_type, qty_delta, stock_before, stock_after, unit_cost_snapshot, reference_type, reference_id, expiry_date, notes) VALUES
('log-inv-01', 'ing-butter-anchor', 'usr-mgr-01', 'purchase_in', 30000.000, 500.000, 30500.000, 0.1750, 'purchase_order', 'PO-20261101-01', '2026-12-15', 'Penerimaan kontainer dingin Fonterra'),
('log-inv-02', 'ing-butter-anchor', 'usr-mgr-01', 'production_out', -1040.000, 30500.000, 29460.000, 0.1750, 'production_batch', 'bat-001', '2026-12-15', 'Konsumsi 2 batch croissant pagi'),
('log-inv-03', 'ing-cheese-ellevire', 'usr-mgr-01', 'purchase_in', 15000.000, 720.000, 15720.000, 0.1900, 'purchase_order', 'PO-20261103-04', '2026-11-28', 'Stok bulanan chiller B'),
('log-inv-04', 'ing-cheese-ellevire', 'usr-mgr-01', 'production_out', -1720.000, 15720.000, 14000.000, 0.1900, 'production_batch', 'bat-002', '2026-11-28', 'Baking 4 loyang basque burnt cheesecake')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 14. ORDERS (POS & Custom Pre-Order)
-- ----------------------------------------------------------------------------
INSERT INTO orders (id, order_number, order_type, customer_id, cashier_id, customer_name, customer_phone, status, payment_status, payment_method, subtotal_amount, discount_amount, tax_amount, total_amount, dp_amount, paid_amount, total_hpp_snapshot, points_earned, points_redeemed, pickup_scheduled_at, delivery_notes) VALUES
('ord-pos-001', 'DBC-20261109-0001', 'pos_retail', 'usr-vip-01', 'usr-csh-01', 'Nadia Salsabila', '081234567890', 'completed', 'paid', 'qris', 108000.00, 10800.00, 9720.00, 106920.00, 0.00, 106920.00, 38100.00, 160, 0, NULL, 'Walk-in take away box'),
('ord-pos-002', 'DBC-20261109-0002', 'pos_retail', NULL, 'usr-csh-01', 'Walk-in Guest #02', '081399998888', 'completed', 'paid', 'cash', 64000.00, 0.00, 6400.00, 70400.00, 0.00, 100000.00, 23600.00, 0, 0, NULL, 'Dine-in table 04'),
('ord-cus-003', 'DBC-20261109-0003', 'custom_cake', 'usr-vip-02', 'usr-csh-01', 'Budi Hartono', '081987654321', 'decorating', 'paid', 'debit', 650000.00, 97500.00, 55250.00, 607750.00, 300000.00, 607750.00, 195000.00, 1215, 0, '2026-11-09 16:30:00', 'Self-pickup store, siapkan candle angka 50 emas'),
('ord-pre-004', 'DBC-20261109-0004', 'custom_cake', 'usr-vip-01', 'usr-csh-01', 'Nadia Salsabila', '081234567890', 'baking', 'dp_paid', 'qris', 450000.00, 45000.00, 40500.00, 445500.00, 250000.00, 250000.00, 142000.00, 0, 0, '2026-11-10 14:00:00', 'Packaging kotak akrilik transparan pita gold')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 15. ORDER ITEMS
-- ----------------------------------------------------------------------------
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name_snapshot, quantity, unit_price, unit_hpp_snapshot, subtotal, custom_inscription, custom_flavor_notes, reference_image_url) VALUES
('itm-001', 'ord-pos-001', 'prd-croissant-classic', 'var-cro-reg', 'French Butter Croissant (Isigny Lamination)', 2, 32000.00, 11800.00, 64000.00, NULL, NULL, NULL),
('itm-002', 'ord-pos-001', 'prd-latte-single-origin', NULL, 'Artisan Cafe Latte (Single Origin Flores)', 1, 38000.00, 9200.00, 38000.00, NULL, 'Extra hot, oatmilk request', NULL),
('itm-003', 'ord-pos-002', 'prd-croissant-classic', 'var-cro-reg', 'French Butter Croissant (Isigny Lamination)', 2, 32000.00, 11800.00, 64000.00, NULL, NULL, NULL),
('itm-004', 'ord-cus-003', 'prd-custom-bday-cake', 'var-cus-d22', 'Bespoke Celebration Cake (Custom Decor & Piping)', 1, 650000.00, 195000.00, 650000.00, 'Happy 50th Golden Jubilee, Bapak Hartono tercinta!', 'Dark chocolate moist sponge, rum syrup non-alkohol, gold leaf flakes', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600'),
('itm-005', 'ord-pre-004', 'prd-custom-bday-cake', 'var-cus-d18', 'Bespoke Celebration Cake (Custom Decor & Piping)', 1, 450000.00, 142000.00, 450000.00, 'Happy Sweet 17 Cherie Nadia! Love, Mom & Dad', 'Strawberry shortcake fraisier sponge, fresh Hokkaido cream', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 16. PAYMENTS
-- ----------------------------------------------------------------------------
INSERT INTO payments (id, order_id, payment_method, payment_stage, amount, external_reference, qris_payload, status, paid_at) VALUES
('pay-001', 'ord-pos-001', 'qris', 'full', 106920.00, 'QRIS-NMID-99281726351', '00020101021226600016ID.CO.QRIS.WWW011893600999000000000102150811223344556675204581253033605802ID5919D BAI CUI ARTISAN6007JAKARTA61051219062070703A016304A1B2', 'settled', '2026-11-09 08:14:22'),
('pay-002', 'ord-pos-002', 'cash', 'full', 70400.00, 'CASH-DRAWER-01', NULL, 'settled', '2026-11-09 09:20:05'),
('pay-003', 'ord-cus-003', 'debit', 'dp', 300000.00, 'BCA-EDC-TX-882910', NULL, 'settled', '2026-11-08 14:10:00'),
('pay-004', 'ord-cus-003', 'debit', 'settlement', 307750.00, 'BCA-EDC-TX-883501', NULL, 'settled', '2026-11-09 11:05:00'),
('pay-005', 'ord-pre-004', 'qris', 'dp', 250000.00, 'QRIS-NMID-99281729912', '00020101021226600016ID.CO.QRIS.WWW011893600999000000000102150811223344556675204581253033605802ID5919D BAI CUI ARTISAN6007JAKARTA61051219062070703A016304E8F1', 'settled', '2026-11-09 09:50:11')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 17. SESSIONS (Active Mock Sessions)
-- ----------------------------------------------------------------------------
INSERT INTO sessions (id, user_id, refresh_token_hash, auth_mode, device_info, ip_address, expires_at) VALUES
('ses-own-01', 'usr-owner-01', 'token-hash-mock-owner', 'password', 'MacBook Pro M3 Max Chrome 124', '127.0.0.1', '2026-11-16 00:00:00'),
('ses-csh-01', 'usr-csh-01', 'token-hash-mock-cashier', 'pin', 'POS Terminal Sunmi D2s 15.6 Inch', '192.168.1.101', '2026-11-10 00:00:00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 18. LOYALTY TRANSACTIONS
-- ----------------------------------------------------------------------------
INSERT INTO loyalty_transactions (id, customer_id, order_id, points_delta, reason) VALUES
('loy-001', 'usr-vip-01', 'ord-pos-001', 160, 'Pembelian POS Croissant & Coffee (Multiplier 1.5x Gold Tier)'),
('loy-002', 'usr-vip-02', 'ord-cus-003', 1215, 'Pelunasan Bespoke Celebration Cake 50th (Multiplier 2.0x Platinum Tier)')
ON CONFLICT (id) DO NOTHING;
