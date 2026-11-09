// ==============================================================================
// D'Bai Cui Artisan Bakery - Authentication Middleware
// ==============================================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dbaicui_super_artisan_secret_key_2026';

/**
 * Middleware untuk memvalidasi JWT Bearer token pada header Authorization
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Token autentikasi Bearer wajib disertakan pada header Authorization'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, email, full_name, auth_mode }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token telah kedaluwarsa atau tidak valid. Silakan login kembali.'
    });
  }
}

/**
 * Middleware autentikasi opsional (mis. pengunjung guest vs customer login)
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET
};
