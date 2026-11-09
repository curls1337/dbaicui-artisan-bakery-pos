// ==============================================================================
// D'Bai Cui Artisan Bakery - POS & Orders Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { requireAuth, optionalAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

/**
 * GET /api/pos/categories
 * Daftar kategori produk artisan bakery
 */
router.get('/categories', (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    data: db.categories
  });
});

/**
 * GET /api/pos/products
 * Mengambil katalog kue dengan filter kategori / search
 */
router.get('/products', (req, res) => {
  const db = getDb();
  const { category, search } = req.query;

  let items = db.products.map(p => {
    const variants = db.product_variants.filter(v => v.product_id === p.id);
    const cat = db.categories.find(c => c.id === p.category_id);
    return {
      ...p,
      category_name: cat ? cat.name : 'Artisan Bakery',
      variants
    };
  });

  if (category && category !== 'all') {
    items = items.filter(p => p.category_id === category || p.category_name.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: items.length,
    data: items
  });
});

/**
 * POST /api/pos/products
 * Tambah produk baru dari mobile/web catalog (Owner & Manager only)
 */
router.post('/products', requireAuth, requireRole(['owner', 'manager']), (req, res) => {
  const { name, sku, category_id, base_price, calculated_hpp, stock_qty, is_custom_cake } = req.body;
  if (!name || !base_price) {
    return res.status(400).json({ success: false, message: 'Nama produk dan harga dasar wajib diisi' });
  }

  const db = getDb();
  const newProduct = {
    id: `prd-${Date.now()}`,
    category_id: category_id || 'cat-signature',
    sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    base_price: Number(base_price),
    calculated_hpp: Number(calculated_hpp || Math.round(base_price * 0.35)),
    stock_qty: Number(stock_qty || 10),
    is_custom_cake: Boolean(is_custom_cake),
    is_preorder_only: Boolean(is_custom_cake),
    prep_lead_hours: is_custom_cake ? 6 : 0,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    allergen_tags: 'gluten,dairy',
    is_available: true
  };

  db.products.unshift(newProduct);

  res.status(201).json({
    success: true,
    message: `Produk '${newProduct.name}' berhasil ditambahkan ke katalog`,
    data: newProduct
  });
});

/**
 * GET /api/pos/orders
 * Mengambil riwayat transaksi & pre-order custom cake
 */
router.get('/orders', requireAuth, (req, res) => {
  const db = getDb();
  let orders = [...db.orders];

  // Pelanggan hanya boleh melihat order miliknya
  if (req.user.role === 'customer') {
    orders = orders.filter(o =>
      (o.customer_name && o.customer_name.toLowerCase() === req.user.full_name.toLowerCase()) ||
      o.customer_phone === req.user.phone
    );
  }

  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({
    success: true,
    total: orders.length,
    data: orders
  });
});

/**
 * POST /api/pos/orders
 * Membuat pesanan POS Kasir atau Custom Cake Pre-Order
 */
router.post('/orders', requireAuth, requireRole(['owner', 'manager', 'cashier', 'customer']), (req, res) => {
  const {
    order_type = 'pos_retail',
    customer_name = 'Walk-in Guest',
    customer_phone = '',
    member_tier = 'classic',
    payment_method = 'qris',
    paid_amount,
    dp_amount = 0,
    pickup_scheduled_at = null,
    delivery_notes = '',
    items = []
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Keranjang belanja tidak boleh kosong'
    });
  }

  const db = getDb();
  let subtotal = 0;
  let totalHpp = 0;
  const enrichedItems = [];

  for (const item of items) {
    const product = db.products.find(p => p.id === item.product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: `Produk ${item.product_id} tidak ditemukan` });
    }

    const qty = Number(item.quantity || 1);
    const unitPrice = Number(item.unit_price || product.base_price);
    const itemSub = unitPrice * qty;
    const itemHpp = product.calculated_hpp * qty;

    subtotal += itemSub;
    totalHpp += itemHpp;

    // Kurangi stok produk etalase jika bukan custom pre-order
    if (!product.is_custom_cake) {
      product.stock_qty = Math.max(0, product.stock_qty - qty);
    }

    enrichedItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: qty,
      unit_price: unitPrice,
      subtotal: itemSub,
      custom_inscription: item.custom_inscription || null,
      custom_flavor_notes: item.custom_flavor_notes || null
    });
  }

  // Hitung diskon member
  const tierObj = db.member_tiers.find(t => t.code === member_tier);
  const discountRate = tierObj ? tierObj.discount_percent / 100 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const afterDiscount = subtotal - discountAmount;

  // PPN 10% (sesuai .env.example POS_TAX_RATE_PERCENT=10)
  const taxAmount = Math.round(afterDiscount * 0.10);
  const totalAmount = afterDiscount + taxAmount;

  const actualPaid = paid_amount !== undefined ? Number(paid_amount) : totalAmount;
  const paymentStatus = (order_type === 'custom_cake' && actualPaid < totalAmount && actualPaid > 0) ? 'dp_paid' : 'paid';

  const orderNumber = `DBC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(db.orders.length + 1).padStart(4, '0')}`;

  const newOrder = {
    id: `ord-${Date.now()}`,
    order_number: orderNumber,
    order_type,
    customer_name,
    customer_phone,
    status: order_type === 'pos_retail' ? 'completed' : 'confirmed',
    payment_status: paymentStatus,
    payment_method,
    subtotal_amount: subtotal,
    discount_amount: discountAmount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    dp_amount: Number(dp_amount),
    paid_amount: actualPaid,
    total_hpp_snapshot: totalHpp,
    pickup_scheduled_at,
    delivery_notes,
    created_at: new Date().toISOString(),
    items: enrichedItems
  };

  db.orders.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: `Transaksi ${orderNumber} berhasil disimpan`,
    data: newOrder
  });
});

/**
 * PATCH /api/pos/orders/:id/status
 * Mengubah status pemrosesan pesanan kue (KDS / Kasir / Manager)
 */
router.patch('/orders/:id/status', requireAuth, requireRole(['owner', 'manager', 'cashier']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'baking', 'decorating', 'ready_pickup', 'completed', 'cancelled'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid' });
  }

  const db = getDb();
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
  }

  order.status = status;

  res.json({
    success: true,
    message: `Status order ${order.order_number} diperbarui ke '${status}'`,
    data: order
  });
});

/**
 * GET /api/pos/receipt/:id
 * Format struk thermal 58mm/80mm untuk printer ESC/POS
 */
router.get('/receipt/:id', optionalAuth, (req, res) => {
  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id || o.order_number === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Struk order tidak ditemukan' });
  }

  const lines = [
    "==========================================",
    "         D'BAI CUI ARTISAN BAKERY         ",
    "  Jl. Kemang Raya No. 88, Jakarta Selatan ",
    "          Telp: (021) 719-8888            ",
    "==========================================",
    `No. Struk : ${order.order_number}`,
    `Tanggal   : ${new Date(order.created_at).toLocaleString('id-ID')}`,
    `Pelanggan : ${order.customer_name}`,
    `Metode    : ${(order.payment_method || 'QRIS').toUpperCase()}`,
    "------------------------------------------"
  ];

  order.items.forEach(i => {
    lines.push(`${i.product_name}`);
    lines.push(`  ${i.quantity} x Rp ${i.unit_price.toLocaleString('id-ID')} = Rp ${i.subtotal.toLocaleString('id-ID')}`);
    if (i.custom_inscription) {
      lines.push(`  [Ucapan: "${i.custom_inscription}"]`);
    }
  });

  lines.push("------------------------------------------");
  lines.push(`Subtotal  : Rp ${order.subtotal_amount.toLocaleString('id-ID')}`);
  if (order.discount_amount > 0) {
    lines.push(`Diskon    : -Rp ${order.discount_amount.toLocaleString('id-ID')}`);
  }
  lines.push(`PPN 10%   : Rp ${order.tax_amount.toLocaleString('id-ID')}`);
  lines.push(`TOTAL     : Rp ${order.total_amount.toLocaleString('id-ID')}`);
  lines.push(`Dibayar   : Rp ${order.paid_amount.toLocaleString('id-ID')}`);
  lines.push("==========================================");
  lines.push("  Terima kasih telah menikmati karya      ");
  lines.push("      Artisan Patisserie kami!            ");
  lines.push("==========================================");

  res.json({
    success: true,
    order_number: order.order_number,
    printer_width: '80mm',
    raw_text: lines.join('\n')
  });
});

module.exports = router;
