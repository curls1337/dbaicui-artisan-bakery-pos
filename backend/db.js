// ==============================================================================
// D'Bai Cui Artisan Bakery - Database Layer & Repository Adapter
// ==============================================================================

const fs = require('fs');
const path = require('path');

// In-memory data store hydrated with seed data for high performance & zero-setup dev
let databaseInstance = null;

// Initial state hydrated from schema & seed logic
const store = {
  roles: [
    { id: 'r-owner', code: 'owner', name: 'Owner / Executive' },
    { id: 'r-manager', code: 'manager', name: 'Store & Kitchen Manager' },
    { id: 'r-cashier', code: 'cashier', name: 'Cashier / Front-Desk' },
    { id: 'r-customer', code: 'customer', name: 'VIP Customer' }
  ],
  member_tiers: [
    { id: 'tier-classic', code: 'classic', name: 'Classic Member', min_points: 0, discount_percent: 0, multiplier: 1.0 },
    { id: 'tier-silver', code: 'silver', name: 'Silver Artisan', min_points: 500, discount_percent: 5, multiplier: 1.25 },
    { id: 'tier-gold', code: 'gold', name: 'Gold Patisserie', min_points: 1500, discount_percent: 10, multiplier: 1.5 },
    { id: 'tier-platinum', code: 'platinum', name: 'Platinum VVIP', min_points: 5000, discount_percent: 15, multiplier: 2.0 }
  ],
  users: [
    {
      id: 'usr-owner-01',
      role: 'owner',
      member_tier_id: null,
      full_name: 'Hendra Wijaya, B.B.A',
      email: 'owner@dbaicui.id',
      phone: '081122334455',
      password: 'Password123!',
      pin: '888888',
      loyalty_points: 0,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      is_active: true
    },
    {
      id: 'usr-mgr-01',
      role: 'manager',
      member_tier_id: null,
      full_name: 'Chef Pierre Sutanto',
      email: 'manager@dbaicui.id',
      phone: '081299887766',
      password: 'Password123!',
      pin: '123456',
      loyalty_points: 0,
      avatar_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150',
      is_active: true
    },
    {
      id: 'usr-csh-01',
      role: 'cashier',
      member_tier_id: null,
      full_name: 'Siti Nurhaliza (Kasir Shift A)',
      email: 'kasir@dbaicui.id',
      phone: '081377665544',
      password: 'Password123!',
      pin: '112233',
      loyalty_points: 0,
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      is_active: true
    },
    {
      id: 'usr-vip-01',
      role: 'customer',
      member_tier_id: 'tier-gold',
      full_name: 'Nadia Salsabila',
      email: 'nadia@vip.dbaicui.id',
      phone: '081234567890',
      password: 'Password123!',
      pin: null,
      loyalty_points: 1850,
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      is_active: true
    },
    {
      id: 'usr-vip-02',
      role: 'customer',
      member_tier_id: 'tier-platinum',
      full_name: 'Budi Hartono',
      email: 'budi@vip.dbaicui.id',
      phone: '081987654321',
      password: 'Password123!',
      pin: null,
      loyalty_points: 6420,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: true
    }
  ],
  categories: [
    { id: 'cat-croissant', slug: 'viennoiserie', name: 'Viennoiserie & Croissant' },
    { id: 'cat-sourdough', slug: 'artisan-bread', name: 'Artisan Sourdough & Loaf' },
    { id: 'cat-signature', slug: 'signature-cake', name: 'Signature Whole Cake' },
    { id: 'cat-custom', slug: 'custom-cake', name: 'Bespoke Custom Cake' },
    { id: 'cat-beverage', slug: 'specialty-coffee', name: 'Artisan Coffee & Drinks' }
  ],
  products: [
    {
      id: 'prd-croissant-classic',
      category_id: 'cat-croissant',
      sku: 'VNS-CRO-01',
      name: 'French Butter Croissant (Isigny Lamination)',
      slug: 'french-butter-croissant',
      base_price: 32000,
      calculated_hpp: 11800,
      stock_qty: 28,
      is_custom_cake: false,
      is_preorder_only: false,
      prep_lead_hours: 0,
      image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
      allergen_tags: 'gluten,dairy',
      is_available: true
    },
    {
      id: 'prd-pain-choc',
      category_id: 'cat-croissant',
      sku: 'VNS-PAC-01',
      name: 'Pain au Chocolat Double Valrhona',
      slug: 'pain-au-chocolat',
      base_price: 38000,
      calculated_hpp: 14500,
      stock_qty: 19,
      is_custom_cake: false,
      is_preorder_only: false,
      prep_lead_hours: 0,
      image_url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400',
      allergen_tags: 'gluten,dairy',
      is_available: true
    },
    {
      id: 'prd-sourdough-country',
      category_id: 'cat-sourdough',
      sku: 'BRD-SRD-01',
      name: 'Artisan Country Sourdough Batard',
      slug: 'country-sourdough-batard',
      base_price: 55000,
      calculated_hpp: 16200,
      stock_qty: 14,
      is_custom_cake: false,
      is_preorder_only: false,
      prep_lead_hours: 0,
      image_url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400',
      allergen_tags: 'gluten',
      is_available: true
    },
    {
      id: 'prd-basque-cheesecake',
      category_id: 'cat-signature',
      sku: 'CAK-BSQ-01',
      name: 'San Sebastian Basque Burnt Cheesecake (D16)',
      slug: 'basque-burnt-cheesecake',
      base_price: 285000,
      calculated_hpp: 89500,
      stock_qty: 8,
      is_custom_cake: false,
      is_preorder_only: false,
      prep_lead_hours: 0,
      image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      allergen_tags: 'dairy,eggs',
      is_available: true
    },
    {
      id: 'prd-custom-bday-cake',
      category_id: 'cat-custom',
      sku: 'CAK-CUS-01',
      name: 'Bespoke Celebration Cake (Custom Decor & Piping)',
      slug: 'bespoke-celebration-cake',
      base_price: 450000,
      calculated_hpp: 142000,
      stock_qty: 99,
      is_custom_cake: true,
      is_preorder_only: true,
      prep_lead_hours: 6,
      image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=400',
      allergen_tags: 'gluten,dairy,eggs',
      is_available: true
    },
    {
      id: 'prd-latte-single-origin',
      category_id: 'cat-beverage',
      sku: 'BEV-LAT-01',
      name: 'Artisan Cafe Latte (Single Origin Flores)',
      slug: 'artisan-cafe-latte',
      base_price: 38000,
      calculated_hpp: 9200,
      stock_qty: 50,
      is_custom_cake: false,
      is_preorder_only: false,
      prep_lead_hours: 0,
      image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400',
      allergen_tags: 'dairy',
      is_available: true
    }
  ],
  product_variants: [
    { id: 'var-cro-reg', product_id: 'prd-croissant-classic', sku_suffix: 'REG', name: 'Standard Size (80g)', price_delta: 0 },
    { id: 'var-cro-mini', product_id: 'prd-croissant-classic', sku_suffix: 'MINI', name: 'Mini Box (4 pcs @35g)', price_delta: 28000 },
    { id: 'var-bsq-d16', product_id: 'prd-basque-cheesecake', sku_suffix: 'D16', name: 'Diameter 16cm (4-6 Porsi)', price_delta: 0 },
    { id: 'var-bsq-d20', product_id: 'prd-basque-cheesecake', sku_suffix: 'D20', name: 'Diameter 20cm (8-10 Porsi)', price_delta: 140000 },
    { id: 'var-cus-d18', product_id: 'prd-custom-bday-cake', sku_suffix: 'D18', name: 'Diameter 18cm Standard Tier', price_delta: 0 },
    { id: 'var-cus-d22', product_id: 'prd-custom-bday-cake', sku_suffix: 'D22', name: 'Diameter 22cm Grand Tier', price_delta: 200000 }
  ],
  ingredients: [
    {
      id: 'ing-butter-anchor',
      code: 'ING-BTR-01',
      name: 'Anchor Unsalted Butter Sheet 82%',
      unit: 'gram',
      current_stock: 24500,
      min_stock_threshold: 5000,
      cost_per_unit: 0.175,
      nearest_expiry_date: '2026-12-15',
      storage_location: 'Chiller A (4°C)'
    },
    {
      id: 'ing-flour-komachi',
      code: 'ING-FLR-01',
      name: 'Tepung Terigu Komachi Premium (Protein Tinggi)',
      unit: 'gram',
      current_stock: 95000,
      min_stock_threshold: 20000,
      cost_per_unit: 0.024,
      nearest_expiry_date: '2027-04-30',
      storage_location: 'Dry Pantry Rack 1'
    },
    {
      id: 'ing-choc-valrhona',
      code: 'ING-CHC-01',
      name: 'Valrhona Guanaja Dark Chocolate 70%',
      unit: 'gram',
      current_stock: 8200,
      min_stock_threshold: 2500,
      cost_per_unit: 0.42,
      nearest_expiry_date: '2027-01-20',
      storage_location: 'Dry Pantry Dark Room'
    },
    {
      id: 'ing-cheese-ellevire',
      code: 'ING-CHS-01',
      name: 'Elle & Vire Cream Cheese French Origin',
      unit: 'gram',
      current_stock: 14000,
      min_stock_threshold: 4000,
      cost_per_unit: 0.19,
      nearest_expiry_date: '2026-11-28',
      storage_location: 'Chiller B (3°C)'
    },
    {
      id: 'ing-egg-pasteurized',
      code: 'ING-EGG-01',
      name: 'Telur Omega Pasteurisasi Fresh',
      unit: 'pcs',
      current_stock: 320,
      min_stock_threshold: 80,
      cost_per_unit: 2800,
      nearest_expiry_date: '2026-11-24',
      storage_location: 'Chiller Eggs Rack'
    },
    {
      id: 'ing-cream-anchor',
      code: 'ING-CRM-01',
      name: 'Anchor Whipping Cream 35.5% Dairy',
      unit: 'ml',
      current_stock: 18500,
      min_stock_threshold: 4000,
      cost_per_unit: 0.085,
      nearest_expiry_date: '2026-12-05',
      storage_location: 'Chiller A (4°C)'
    }
  ],
  recipes: [
    {
      id: 'rcp-cro-01',
      product_id: 'prd-croissant-classic',
      yield_qty: 12,
      prep_minutes: 180,
      bake_minutes: 22,
      oven_temp_celsius: 195,
      items: [
        { ingredient_id: 'ing-flour-komachi', quantity: 1000 },
        { ingredient_id: 'ing-butter-anchor', quantity: 520 }
      ]
    },
    {
      id: 'rcp-bsq-01',
      product_id: 'prd-basque-cheesecake',
      yield_qty: 2,
      prep_minutes: 40,
      bake_minutes: 28,
      oven_temp_celsius: 230,
      items: [
        { ingredient_id: 'ing-cheese-ellevire', quantity: 860 },
        { ingredient_id: 'ing-cream-anchor', quantity: 480 },
        { ingredient_id: 'ing-egg-pasteurized', quantity: 6 }
      ]
    },
    {
      id: 'rcp-cus-01',
      product_id: 'prd-custom-bday-cake',
      yield_qty: 1,
      prep_minutes: 90,
      bake_minutes: 35,
      oven_temp_celsius: 175,
      items: [
        { ingredient_id: 'ing-flour-komachi', quantity: 350 },
        { ingredient_id: 'ing-butter-anchor', quantity: 250 },
        { ingredient_id: 'ing-choc-valrhona', quantity: 180 },
        { ingredient_id: 'ing-egg-pasteurized', quantity: 5 }
      ]
    }
  ],
  production_batches: [
    {
      id: 'bat-001',
      batch_code: 'OVN-20261109-001',
      recipe_id: 'rcp-cro-01',
      product_name: 'French Butter Croissant',
      baker_name: 'Chef Pierre Sutanto',
      planned_qty: 24,
      status: 'completed',
      oven_slot: 'Deck Oven #1 (Left)',
      started_at: '2026-11-09T05:30:00Z',
      completed_at: '2026-11-09T06:15:00Z'
    },
    {
      id: 'bat-002',
      batch_code: 'OVN-20261109-002',
      recipe_id: 'rcp-bsq-01',
      product_name: 'San Sebastian Basque Cheesecake',
      baker_name: 'Chef Pierre Sutanto',
      planned_qty: 4,
      status: 'baking',
      oven_slot: 'Deck Oven #2 (Middle)',
      started_at: '2026-11-09T09:45:00Z',
      completed_at: null
    },
    {
      id: 'bat-003',
      batch_code: 'OVN-20261109-003',
      recipe_id: 'rcp-cus-01',
      product_name: 'Bespoke Celebration Cake',
      baker_name: 'Chef Pierre Sutanto',
      planned_qty: 2,
      status: 'proofing',
      oven_slot: 'Convection Oven #3',
      started_at: '2026-11-09T10:30:00Z',
      completed_at: null
    }
  ],
  orders: [
    {
      id: 'ord-pos-001',
      order_number: 'DBC-20261109-0001',
      order_type: 'pos_retail',
      customer_name: 'Nadia Salsabila',
      customer_phone: '081234567890',
      status: 'completed',
      payment_status: 'paid',
      payment_method: 'qris',
      subtotal_amount: 108000,
      discount_amount: 10800,
      tax_amount: 9720,
      total_amount: 106920,
      paid_amount: 106920,
      total_hpp_snapshot: 38100,
      pickup_scheduled_at: null,
      created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
      items: [
        { product_name: 'French Butter Croissant', quantity: 2, unit_price: 32000, subtotal: 64000 },
        { product_name: 'Artisan Cafe Latte (Flores)', quantity: 1, unit_price: 38000, subtotal: 38000 }
      ]
    },
    {
      id: 'ord-pos-002',
      order_number: 'DBC-20261109-0002',
      order_type: 'pos_retail',
      customer_name: 'Walk-in Guest #02',
      customer_phone: '081399998888',
      status: 'completed',
      payment_status: 'paid',
      payment_method: 'cash',
      subtotal_amount: 64000,
      discount_amount: 0,
      tax_amount: 6400,
      total_amount: 70400,
      paid_amount: 100000,
      total_hpp_snapshot: 23600,
      pickup_scheduled_at: null,
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      items: [
        { product_name: 'French Butter Croissant', quantity: 2, unit_price: 32000, subtotal: 64000 }
      ]
    },
    {
      id: 'ord-cus-003',
      order_number: 'DBC-20261109-0003',
      order_type: 'custom_cake',
      customer_name: 'Budi Hartono',
      customer_phone: '081987654321',
      status: 'decorating',
      payment_status: 'paid',
      payment_method: 'debit',
      subtotal_amount: 650000,
      discount_amount: 97500,
      tax_amount: 55250,
      total_amount: 607750,
      paid_amount: 607750,
      total_hpp_snapshot: 195000,
      pickup_scheduled_at: new Date(Date.now() + 5 * 3600000).toISOString(),
      delivery_notes: 'Self-pickup store, siapkan candle angka 50 emas',
      created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
      items: [
        {
          product_name: 'Bespoke Celebration Cake (D22)',
          quantity: 1,
          unit_price: 650000,
          subtotal: 650000,
          custom_inscription: 'Happy 50th Golden Jubilee, Bapak Hartono tercinta!',
          custom_flavor_notes: 'Dark chocolate moist sponge, rum non-alkohol, gold flakes'
        }
      ]
    },
    {
      id: 'ord-pre-004',
      order_number: 'DBC-20261109-0004',
      order_type: 'custom_cake',
      customer_name: 'Nadia Salsabila',
      customer_phone: '081234567890',
      status: 'baking',
      payment_status: 'dp_paid',
      payment_method: 'qris',
      subtotal_amount: 450000,
      discount_amount: 45000,
      tax_amount: 40500,
      total_amount: 445500,
      paid_amount: 250000,
      total_hpp_snapshot: 142000,
      pickup_scheduled_at: new Date(Date.now() + 24 * 3600000).toISOString(),
      delivery_notes: 'Packaging kotak akrilik transparan pita gold',
      created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
      items: [
        {
          product_name: 'Bespoke Celebration Cake (D18)',
          quantity: 1,
          unit_price: 450000,
          subtotal: 450000,
          custom_inscription: 'Happy Sweet 17 Cherie Nadia! Love, Mom & Dad',
          custom_flavor_notes: 'Strawberry shortcake fraisier sponge, fresh Hokkaido cream'
        }
      ]
    }
  ],
  inventory_logs: [
    {
      id: 'log-01',
      ingredient_name: 'Anchor Unsalted Butter Sheet 82%',
      change_type: 'production_out',
      qty_delta: -1040,
      unit: 'gram',
      notes: 'Konsumsi 2 batch croissant pagi (bat-001)',
      created_at: '2026-11-09T05:35:00Z'
    },
    {
      id: 'log-02',
      ingredient_name: 'Elle & Vire Cream Cheese French',
      change_type: 'production_out',
      qty_delta: -1720,
      unit: 'gram',
      notes: 'Baking 4 loyang basque burnt cheesecake (bat-002)',
      created_at: '2026-11-09T09:46:00Z'
    }
  ]
};

function getDb() {
  return store;
}

function initDatabase() {
  console.log('[DB] Inisialisasi Database D\'Bai Cui Artisan Bakery Sukses.');
  console.log(`[DB] Berhasil memuat: ${store.users.length} users, ${store.products.length} products, ${store.ingredients.length} ingredients.`);
  return true;
}

module.exports = {
  getDb,
  initDatabase,
  store
};
