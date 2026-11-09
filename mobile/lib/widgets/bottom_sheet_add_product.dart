import 'package:flutter/material.dart';
import '../models/bakery_state.dart';

class AddProductBottomSheet extends StatefulWidget {
  final BakeryAppState state;

  const AddProductBottomSheet({super.key, required this.state});

  @override
  State<AddProductBottomSheet> createState() => _AddProductBottomSheetState();
}

class _AddProductBottomSheetState extends State<AddProductBottomSheet> {
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _stockController = TextEditingController(text: '15');
  String _selectedCategory = 'Viennoiserie';
  bool _isCustomCake = false;

  final List<String> _categories = [
    'Viennoiserie',
    'Sourdough',
    'Whole Cake',
    'Custom Cake',
    'Coffee',
  ];

  void _saveProduct() {
    final name = _nameController.text.trim();
    final price = int.tryParse(_priceController.text.trim()) ?? 45000;
    final stock = int.tryParse(_stockController.text.trim()) ?? 15;

    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama kue/roti wajib diisi')),
      );
      return;
    }

    final newProduct = BakeryProduct(
      id: 'p-${DateTime.now().millisecondsSinceEpoch}',
      sku: 'ART-${DateTime.now().millisecond}',
      name: name,
      category: _selectedCategory,
      price: price,
      hpp: (price * 0.35).round(),
      stock: stock,
      isCustomCake: _isCustomCake,
      badge: 'New Release',
    );

    widget.state.addProduct(newProduct);
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Text("'$name' berhasil ditambahkan ke katalog!"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.state.isDarkTheme;
    final sheetCol = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textCol = isDark ? Colors.white : const Color(0xFF0F172A);
    final fieldBg = isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9);

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: sheetCol,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                "Tambah Menu Kue / Roti Baru",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textCol),
              ),
              const SizedBox(height: 16),

              TextField(
                controller: _nameController,
                style: TextStyle(color: textCol),
                decoration: InputDecoration(
                  labelText: "Nama Produk Artisan",
                  hintText: "mis. Kouign-Amann Caramel",
                  filled: true,
                  fillColor: fieldBg,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _priceController,
                      keyboardType: TextInputType.number,
                      style: TextStyle(color: textCol),
                      decoration: InputDecoration(
                        labelText: "Harga Jual (Rp)",
                        hintText: "45000",
                        filled: true,
                        fillColor: fieldBg,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: _stockController,
                      keyboardType: TextInputType.number,
                      style: TextStyle(color: textCol),
                      decoration: InputDecoration(
                        labelText: "Stok Awal",
                        filled: true,
                        fillColor: fieldBg,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              Text("Kategori:", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textCol)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: _categories.map((c) {
                  final active = _selectedCategory == c;
                  return ChoiceChip(
                    label: Text(c),
                    selected: active,
                    selectedColor: const Color(0xFFD97706),
                    labelStyle: TextStyle(
                      color: active ? Colors.white : textCol,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                    onSelected: (_) => setState(() => _selectedCategory = c),
                  );
                }).toList(),
              ),
              const SizedBox(height: 8),

              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text("Pre-Order Custom Cake", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textCol)),
                value: _isCustomCake,
                activeColor: const Color(0xFFD97706),
                onChanged: (v) => setState(() => _isCustomCake = v),
              ),
              const SizedBox(height: 16),

              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _saveProduct,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD97706),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text("Simpan ke Katalog", style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
