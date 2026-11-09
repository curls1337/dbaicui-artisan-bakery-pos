// ==============================================================================
// D'Bai Cui Artisan Bakery - Financial Analytics & P&L Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { requireAuth } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

/**
 * GET /api/analytics/dashboard
 * Ringkasan Omzet, Total HPP, Laba Kotor, & Grafik Penjualan (Owner & Manager)
 */
router.get('/dashboard', requireAuth, requireRole(['owner', 'manager']), (req, res) => {
  const db = getDb();

  const totalOmzet = db.orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalHpp = db.orders.reduce((sum, o) => sum + (o.total_hpp_snapshot || 0), 0);
  const grossProfit = totalOmzet - totalHpp;
  const marginPercent = totalOmzet > 0 ? ((grossProfit / totalOmzet) * 100).toFixed(1) : 0;

  const totalTransactions = db.orders.length;
  const activeOvenBatches = db.production_batches.filter(b => ['baking', 'proofing', 'mixing'].includes(b.status)).length;
  const lowStockCount = db.ingredients.filter(i => i.current_stock <= i.min_stock_threshold).length;

  res.json({
    success: true,
    data: {
      metrics: {
        total_omzet: totalOmzet,
        total_hpp: totalHpp,
        gross_profit: grossProfit,
        margin_percent: Number(marginPercent),
        total_transactions: totalTransactions,
        active_oven_batches: activeOvenBatches,
        low_stock_items: lowStockCount
      },
      chart_sales: [
        { day: 'Sen', omzet: 2450000, hpp: 850000 },
        { day: 'Sel', omzet: 2890000, hpp: 980000 },
        { day: 'Rab', omzet: 3120000, hpp: 1050000 },
        { day: 'Kam', omzet: 3450000, hpp: 1190000 },
        { day: 'Jum', omzet: 4850000, hpp: 1650000 },
        { day: 'Sab', omzet: 7650000, hpp: 2600000 },
        { day: 'Min', omzet: 8920000, hpp: 3050000 }
      ],
      recent_orders: db.orders.slice(0, 5)
    }
  });
});

module.exports = router;
