-- ============================================================================
-- D'Bai Cui Artisan Bakery & Cake Management System
-- Relational Database Schema (PostgreSQL 15+ & SQLite 3.35+ Compatible)
-- ============================================================================
-- Catatan Kompatibilitas:
-- 1. Primary Key menggunakan VARCHAR(36) (UUID v4) yang di-generate oleh layer
--    aplikasi/adapter agar identik di PostgreSQL (Production) & SQLite (Staging).
-- 2. Tipe data standar SQL (VARCHAR, TEXT, INTEGER, NUMERIC(14,2), BOOLEAN,
--    TIMESTAMP) dipakai agar dapat dieksekusi langsung di kedua engine.
-- 3. Di SQLite, aktifkan `PRAGMA foreign_keys = ON;` pada setiap koneksi.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. AUTENTIKASI, OTORISASI (RBAC) & SESI
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,          -- 'owner', 'manager', 'cashier', 'customer'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,          -- e.g. 'reports.pnl.read', 'pos.order.create'
    module VARCHAR(50) NOT NULL,               -- 'analytics', 'production', 'pos', 'catalog', 'users'
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS member_tiers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,          -- 'classic', 'gold', 'platinum', 'vvip'
    name VARCHAR(80) NOT NULL,
    min_points INTEGER NOT NULL DEFAULT 0,
    discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    point_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    perks_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    role_id VARCHAR(36) NOT NULL,
    member_tier_id VARCHAR(36),                -- Nullable; diisi untuk customer/member VIP
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    phone VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,       -- bcrypt/argon2 hash
    pin_hash VARCHAR(255),                     -- 6-digit Terminal Quick PIN hash (untuk cashier/manager)
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- Komisi staff/kasir
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (member_tier_id) REFERENCES member_tiers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    auth_mode VARCHAR(20) NOT NULL DEFAULT 'password' CHECK (auth_mode IN ('password', 'pin', 'oauth')),
    device_info VARCHAR(255),
    ip_address VARCHAR(64),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 2. KATALOG PRODUK, VARIAN & KOMPOSISI RESEP (BOM / HPP)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,                -- 'Artisan Bread', 'Viennoiserie', 'Signature Whole Cake', 'Custom Cake', 'Beverages'
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    category_id VARCHAR(36) NOT NULL,
    sku VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    calculated_hpp NUMERIC(14, 2) NOT NULL DEFAULT 0.00, -- Snapshot HPP dari Recipe BOM
    stock_qty INTEGER NOT NULL DEFAULT 0,      -- Stok siap jual di etalase
    is_custom_cake BOOLEAN NOT NULL DEFAULT FALSE,
    is_preorder_only BOOLEAN NOT NULL DEFAULT FALSE,
    prep_lead_hours INTEGER NOT NULL DEFAULT 0,-- Estimasi waktu pre-order custom cake (jam)
    image_url TEXT,
    allergen_tags VARCHAR(255),                -- e.g. 'gluten,dairy,nuts,eggs'
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_variants (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    sku_suffix VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,                -- e.g. 'Diameter 16cm', 'Diameter 20cm', 'Slice'
    price_delta NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    hpp_multiplier NUMERIC(6, 3) NOT NULL DEFAULT 1.000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (product_id, sku_suffix)
);

-- ----------------------------------------------------------------------------
-- 3. BAHAN BAKU (INGREDIENTS), RESEP (BOM) & PRODUKSI OVEN
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,                -- e.g. 'Isigny Ste Mere Butter', 'Valrhona Dark 70%'
    unit VARCHAR(20) NOT NULL,                 -- 'gram', 'ml', 'pcs'
    current_stock NUMERIC(14, 3) NOT NULL DEFAULT 0.000,
    min_stock_threshold NUMERIC(14, 3) NOT NULL DEFAULT 0.000,
    cost_per_unit NUMERIC(14, 4) NOT NULL DEFAULT 0.0000, -- Harga beli per unit terkecil (Rp/gram)
    supplier_name VARCHAR(150),
    nearest_expiry_date DATE,
    storage_location VARCHAR(80),              -- 'Chiller A', 'Freezer', 'Dry Pantry'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL UNIQUE,
    yield_qty INTEGER NOT NULL DEFAULT 1,      -- Jumlah produk jadi per 1 batch resep
    prep_minutes INTEGER NOT NULL DEFAULT 30,
    bake_minutes INTEGER NOT NULL DEFAULT 25,
    oven_temp_celsius INTEGER,
    overhead_cost_per_batch NUMERIC(14, 2) NOT NULL DEFAULT 0.00, -- Listrik/gas/kemasan
    notes TEXT,
    updated_by VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS recipe_items (
    id VARCHAR(36) PRIMARY KEY,
    recipe_id VARCHAR(36) NOT NULL,
    ingredient_id VARCHAR(36) NOT NULL,
    quantity_required NUMERIC(14, 3) NOT NULL, -- Dalam satuan unit ingredient (gram/ml/pcs)
    waste_factor_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT,
    UNIQUE (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS production_batches (
    id VARCHAR(36) PRIMARY KEY,
    batch_code VARCHAR(40) NOT NULL UNIQUE,    -- e.g. 'OVN-20261109-001'
    recipe_id VARCHAR(36) NOT NULL,
    baker_id VARCHAR(36) NOT NULL,
    planned_qty INTEGER NOT NULL,
    actual_yield_qty INTEGER DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'queued'
        CHECK (status IN ('queued', 'mixing', 'proofing', 'baking', 'cooling', 'completed', 'cancelled')),
    oven_slot VARCHAR(40),                     -- e.g. 'Deck Oven #1'
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE RESTRICT,
    FOREIGN KEY (baker_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id VARCHAR(36) PRIMARY KEY,
    ingredient_id VARCHAR(36) NOT NULL,
    actor_id VARCHAR(36),
    change_type VARCHAR(30) NOT NULL
        CHECK (change_type IN ('purchase_in', 'production_out', 'waste_expired', 'opname_adjust', 'return_in')),
    qty_delta NUMERIC(14, 3) NOT NULL,         -- Positif untuk masuk, negatif untuk keluar
    stock_before NUMERIC(14, 3) NOT NULL,
    stock_after NUMERIC(14, 3) NOT NULL,
    unit_cost_snapshot NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
    reference_type VARCHAR(40),                -- 'production_batch', 'manual_opname', 'purchase_order'
    reference_id VARCHAR(36),
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 4. TRANSAKSI POS, CUSTOM CAKE PRE-ORDER & PEMBAYARAN
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,  -- e.g. 'DBC-20261109-0001'
    order_type VARCHAR(25) NOT NULL DEFAULT 'pos_retail'
        CHECK (order_type IN ('pos_retail', 'custom_cake', 'vip_preorder')),
    customer_id VARCHAR(36),                   -- Nullable untuk walk-in guest
    cashier_id VARCHAR(36),                    -- Nullable jika order mandiri dari app customer
    customer_name VARCHAR(150),
    customer_phone VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'baking', 'decorating', 'ready_pickup', 'completed', 'cancelled')),
    payment_status VARCHAR(25) NOT NULL DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'dp_paid', 'paid', 'refunded')),
    payment_method VARCHAR(25)
        CHECK (payment_method IN ('qris', 'cash', 'debit', 'transfer', 'mixed')),
    subtotal_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    dp_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_hpp_snapshot NUMERIC(14, 2) NOT NULL DEFAULT 0.00, -- Untuk laporan P&L akurat
    points_earned INTEGER NOT NULL DEFAULT 0,
    points_redeemed INTEGER NOT NULL DEFAULT 0,
    pickup_scheduled_at TIMESTAMP,             -- Wajib untuk custom cake / pre-order
    delivery_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36),
    product_name_snapshot VARCHAR(160) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(14, 2) NOT NULL,
    unit_hpp_snapshot NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(14, 2) NOT NULL,
    custom_inscription VARCHAR(200),           -- Tulisan ucapan di atas kue
    custom_flavor_notes TEXT,                  -- Catatan rasa/filling/tema
    reference_image_url TEXT,                  -- URL desain referensi dari pelanggan
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    payment_method VARCHAR(25) NOT NULL CHECK (payment_method IN ('qris', 'cash', 'debit', 'transfer')),
    payment_stage VARCHAR(20) NOT NULL DEFAULT 'full' CHECK (payment_stage IN ('dp', 'settlement', 'full', 'refund')),
    amount NUMERIC(14, 2) NOT NULL,
    external_reference VARCHAR(120),           -- ID transaksi QRIS / EDC Debit
    qris_payload TEXT,
    status VARCHAR(25) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'failed', 'expired')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36),
    points_delta INTEGER NOT NULL,             -- Positif (earn) / Negatif (redeem)
    reason VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 5. INDEKS PERFORMA QUERY
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_expiry ON ingredients(nearest_expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_ing_date ON inventory_logs(ingredient_id, created_at);
CREATE INDEX IF NOT EXISTS idx_production_batches_status ON production_batches(status);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_cashier ON orders(cashier_id);
CREATE INDEX IF NOT EXISTS idx_orders_pickup ON orders(pickup_scheduled_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_customer ON loyalty_transactions(customer_id);
