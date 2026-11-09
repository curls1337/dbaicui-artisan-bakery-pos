import 'package:flutter/material.dart';
import '../models/bakery_state.dart';

class OvenScreen extends StatelessWidget {
  final BakeryAppState state;

  const OvenScreen({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
    final isDark = state.isDarkTheme;
    final bgCol = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardCol = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textCol = isDark ? Colors.white : const Color(0xFF0F172A);

    return Scaffold(
      backgroundColor: bgCol,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Kitchen & Oven KDS",
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textCol),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "Antrean Pemanggangan 3 Deck Oven",
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.wifi_tethering_rounded, size: 14, color: Color(0xFF10B981)),
                        SizedBox(width: 4),
                        Text(
                          "OVEN SINKRON",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // 3 Status Summary Pills
              Row(
                children: [
                  _buildSummaryPill("1 Selesai", const Color(0xFF10B981), cardCol, isDark),
                  const SizedBox(width: 8),
                  _buildSummaryPill("1 Sedang Baking", const Color(0xFFF59E0B), cardCol, isDark),
                  const SizedBox(width: 8),
                  _buildSummaryPill("1 Proofing", const Color(0xFF3B82F6), cardCol, isDark),
                ],
              ),

              const SizedBox(height: 20),

              Text(
                "Daftar Batch Loyang Aktif (Ketuk untuk ganti status):",
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textCol),
              ),
              const SizedBox(height: 12),

              ...state.ovenBatches.map((batch) {
                Color statusCol = const Color(0xFF10B981);
                if (batch.status == 'baking') statusCol = const Color(0xFFF59E0B);
                if (batch.status == 'proofing') statusCol = const Color(0xFF3B82F6);
                if (batch.status == 'mixing') statusCol = const Color(0xFF8B5CF6);

                return InkWell(
                  onTap: () => state.cycleBatchStatus(batch),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: cardCol,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: statusCol.withOpacity(0.4),
                        width: 1.5,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: statusCol.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    batch.batchCode,
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: statusCol),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  batch.ovenSlot,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: statusCol,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Text(
                                batch.status.toUpperCase(),
                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          batch.productName,
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textCol),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(Icons.thermostat_rounded, size: 16, color: statusCol),
                            const SizedBox(width: 4),
                            Text(
                              "${batch.tempCelsius}°C",
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: textCol),
                            ),
                            const SizedBox(width: 16),
                            Icon(Icons.layers_rounded, size: 16, color: isDark ? Colors.white60 : Colors.black54),
                            const SizedBox(width: 4),
                            Text(
                              "Rencana: ${batch.qty} Pcs",
                              style: TextStyle(
                                fontSize: 13,
                                color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: 16),

              // BOM Inventory notice
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFD97706).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFD97706).withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.auto_mode_rounded, color: Color(0xFFD97706), size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        "Auto-BOM Deduction aktif: Saat status batch diubah ke 'COMPLETED', stok bahan mentah otomatis dipotong sesuai gramasi resep.",
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFFD97706)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryPill(String text, Color accent, Color cardCol, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: cardCol,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: accent.withOpacity(0.4)),
        ),
        child: Center(
          child: Text(
            text,
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: accent),
          ),
        ),
      ),
    );
  }
}
