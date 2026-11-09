// ==============================================================================
// D'Bai Cui Artisan Bakery - Auth Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const { requireAuth, JWT_SECRET } = require('../middlewares/auth');

/**
 * POST /api/auth/login
 * Login standar via Email & Password
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_CREDENTIALS',
      message: 'Email dan password wajib diisi'
    });
  }

  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Email atau kata sandi tidak cocok'
    });
  }

  if (!user.is_active) {
    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_INACTIVE',
      message: 'Akun Anda dinonaktifkan. Hubungi Store Manager.'
    });
  }

  const tokenPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
    full_name: user.full_name,
    member_tier_id: user.member_tier_id,
    auth_mode: 'password'
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

  // Cari info tier jika customer
  let tierInfo = null;
  if (user.member_tier_id) {
    tierInfo = db.member_tiers.find(t => t.id === user.member_tier_id);
  }

  return res.json({
    success: true,
    message: `Selamat datang, ${user.full_name}!`,
    token,
    user: {
      id: user.id,
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      loyalty_points: user.loyalty_points,
      avatar_url: user.avatar_url,
      tier: tierInfo
    }
  });
});

/**
 * POST /api/auth/pin-login
 * Quick PIN Login untuk Kasir POS Terminal & Kitchen Head (6 Digit)
 */
router.post('/pin-login', (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_PIN',
      message: '6-digit PIN Terminal wajib diisi'
    });
  }

  const db = getDb();
  const user = db.users.find(u => u.pin === String(pin).trim());

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_PIN',
      message: 'PIN kasir tidak dikenali atau salah'
    });
  }

  const tokenPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
    full_name: user.full_name,
    member_tier_id: null,
    auth_mode: 'pin'
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '12h' });

  return res.json({
    success: true,
    message: `Terminal Kasir terbuka untuk: ${user.full_name} (${user.role.toUpperCase()})`,
    token,
    user: {
      id: user.id,
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      avatar_url: user.avatar_url
    }
  });
});

/**
 * GET /api/auth/me
 * Mengambil profil sesi user aktif
 */
router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
  }

  let tierInfo = null;
  if (user.member_tier_id) {
    tierInfo = db.member_tiers.find(t => t.id === user.member_tier_id);
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      loyalty_points: user.loyalty_points,
      avatar_url: user.avatar_url,
      tier: tierInfo
    }
  });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Sesi berhasil diakhiri'
  });
});

module.exports = router;
