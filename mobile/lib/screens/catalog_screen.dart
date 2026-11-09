import 'package:flutter/material.dart';
import '../models/bakery_state.dart';
import '../widgets/bottom_sheet_add_product.dart';

class CatalogScreen extends StatefulWidget {
  final BakeryAppState state;

  const CatalogScreen({super.key, required this.state});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  String _selectedCategory = 'Semua';
  String _searchQuery = '';

  final List<String> _filters = [
    'Semua',
    'Viennoiserie',
    'Sourdough',
    'Whole Cake',
    'Custom Cake',
    'Coffee'
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = widget.state.isDarkTheme;
    final bgCol = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardCol = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textCol = isDark ? Colors.white : const Color(0xFF0F172A);

    final filtered = widget.state.products.where((p) {
      final matchCat = _selectedCategory == 'Semua' || p.category == _selectedCategory;
      final matchSearch = p.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).toList();

    return Scaffold(
      backgroundColor: bgCol,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFD97706),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text("Tambah Menu", style: TextStyle(fontWeight: FontWeight.bold)),
        onPressed: () {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
            builder: (_) => AddProductBottomSheet(state: widget.state),
          );
        },
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Katalog Artisan & Etalase",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textCol),
                  ),
                  const SizedBox(height: 12),
                  // Search Bar
                  Container(
                    decoration: BoxDecoration(
                      color: cardCol,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
                      ),
                    ),
                    child: TextField(
                      style: TextStyle(color: textCol, fontSize: 14),
                      onChanged: (v) => setState(() => _searchQuery = v),
                      decoration: InputDecoration(
                        hintText: "Cari croissant, sourdough, atau kue custom...",
                        hintStyle: TextStyle(
                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          fontSize: 13,
                        ),
                        prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFFD97706)),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Horizontal Filter Chips
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _filters.length,
                itemBuilder: (ctx, i) {
                  final cat = _filters[i];
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      selectedColor: const Color(0xFFD97706),
                      backgroundColor: cardCol,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                        color: isSelected ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                      ),
                      onSelected: (_) => setState(() => _selectedCategory = cat),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 8),

            // Products Grid
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Text(
                        "Tidak ada produk ditemukan",
                        style: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.76,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: filtered.length,
                      itemBuilder: (ctx, i) {
                        final p = filtered[i];
                        return _buildProductCard(p, cardCol, textCol, isDark);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductCard(BakeryProduct p, Color cardCol, Color textCol, bool isDark) {
    return Container(
      decoration: BoxDecoration(
        color: cardCol,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Visual Header
          Container(
            height: 100,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFFD97706).withOpacity(0.3),
                  const Color(0xFFB45309).withOpacity(0.15),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Stack(
              children: [
                Center(
                  child: Icon(
                    p.isCustomCake ? Icons.cake_rounded : Icons.bakery_dining_rounded,
                    size: 48,
                    color: const Color(0xFFD97706),
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD97706),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      p.badge,
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 6,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      "Stok: ${p.stock}",
                      style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  p.sku,
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFD97706)),
                ),
                const SizedBox(height: 2),
                Text(
                  p.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textCol),
                ),
                const SizedBox(height: 6),
                Text(
                  widget.state.formatRupiah(p.price),
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: textCol),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
