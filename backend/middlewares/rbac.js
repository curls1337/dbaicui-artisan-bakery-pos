// ==============================================================================
// D'Bai Cui Artisan Bakery - Role-Based Access Control (RBAC) Middleware
// ==============================================================================

/**
 * Memastikan user memiliki salah satu dari role yang diizinkan
 * @param {string[]|string} allowedRoles - Contoh: ['owner', 'manager']
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Akses ditolak: Identitas pengguna tidak ditemukan'
      });
    }

    const userRole = req.user.role.toLowerCase();
    const hasPermission = roles.map(r => r.toLowerCase()).includes(userRole);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'ROLE_UNAUTHORIZED',
        message: `Akses ditolak: Role '${req.user.role}' tidak memiliki izin untuk fitur ini. Izin dibutuhkan: [${roles.join(', ')}]`
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
