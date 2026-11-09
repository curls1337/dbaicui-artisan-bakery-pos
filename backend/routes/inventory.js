// ==============================================================================
// D'Bai Cui Artisan Bakery - Inventory, Recipe BOM & Kitchen KDS Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { requireAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

/**
 * GET /api/inventory/ingredients
 * Mengambil daftar stok bahan baku premium & status peringatan stok tipis / expiry
 */
router.get('/ingredients', requireAuth, requireRole(['owner', 'manager', 'cashier']), (req, res) => {
  const db = getDb();
  const data = db.ingredients.map(ing => {
    const isLow = ing.current_stock <= ing.min_stock_threshold;
    const expiryDate = new Date(ing.nearest_expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysUntilExpiry <= 20;

    return {
      ...ing,
      is_low_stock: isLow,
      is_expiring_soon: isExpiringSoon,
      days_until_expiry: daysUntilExpiry
    };
  });

  res.json({
    success: true,
    total: data.length,
    data
  });
});

/**
 * POST /api/inventory/ingredients
 * Menambah atau memperbarui data stok bahan baku (Owner / Manager only)
 */
router.post('/ingredients', requireAuth, requireRole(['owner', 'manager']), (req, res) => {
  const { name, code, unit, current_stock, min_stock_threshold, cost_per_unit, nearest_expiry_date, storage_location } = req.body;
  if (!name || !unit || current_stock === undefined) {
    return res.status(400).json({ success: false, message: 'Nama, unit, dan stok wajib diisi' });
  }

  const db = getDb();
  const newIng = {
    id: `ing-${Date.now()}`,
    code: code || `ING-GEN-${Math.floor(100 + Math.random() * 900)}`,
    name,
    unit,
    current_stock: Number(current_stock),
    min_stock_threshold: Number(min_stock_threshold || 1000),
    cost_per_unit: Number(cost_per_unit || 0.1),
    nearest_expiry_date: nearest_expiry_date || '2027-01-01',
    storage_location: storage_location || 'Dry Pantry'
  };

  db.ingredients.push(newIng);

  // Catat log penerimaan
  db.inventory_logs.unshift({
    id: `log-${Date.now()}`,
    ingredient_name: newIng.name,
    change_type: 'purchase_in',
    qty_delta: newIng.current_stock,
    unit: newIng.unit,
    notes: 'Penerimaan bahan baku baru',
    created_at: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: `Bahan baku '${newIng.name}' berhasil didaftarkan`,
    data: newIng
  });
});

/**
 * GET /api/inventory/batches
 * Mengambil antrean oven dan batch produksi dapur (KDS)
 */
router.get('/batches', requireAuth, requireRole(['owner', 'manager', 'cashier']), (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    total: db.production_batches.length,
    data: db.production_batches
  });
});

/**
 * POST /api/inventory/batches
 * Membuat jadwal batch baking baru di oven KDS
 */
router.post('/batches', requireAuth, requireRole(['owner', 'manager']), (req, res) => {
  const { recipe_id, planned_qty, oven_slot, notes } = req.body;
  const db = getDb();

  const recipe = db.recipes.find(r => r.id === recipe_id) || db.recipes[0];
  const product = db.products.find(p => p.id === recipe.product_id);

  const batchCode = `OVN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(db.production_batches.length + 1).padStart(3, '0')}`;

  const newBatch = {
    id: `bat-${Date.now()}`,
    batch_code: batchCode,
    recipe_id: recipe.id,
    product_name: product ? product.name : 'Artisan Product',
    baker_name: req.user.full_name || 'Chef Pastry',
    planned_qty: Number(planned_qty || 12),
    status: 'queued',
    oven_slot: oven_slot || 'Deck Oven #1',
    started_at: new Date().toISOString(),
    completed_at: null,
    notes: notes || 'Jadwal pemanggangan batch dapur'
  };

  db.production_batches.unshift(newBatch);

  res.status(201).json({
    success: true,
    message: `Batch ${batchCode} dijadwalkan ke antrean oven`,
    data: newBatch
  });
});

/**
 * PATCH /api/inventory/batches/:id/status
 * Update status oven: queued -> mixing -> proofing -> baking -> cooling -> completed
 * Ketika status menjadi 'completed', otomatis memotong bahan baku sesuai resep BOM
 */
router.patch('/batches/:id/status', requireAuth, requireRole(['owner', 'manager']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['queued', 'mixing', 'proofing', 'baking', 'cooling', 'completed', 'cancelled'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status batch oven tidak valid' });
  }

  const db = getDb();
  const batch = db.production_batches.find(b => b.id === id);
  if (!batch) {
    return res.status(404).json({ success: false, message: 'Batch pemanggangan tidak ditemukan' });
  }

  const prevStatus = batch.status;
  batch.status = status;

  if (status === 'completed' && prevStatus !== 'completed') {
    batch.completed_at = new Date().toISOString();

    // Auto-potong bahan baku berdasarkan formula resep BOM
    const recipe = db.recipes.find(r => r.id === batch.recipe_id);
    if (recipe && recipe.items) {
      recipe.items.forEach(item => {
        const ing = db.ingredients.find(i => i.id === item.ingredient_id);
        if (ing) {
          const factor = batch.planned_qty / (recipe.yield_qty || 1);
          const consumedQty = Math.round(item.quantity * factor);
          ing.current_stock = Math.max(0, ing.current_stock - consumedQty);

          db.inventory_logs.unshift({
            id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            ingredient_name: ing.name,
            change_type: 'production_out',
            qty_delta: -consumedQty,
            unit: ing.unit,
            notes: `Auto-deduct BOM batch ${batch.batch_code} (${batch.product_name})`,
            created_at: new Date().toISOString()
          });
        }
      });
    }

    // Tambahkan stok produk siap jual di etalase
    if (recipe) {
      const product = db.products.find(p => p.id === recipe.product_id);
      if (product) {
        product.stock_qty += batch.planned_qty;
      }
    }
  }

  res.json({
    success: true,
    message: `Status batch oven ${batch.batch_code} diubah menjadi '${status}'`,
    data: batch
  });
});

/**
 * GET /api/inventory/logs
 * Mengambil histori mutasi persediaan (FEFO audit)
 */
router.get('/logs', requireAuth, requireRole(['owner', 'manager']), (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    total: db.inventory_logs.length,
    data: db.inventory_logs
  });
});

module.exports = router;
