import 'package:flutter/material.dart';
import '../models/bakery_state.dart';

class HomeScreen extends StatelessWidget {
  final BakeryAppState state;
  final Function(int) onNavigateTab;

  const HomeScreen({
    super.key,
    required this.state,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = state.isDarkTheme;
    final bgCol = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardCol = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textCol = isDark ? Colors.white : const Color(0xFF0F172A);
    final role = state.activeRole;

    return Scaffold(
      backgroundColor: bgCol,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top App Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 22,
                        backgroundColor: const Color(0xFFD97706),
                        child: Text(
                          role.userName.substring(0, 1),
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Halo, ${role.userName.split(' ')[0]} 👋",
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textCol),
                          ),
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD97706).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              role.label,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFFD97706)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Stack(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: cardCol,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        child: Icon(Icons.notifications_none_rounded, color: textCol, size: 22),
                      ),
                      Positioned(
                        right: 10,
                        top: 10,
                        child: Container(
                          width: 9,
                          height: 9,
                          decoration: const BoxDecoration(
                            color: Color(0xFFEF4444),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Hero Summary Card (Warm Amber Gradient)
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFB45309), Color(0xFF78350F)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFB45309).withOpacity(0.35),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          role == UserRole.customer ? "SALDO POIN LOYALTY" : "TOTAL OMZET HARI INI",
                          style: const TextStyle(
                            color: Color(0xFFFDE68A),
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.25),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: const Text(
                            "LIVE SHIFT A",
                            style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      role == UserRole.customer ? "1.850 Pts (Gold Tier)" : state.formatRupiah(8920000),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.arrow_upward_rounded, size: 14, color: Color(0xFF34D399)),
                        const SizedBox(width: 4),
                        Text(
                          role == UserRole.customer ? "+160 Pts dari order terakhir" : "+18.4% vs kemarin (Margin 68.2%)",
                          style: const TextStyle(color: Color(0xFFD1FAE5), fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Quick Actions (4 Buttons)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildQuickAction(Icons.point_of_sale_rounded, "POS Kasir", () => onNavigateTab(1)),
                        _buildQuickAction(Icons.cake_rounded, "Katalog", () => onNavigateTab(1)),
                        _buildQuickAction(Icons.microwave_rounded, "Oven KDS", () => onNavigateTab(2)),
                        _buildQuickAction(Icons.receipt_long_rounded, "Struk QR", () => onNavigateTab(2)),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // Bento KPI Grid (2x2)
              Row(
                children: [
                  Expanded(
                    child: _buildBentoCard(
                      title: "Transaksi POS",
                      value: "42 Struk",
                      delta: "+12.5%",
                      icon: Icons.receipt_rounded,
                      accent: const Color(0xFF3B82F6),
                      cardCol: cardCol,
                      textCol: textCol,
                      isDark: isDark,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildBentoCard(
                      title: "Laba Kotor",
                      value: "Rp 6.08 Jt",
                      delta: "+14.2%",
                      icon: Icons.trending_up_rounded,
                      accent: const Color(0xFF10B981),
                      cardCol: cardCol,
                      textCol: textCol,
                      isDark: isDark,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildBentoCard(
                      title: "Antrean Oven",
                      value: "3 Batch",
                      delta: "2 Aktif",
                      icon: Icons.outdoor_grill_rounded,
                      accent: const Color(0xFFF59E0B),
                      cardCol: cardCol,
                      textCol: textCol,
                      isDark: isDark,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildBentoCard(
                      title: "Stok Menipis",
                      value: "1 Bahan",
                      delta: "Butter Cek",
                      icon: Icons.inventory_2_rounded,
                      accent: const Color(0xFFEF4444),
                      cardCol: cardCol,
                      textCol: textCol,
                      isDark: isDark,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Recent Activity Feed Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Pesanan & Transaksi Terkini",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textCol),
                  ),
                  GestureDetector(
                    onTap: () => onNavigateTab(1),
                    child: const Text(
                      "Lihat Semua",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFFD97706)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Order Items List
              ...state.orders.map((o) => _buildOrderTile(o, cardCol, textCol, isDark, state)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.18),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildBentoCard({
    required String title,
    required String value,
    required String delta,
    required IconData icon,
    required Color accent,
    required Color cardCol,
    required Color textCol,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardCol,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: accent.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 18, color: accent),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  delta,
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: textCol),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderTile(BakeryOrder o, Color cardCol, Color textCol, bool isDark, BakeryAppState state) {
    Color statusCol = const Color(0xFF10B981);
    if (o.status == 'baking') statusCol = const Color(0xFFF59E0B);
    if (o.status == 'decorating') statusCol = const Color(0xFF8B5CF6);

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardCol,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: statusCol.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  o.isCustomCake ? Icons.cake_rounded : Icons.bakery_dining_rounded,
                  color: statusCol,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    o.customerName,
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textCol),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    "${o.orderNumber} • ${o.paymentMethod}",
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                state.formatRupiah(o.totalAmount),
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: textCol),
              ),
              const SizedBox(height: 3),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: statusCol.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  o.status.toUpperCase(),
                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: statusCol),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
