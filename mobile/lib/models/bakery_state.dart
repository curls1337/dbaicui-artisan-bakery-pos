import 'package:flutter/foundation.dart';

enum UserRole { owner, manager, cashier, customer }

extension UserRoleExt on UserRole {
  String get label {
    switch (this) {
      case UserRole.owner:
        return 'Owner Executive';
      case UserRole.manager:
        return 'Store & Kitchen Manager';
      case UserRole.cashier:
        return 'Cashier / Front-Desk';
      case UserRole.customer:
        return 'VIP Customer (Gold)';
    }
  }

  String get userName {
    switch (this) {
      case UserRole.owner:
        return 'Hendra Wijaya';
      case UserRole.manager:
        return 'Chef Pierre Sutanto';
      case UserRole.cashier:
        return 'Siti Nurhaliza';
      case UserRole.customer:
        return 'Nadia Salsabila';
    }
  }

  String get email {
    switch (this) {
      case UserRole.owner:
        return 'owner@dbaicui.id';
      case UserRole.manager:
        return 'manager@dbaicui.id';
      case UserRole.cashier:
        return 'kasir@dbaicui.id';
      case UserRole.customer:
        return 'nadia@vip.dbaicui.id';
    }
  }
}

class BakeryProduct {
  final String id;
  final String sku;
  final String name;
  final String category;
  final int price;
  final int hpp;
  int stock;
  final bool isCustomCake;
  final String badge;

  BakeryProduct({
    required this.id,
    required this.sku,
    required this.name,
    required this.category,
    required this.price,
    required this.hpp,
    required this.stock,
    this.isCustomCake = false,
    this.badge = 'Artisan',
  });
}

class BakeryOrder {
  final String id;
  final String orderNumber;
  final String customerName;
  final int totalAmount;
  final String paymentMethod;
  String status;
  final String timeAgo;
  final bool isCustomCake;
  final String? inscription;

  BakeryOrder({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.totalAmount,
    required this.paymentMethod,
    required this.status,
    required this.timeAgo,
    this.isCustomCake = false,
    this.inscription,
  });
}

class OvenBatch {
  final String batchCode;
  final String productName;
  final String ovenSlot;
  final int tempCelsius;
  final int qty;
  String status;

  OvenBatch({
    required this.batchCode,
    required this.productName,
    required this.ovenSlot,
    required this.tempCelsius,
    required this.qty,
    required this.status,
  });
}

class BakeryAppState extends ChangeNotifier {
  bool isAuthenticated = false;
  UserRole activeRole = UserRole.owner;
  bool isDarkTheme = true;
  String serverUrl = 'https://api.dbaicui.id';

  final List<BakeryProduct> products = [
    BakeryProduct(
      id: 'p1',
      sku: 'VNS-CRO-01',
      name: 'French Butter Croissant',
      category: 'Viennoiserie',
      price: 32000,
      hpp: 11800,
      stock: 28,
      badge: 'Best Seller',
    ),
    BakeryProduct(
      id: 'p2',
      sku: 'VNS-PAC-01',
      name: 'Pain au Chocolat Valrhona',
      category: 'Viennoiserie',
      price: 38000,
      hpp: 14500,
      stock: 19,
      badge: '70% Dark',
    ),
    BakeryProduct(
      id: 'p3',
      sku: 'BRD-SRD-01',
      name: 'Country Sourdough Batard',
      category: 'Sourdough',
      price: 55000,
      hpp: 16200,
      stock: 14,
      badge: '28h Ferment',
    ),
    BakeryProduct(
      id: 'p4',
      sku: 'CAK-BSQ-01',
      name: 'Basque Burnt Cheesecake D16',
      category: 'Whole Cake',
      price: 285000,
      hpp: 89500,
      stock: 8,
      badge: 'Signature',
    ),
    BakeryProduct(
      id: 'p5',
      sku: 'CAK-CUS-01',
      name: 'Bespoke Celebration Cake',
      category: 'Custom Cake',
      price: 450000,
      hpp: 142000,
      stock: 99,
      isCustomCake: true,
      badge: 'Pre-Order',
    ),
    BakeryProduct(
      id: 'p6',
      sku: 'BEV-LAT-01',
      name: 'Artisan Flores Cafe Latte',
      category: 'Coffee',
      price: 38000,
      hpp: 9200,
      stock: 50,
      badge: 'Single Origin',
    ),
  ];

  final List<BakeryOrder> orders = [
    BakeryOrder(
      id: 'o1',
      orderNumber: 'DBC-20261109-0001',
      customerName: 'Nadia Salsabila (VIP Gold)',
      totalAmount: 106920,
      paymentMethod: 'QRIS',
      status: 'completed',
      timeAgo: '12m lalu',
    ),
    BakeryOrder(
      id: 'o2',
      orderNumber: 'DBC-20261109-0003',
      customerName: 'Budi Hartono (Platinum)',
      totalAmount: 607750,
      paymentMethod: 'Debit BCA',
      status: 'decorating',
      timeAgo: '1j lalu',
      isCustomCake: true,
      inscription: 'Happy 50th Golden Jubilee!',
    ),
    BakeryOrder(
      id: 'o3',
      orderNumber: 'DBC-20261109-0004',
      customerName: 'Nadia Salsabila (VIP Gold)',
      totalAmount: 445500,
      paymentMethod: 'QRIS DP',
      status: 'baking',
      timeAgo: '25m lalu',
      isCustomCake: true,
      inscription: 'Happy Sweet 17 Cherie!',
    ),
  ];

  final List<OvenBatch> ovenBatches = [
    OvenBatch(
      batchCode: 'OVN-001',
      productName: 'French Butter Croissant',
      ovenSlot: 'Deck Oven #1',
      tempCelsius: 195,
      qty: 24,
      status: 'completed',
    ),
    OvenBatch(
      batchCode: 'OVN-002',
      productName: 'Basque Burnt Cheesecake',
      ovenSlot: 'Deck Oven #2',
      tempCelsius: 230,
      qty: 4,
      status: 'baking',
    ),
    OvenBatch(
      batchCode: 'OVN-003',
      productName: 'Bespoke Celebration Sponge',
      ovenSlot: 'Convection #3',
      tempCelsius: 175,
      qty: 2,
      status: 'proofing',
    ),
  ];

  void login(UserRole role) {
    activeRole = role;
    isAuthenticated = true;
    notifyListeners();
  }

  void switchRole(UserRole role) {
    activeRole = role;
    notifyListeners();
  }

  void logout() {
    isAuthenticated = false;
    notifyListeners();
  }

  void toggleTheme() {
    isDarkTheme = !isDarkTheme;
    notifyListeners();
  }

  void updateServerUrl(String url) {
    serverUrl = url.trim();
    notifyListeners();
  }

  void addProduct(BakeryProduct product) {
    products.insert(0, product);
    notifyListeners();
  }

  void cycleBatchStatus(OvenBatch batch) {
    const flow = ['queued', 'mixing', 'proofing', 'baking', 'cooling', 'completed'];
    final idx = flow.indexOf(batch.status);
    batch.status = flow[(idx + 1) % flow.length];
    notifyListeners();
  }

  String formatRupiah(int amount) {
    final s = amount.toString();
    final buffer = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) {
        buffer.write('.');
      }
      buffer.write(s[i]);
    }
    return 'Rp ${buffer.toString()}';
  }
}
