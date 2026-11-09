// ==============================================================================
// D'Bai Cui Artisan Bakery & Cake Management System
// Express REST API Entry Point
// ==============================================================================

require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');

const authRoutes = require('./routes/auth');
const posRoutes = require('./routes/pos');
const inventoryRoutes = require('./routes/inventory');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3100;

// Inisialisasi database & seed awal
initDatabase();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));

// Request logger ringkas
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: "D'Bai Cui Artisan Bakery REST API",
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Static Showcase Fallback (melayani index.html dari root proyek)
app.use(express.static(path.join(__dirname, '..')));

// Global 404 Handler untuk /api/*
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Endpoint API '${req.originalUrl}' tidak ditemukan`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Terjadi kesalahan internal pada server'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=========================================================`);
    console.log(`  D'Bai Cui Artisan Bakery REST API berjalan di port ${PORT}`);
    console.log(`  URL Lokal: http://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================================`);
  });
}

module.exports = app;
