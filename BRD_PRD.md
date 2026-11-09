# BUSINESS REQUIREMENTS DOCUMENT (BRD) & PRODUCT REQUIREMENTS DOCUMENT (PRD)
## D'Bai Cui Artisan Bakery & Cake Management System

| Field | Detail |
|---|---|
| **Project Name** | D'Bai Cui Artisan Bakery & Cake Management System |
| **Project Slug** | `saint-sejarah-firaun` |
| **Dokumen Versi** | 1.0.0 (Production & Staging Ready) |
| **Tanggal Terbit** | 2026-11-09 |
| **Status Dokumen** | Approved for Development |
| **Target Mode** | **Mode 3**: Hybrid Staging Showcase (Client Demo with Quick Role Switcher) + Full-Stack Production<br>**Mode 4**: Cross-Platform Mobile Application (Flutter for iOS 17+ `.ipa` & Android 14 `.apk` via GitHub Actions CI/CD) |
| **Referensi Industri** | D'Bai Cui, The Harvest Patisserie, Tous Les Jours, Monsieur Spoon |
| **Profil Penyusun** | `team-product-manager` |

---

## 1. BUSINESS CONTEXT & PROBLEM STATEMENT

### 1.1. Latar Belakang Bisnis
D'Bai Cui adalah jaringan artisan patisserie dan bakery premium yang menyajikan aneka *viennoiserie* (croissant, danish), artisan sourdough, entremets, slice cake, hingga pesanan kue ulang tahun custom (*bespoke celebration cakes*). Bisnis bakery artisan memiliki karakteristik unik:
1. **Bahan baku impor & berbiaya tinggi**: Anchor butter, Callebaut chocolate, tepung terigu protein tinggi impor Komachi, cream cheese Elle & Vire, vanila Madagascar, telur pasteurisasi.
2. **Shelf-life sangat pendek**: Produk jadi (fresh-baked) memiliki umur simpan 1-2 hari pada display, sementara bahan baku memiliki tanggal kedaluwarsa ketat.
3. **Kompleksitas produksi**: Pembuatan kue melibatkan proses fermentasi bertahap, batch baking di oven dek/konveksi berkapasitas terbatas, serta pemotongan stok bahan baku berdasar formula resep (*Bill of Materials* - BOM).
4. **Karakteristik pesanan custom**: Pesanan kue ulang tahun custom memerlukan detail spesifik (pesan teks ucapan di cake board/fondant, lilin batang/angka, tanggal & slot jam pengambilan, serta DP/lunas) yang kerap keliru dicatat jika menggunakan nota manual atau POS ritel biasa.

### 1.2. Problem Statement
Saat ini operasional menghadapi beberapa titik kegagalan (*operational bottlenecks*):
1. **Disparitas Stok Bahan vs Kasir**: Bahan baku terpakai di dapur saat baking batch tidak terpotong secara otomatis di sistem gudang saat kasir menjual roti. Terjadi *phantom stock* atau kehabisan bahan mendadak di tengah produksi.
2. **Ketiadaan Sinkronisasi Antrean Oven & Pesanan**: Pesanan kue custom yang diambil sore hari sering bertabrakan jadwal pemanggangan dengan batch harian roti pagi di oven dapur.
3. **Margin & HPP (Cost of Goods Sold) Semu**: Fluktuasi harga bahan baku premium (seperti mentega impor) tidak langsung memperbarui kalkulasi HPP produk per varian, menyebabkan margin profit aktual tidak akurat.
4. **Human Error Kasir pada Custom Cake**: Kasir front-desk sering salah mendikte tulisan di atas kue, keliru memberi lilin angka, atau lupa mencatat tanggal *pickup*, menimbulkan komplain pelanggan saat pengambilan.
5. **Kurangnya Pengalaman Pelanggan VIP**: Pelanggan loyal tidak dapat memantau status pesanan kue custom mereka secara real-time dan sistem loyalty masih mengandalkan kartu stempel fisik.

### 1.3. Business Goals & KPI Keberhasilan
- **Reduksi Food Waste / Bahan Kedaluwarsa**: Turun minimal 35% dalam 3 bulan pertama berkat pelacakan FEFO (*First-Expired, First-Out*) dan peringatan kedaluwarsa.
- **Akurasi HPP & P&L Real-Time**: Owner dapat melihat margin kotor harian dan HPP tiap kue hingga level gramatur bahan baku.
- **Kecepatan Transaksi Kasir POS**: Rata-rata waktu tender transaksi walk-in kasir < 12 detik per pelanggan.
- **Zero-Error Custom Cake Fulfillment**: Tingkat kesalahan pesan ucapan dan slot jadwal pengambilan kue custom turun menjadi 0%.
- **Peningkatan Retensi Pelanggan VIP**: Peningkatan repeat order 25% melalui reward points transparan dan pelacakan status kue real-time via mobile/web.

### 1.4. Ruang Lingkup Proyek (Scope)
#### In-Scope:
- Multi-role RBAC: Owner, Store Manager / Kitchen Head, Kasir / Front-Desk, dan Pelanggan VIP.
- Single Page Application (SPA) Web Dashboard & POS dengan antarmuka Glassmorphism modern dan Tailwind CSS.
- Mode Hybrid Showcase: Floating Quick Role Switcher untuk demo calon klien tanpa harus bolak-balik login manual.
- Modul POS Layar Cepat: Pencarian sentuh, quick tender (QRIS, Tunai, EDC/Debit), dan cetak struk thermal 58mm/80mm (ESC/POS).
- Modul Custom Cake Order Taker: Input pesan ucapan di atas kue, pemilihan lilin angka/batang, dekorasi khusus, dan penetapan tanggal/jam pickup.
- Bill of Materials (BOM) & Inventory: Multi-level recipe, auto-deduction bahan baku per batch produksi / transaksi, peringatan stok menipis (*low stock alert*), dan expiry batch tracking.
- Kitchen Display & Oven Batch Queue: Penjadwalan giliran oven (suhu, waktu, kapasitas loyang) terintegrasi status produksi.
- VIP Customer Portal: Interactive cake catalog, tracking timeline status pesanan (Diterima -> Antrean Dapur -> Baking -> Dekorasi -> Siap Diambil -> Selesai), dan poin loyalitas.
- Cross-Platform Mobile Apps (Flutter): Versi mobile native untuk Android & iOS dengan sinkronisasi ke backend REST API.

#### Out-of-Scope (Non-Goals):
- Integrasi armada kurir pengiriman pihak ketiga (Gojek/Grab on-demand dispatch API) pada tahap rilis v1 (pengambilan difokuskan *self-pickup* atau kurir internal toko).
- Multi-currency / kurs mata uang asing (v1 fokus mata uang Rupiah IDR).
- Modul akuntansi perpajakan lanjutan (SPT/e-Faktur) – data yang disediakan sebatas export P&L & ringkasan PPN 11%.

---

## 2. ARSITEKTUR SISTEM & TECHNICAL FOUNDATION

### 2.1. Tech Stack Overview
```
+-----------------------------------------------------------------------------------+
|                              D'BAI CUI ECOSYSTEM                                  |
+-----------------------------------------+-----------------------------------------+
|                CLIENT TIER              |               MOBILE TIER               |
|  - Modern Web Responsive SPA            |  - Flutter (Material 3 & Cupertino)     |
|  - Tailwind CSS + Glassmorphism Theme   |  - Android 14 (.apk release)            |
|  - Chart.js Financial Analytics         |  - iOS 17+ (.ipa sideload ready)        |
|  - Web Thermal ESC/POS Print Connector  |  - GitHub Actions CI/CD Cloud Builder   |
|  - Interactive Floating Quick Switcher  |  - Push Notification & Real-time State  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v [HTTPS / REST API / JSON]
+-----------------------------------------------------------------------------------+
|                               BACKEND SERVICE LAYER                               |
|  - Node.js (Express / TypeScript Architecture)                                    |
|  - JWT Bearer Authentication & RBAC Guard Middleware                             |
|  - POS Quick PIN Terminal Guard                                                   |
|  - Auto-Deduction Inventory & BOM Calculation Engine                              |
|  - Thermal ESC/POS Template Formatter (58mm & 80mm)                               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                 DATA PERSISTENCE                                  |
|  - PostgreSQL (Production) / SQLite (Local Staging & Hybrid Showcase)             |
|  - schema.sql (Relational Schema: users, items, raw_materials, bom, orders, oven) |
|  - seed.sql (Artisan Recipe Data, Realistic Stock, Anchor Butter, VIP accounts)   |
+-----------------------------------------------------------------------------------+
```

### 2.2. Login, Session Management & Quick PIN Mode
1. **Standard JWT Authentication**:
   - Algoritma: `HMAC-SHA256` (HS256).
   - Access Token masa aktif: 8 jam (standar shift operasional kasir & dapur).
   - Refresh Token masa aktif: 7 hari disimpan dalam `HttpOnly` Secure Cookie.
   - Header: `Authorization: Bearer <token>`.
2. **Terminal Quick PIN Mode (Layar Kasir POS)**:
   - Pada terminal POS fisik, kasir front-desk dapat mengunci layar (*Lock Screen*) saat meninggalkan meja kasir.
   - Buka kunci instan menggunakan **4-digit/6-digit numeric PIN** (contoh kasir default: `1234`) tanpa mengetik ulang email dan password panjang.
3. **Client Showcase Staging (Quick Switch Role Bar)**:
   - Untuk demonstrasi instan ke calon investor / klien bakery tanpa proses login berulang.
   - Komponen floating bar di pojok atas layar menampilkan tombol switcher:
     * `[👑 Owner]` -> Token Owner (Akses P&L, HPP, All Features).
     * `[👨‍🍳 Head Baker]` -> Token Manager (Akses Oven, BOM, Bahan Baku).
     * `[🏷️ Kasir]` -> Token Kasir (Akses POS Cepat, Custom Order, Cetak Struk).
     * `[👤 Pelanggan VIP]` -> Token Customer (Akses Katalog, Tracking Order, Poin).
   - Mengganti state aktif aplikasi seketika (< 300ms) dengan seed data terisolasi.

### 2.3. Environment Variables Specification (`.env`)
```bash
# Server & Runtime Configuration
NODE_ENV=production
PORT=5000
API_BASE_URL=https://webui.5nod.com/staging/saint-sejarah-firaun/api
CLIENT_URL=https://webui.5nod.com/staging/saint-sejarah-firaun

# Security & Authentication
JWT_SECRET=dbai_cui_artisan_patisserie_jwt_super_secret_key_2026_xyz
JWT_EXPIRES_IN=8h
JWT_REFRESH_SECRET=dbai_cui_refresh_secret_key_patisserie_secure_998877
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*

# Database Persistence
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dbai_cui_bakery
DB_USER=bakery_admin
DB_PASSWORD=SecureBakeryPasswd2026!
# Alternatif SQLite untuk Mode Staging Showcase:
SQLITE_DB_PATH=./data/bakery_staging.sqlite

# Hardware & POS Printer Settings
DEFAULT_THERMAL_PRINTER_WIDTH=58mm # Pilihan: 58mm atau 80mm
PRINTER_CHARACTER_PER_LINE_58=32
PRINTER_CHARACTER_PER_LINE_80=48
STORE_NAME="D'Bai Cui Artisan Bakery"
STORE_ADDRESS="Jl. Patisserie No. 88, Kebayoran Baru, Jakarta Selatan"
STORE_PHONE="+62 21 7890 1234"
STORE_TAX_PERCENT=11.0

# Mobile Application (Flutter Build Env)
FLUTTER_API_BASE_URL=https://webui.5nod.com/staging/saint-sejarah-firaun/api
ENABLE_QUICK_SWITCHER=true
```

---

## 3. MATRIKS RBAC 4 ROLE & CAPABILITIES

### 3.1. Pemetaan Hak Akses & CRUD Matrix
Setiap endpoint dan antarmuka UI dilindungi oleh middleware RBAC.

| Modul / Fitur | 👑 Owner / Superadmin | 👨‍🍳 Store Manager & Baker | 🏷️ Kasir / Front-Desk | 👤 Pelanggan VIP |
|---|:---:|:---:|:---:|:---:|
| **Dashboard P&L & Laba/Rugi** | CRUD (Full) | NO ACCESS | NO ACCESS | NO ACCESS |
| **Kalkulator HPP & Costing Bahan** | CRUD (Full) | Read-Only | NO ACCESS | NO ACCESS |
| **Manajemen Staff & Akun Kasir** | CRUD (Full) | Read-Only | NO ACCESS | NO ACCESS |
| **Penyusunan Resep & Formula BOM** | CRUD (Full) | CRUD (Full) | NO ACCESS | NO ACCESS |
| **Jadwal Antrean Oven & Batch Baking** | Read-Only | CRUD (Full) | Read-Only | NO ACCESS |
| **Stok Bahan Baku & Peringatan FEFO** | Read-Only | CRUD (Full) | NO ACCESS | NO ACCESS |
| **Layar Cepat POS Kasir & Tender** | Full (Audit) | Read-Only | CRUD (Full) | NO ACCESS |
| **Custom Cake Order Taker** | Full (Audit) | Read (Schedule) | CRUD (Full) | Create (Pre-Order) |
| **Cetak Ulang Struk Thermal** | YES | NO ACCESS | YES | NO ACCESS |
| **Katalog Produk & Interactive Menu** | Read | Read | Read | Read-Only |
| **Tracking Status Order Real-Time** | Read | Update Status | Update Status | Read (Own Orders) |
| **Poin Reward & Riwayat Transaksi** | Manage Policy | NO ACCESS | Redeem Point | View Own Points |

### 3.2. Detail User Stories & Acceptance Specifications per Role

#### Role 1: 👑 Owner / Superadmin
- **User Story 1.1**: Sebagai Owner, saya ingin melihat grafik omzet harian, mingguan, dan margin kotor (P&L) secara real-time, agar saya dapat mengevaluasi profitabilitas bakery.
- **User Story 1.2**: Sebagai Owner, saya ingin memantau HPP (Harga Pokok Penjualan) setiap produk bakery yang dihitung otomatis dari harga bahan baku terkini, agar harga jual tidak merugi saat harga mentega impor naik.
- **User Story 1.3**: Sebagai Owner, saya ingin mengelola hak akses seluruh karyawan (Manager, Chef, Kasir) dan memantau rekonsiliasi kas kasir (*cash float vs actual drawer*) di akhir shift.

#### Role 2: 👨‍🍳 Store Manager / Chef Kitchen
- **User Story 2.1**: Sebagai Chef Kitchen, saya ingin menyusun antrean batch oven dapur (misal: Batch 1 Croissant pukul 06:00, Batch 2 Sourdough pukul 07:30) agar kapasitas oven dek termanfaatkan maksimal dan suhu oven stabil.
- **User Story 2.2**: Sebagai Head Baker, saya ingin sistem otomatis memotong stok bahan baku (tepung Komachi, mentega Anchor, telur, ragi) segera setelah tombol `Mulai Batch Produksi` ditekan sesuai formula BOM.
- **User Story 2.3**: Sebagai Store Manager, saya ingin menerima notifikasi peringatan bahan baku yang mendekati tanggal kedaluwarsa (< 7 hari) dan stok di bawah batas minimum (*Safety Stock Alert*).

#### Role 3: 🏷️ Kasir / Front-Desk
- **User Story 3.1**: Sebagai Kasir, saya ingin memilih produk dalam grid kategori sentuh yang cepat dan responsif serta mendukung pencarian barcode/SKU agar antrean pembeli tidak menumpuk.
- **User Story 3.2**: Sebagai Kasir, saya ingin mencatat pesanan kue ulang tahun custom lengkap dengan teks ucapan di atas kue, pilihan lilin (lilin batang / lilin angka 0-9), pisau kue, dan tanggal/jam pengambilan.
- **User Story 3.3**: Sebagai Kasir, saya ingin memproses pembayaran multi-metode (QRIS statis/dinamis, Tunai dengan kalkulator nominal uang kembalian cepat, Kartu Debit EDC) dan langsung mencetak struk kasir thermal 58mm atau 80mm.
- **User Story 3.4**: Sebagai Kasir, saya ingin menginput nomor HP member VIP untuk memberikan diskon otomatis atau redeem poin reward.

#### Role 4: 👤 Pelanggan VIP
- **User Story 4.1**: Sebagai Pelanggan VIP, saya ingin melihat katalog kue artisan lengkap dengan foto resolusi tinggi, deskripsi bahan (misal: 70% Dark Chocolate Valrhona), dan ketersediaan stok hari ini.
- **User Story 4.2**: Sebagai Pelanggan VIP, saya ingin memantau status pesanan kue custom saya melalui status timeline interaktif: `Diterima` -> `Antrean Oven` -> `Baking` -> `Dekorasi/Piping` -> `Siap Diambil di Toko`.
- **User Story 4.3**: Sebagai Pelanggan VIP, saya ingin mengumpulkan 1 poin setiap pembelanjaan kelipatan Rp 10.000 dan menukarkan poin tersebut menjadi potongan harga saat checkout.

---

## 4. BILL OF MATERIALS (BOM), RESEP & ALUR MANAJEMEN INVENTARIS

### 4.1. Konsep Multi-Level BOM Artisan Bakery
Di D'Bai Cui, sebuah produk jadi terbagi menjadi 2 kategori:
1. **Fresh Daily Bread & Pastry (Pre-baked / Make-to-Stock)**:
   - Dibuat dalam jumlah batch (misal 1 batch = 24 pcs Croissant).
   - Bahan baku terpotong saat Chef Kitchen mengklik *Start Batch Production*.
2. **Custom Birthday Cake (Make-to-Order)**:
   - Terdiri dari Base Sponge Cake + Filling + Frosting/Cover + Aksesoris (Lilin, Topper, Cake Board).
   - Bahan baku terpotong saat pesanan dikonfirmasi masuk ke antrean dapur.

```
[BOM Structure: Signature Opera Cake 20x20 cm]
│
├── Sub-Recipe A: Joconde Sponge (Almond Flour, Egg, Sugar, Flour)
├── Sub-Recipe B: Coffee Buttercream (Anchor Butter, Espresso Extract, Sugar Syrup)
├── Sub-Recipe C: Dark Chocolate Ganache (Callebaut 54.5%, Anchor Fresh Cream)
├── Sub-Recipe D: Coffee Syrup Soak (Espresso, Sugar, Water)
└── Packaging & Accessories: Gold Cake Board 25x25cm, Hardbox D'Bai Cui, Lilin Spiral
```

### 4.2. Formula Perhitungan HPP / Cost of Goods Sold (COGS)
Rumus perhitungan biaya produk:
$$\text{HPP Total} = \sum (\text{Kuantitas Bahan} \times \text{Harga Satuan}) + \text{Packaging} + \text{Alokasi Overhead/Tenaga Kerja Dapur}$$
Contoh:
- Croissant Butter: Bahan Baku (Rp 8.200) + Box Kraft (Rp 1.500) + Biaya Baking Oven Listrik (Rp 1.300) = **HPP Rp 11.000**.
- Harga Jual: **Rp 28.000**.
- Gross Profit Margin: $\frac{28.000 - 11.000}{28.000} \times 100\% = 60.71\%$.

### 4.3. Master Data Resep & BOM (Seed Data Detail)

#### Produk 1: Croissant Almond Premium (Batch = 12 pcs)
| Bahan Baku | Spesifikasi / Merk | Jumlah Pemakaian Batch | Satuan | Biaya Satuan | Total Biaya Batch |
|---|---|---|---|---|---|
| Tepung Terigu Komachi | Protein Tinggi Jepang | 600 | gram | Rp 22 / gr | Rp 13.200 |
| Mentega Lembaran (Laminating) | Anchor Croissant Butter Sheet | 350 | gram | Rp 160 / gr | Rp 56.000 |
| Telur Ayam Omega | Pasteurisasi | 3 | butir | Rp 2.500 / btr | Rp 7.500 |
| Almond Slice Panggang | Blue Diamond | 150 | gram | Rp 220 / gr | Rp 33.000 |
| Gula Halus Donat | Rafinasi | 80 | gram | Rp 18 / gr | Rp 1.440 |
| Susu Segar Full Cream | Greenfields | 250 | ml | Rp 28 / ml | Rp 7.000 |
| Ragi Instan | Saf-Instant Gold | 12 | gram | Rp 120 / gr | Rp 1.440 |
| **Total Biaya Bahan 12 pcs** | | | | | **Rp 119.580** |
| **HPP per Pcs (Bahan)** | | | | | **Rp 9.965** |
| Packaging & Wax Paper | Custom D'Bai Cui | 1 | pcs | Rp 1.500 | Rp 1.500 |
| **Total HPP Akhir** | | | | | **Rp 11.465** |
| **Harga Jual Retail** | | | | | **Rp 32.000** |

#### Produk 2: Signature Opera Cake 20x20 cm (Custom Birthday Cake)
| Bahan Baku | Spesifikasi / Merk | Jumlah Pemakaian | Satuan | Biaya Satuan | Total Biaya |
|---|---|---|---|---|---|
| Tepung Almond Murni | Bob's Red Mill | 180 | gram | Rp 280 / gr | Rp 50.400 |
| Dark Chocolate Couverture | Callebaut 811 54.5% | 250 | gram | Rp 240 / gr | Rp 60.000 |
| Fresh Whipping Cream | Anchor UHT Whipping | 300 | ml | Rp 85 / ml | Rp 25.500 |
| Unsalted Butter | Anchor Pure Butter Block | 200 | gram | Rp 140 / gr | Rp 28.000 |
| Espresso Roast Concentrate | Arabica House Blend | 100 | ml | Rp 120 / ml | Rp 12.000 |
| Telur Ayam Omega | Pasteurisasi | 6 | butir | Rp 2.500 / btr | Rp 15.000 |
| Gula Kastor | Gulaku Putih | 150 | gram | Rp 18 / gr | Rp 2.700 |
| Gold Cake Board + Mica Box | D'Bai Cui Luxury Packaging | 1 | set | Rp 25.000 | Rp 25.000 |
| **Total HPP Bahan & Packaging** | | | | | **Rp 218.600** |
| **Harga Jual Retail** | | | | | **Rp 450.000** |

### 4.4. Logika Pemotongan Bahan Baku & FEFO (First-Expired, First-Out)
1. **Trigger Pemotongan**:
   - Untuk Daily Pastry: Tombol `[Eksekusi Batch Baking]` ditekan oleh Chef di antrean oven.
   - Untuk Custom Order: Status pesanan berubah dari `Draft` menjadi `Confirmed / Kitchen Queue`.
2. **Algoritma Alokasi Batch Bahan**:
   - Sistem mencari nomor Lot/Batch bahan baku yang memiliki `expiry_date` paling dekat yang stoknya masih > 0.
   - Jika stok batch terdekat tidak mencukupi, sistem mengambil sisa kebutuhan dari batch berikutnya (*lot cascading*).
   - Menghasilkan catatan audit `inventory_movement` (Movement Type: `PRODUCTION_OUT`, Ref: Order ID / Batch ID).

---

## 5. MODUL TRANSAKSI KASIR (POS), CUSTOM CAKE & THERMAL PRINTING

### 5.1. Alur Transaksi Kasir Front-Desk (POS Flow)
```
[Pelanggan Datang]
        │
        ├────────────────────────────────────────┐
        ▼ (Roti / Pastry Walk-In)                ▼ (Pesan Kue Ultah Custom)
[Sentuh Grid Produk / Scan Barcode]      [Buka Modal Custom Cake Order Taker]
        │                                        │
        │                                        ├── Pilih Ukuran (16cm/20cm/24cm)
        │                                        ├── Tulis Pesan Cake: "Happy 25th Sarah!"
        │                                        ├── Pilih Lilin: Angka "2" & "5"
        │                                        ├── Tentukan Tgl & Jam Pickup
        │                                        └── Input Catatan Khusus Alergi
        │                                        │
        └───────────────────┬────────────────────┘
                            │
                            ▼
              [Input No. HP Member / VIP]
            (Tampilkan Diskon & Poin Reward)
                            │
                            ▼
               [Pilih Metode Pembayaran]
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼
     [QRIS]              [TUNAI]            [DEBIT / EDC]
- Generate QR Code   - Input Uang Fisik    - Input No. Approval
- Scan Dinamis       - Kalkulasi Otomatis   - Slip Merchant
- Auto Confirmed       Kembalian Cepat
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
                            ▼
                 [Pembayaran Berhasil]
                            │
                            ▼
           [Cetak Struk Kasir Thermal ESC/POS]
        (Pilihan Format: 58mm atau 80mm Otomatis)
```

### 5.2. Spesifikasi Layar Custom Cake Order Taker
Formulir khusus kasir wajib memuat:
1. **Pilihan Base Cake**: Signature Opera, Red Velvet Cream Cheese, Black Forest Kirsch, Mango Mousse Entremet.
2. **Ukuran Kue**: Bulat 16cm (4-6 porsi), 20cm (8-10 porsi), 24cm (12-16 porsi), Persegi 30x30cm.
3. **Pesan Ucapan di Kue (Wording on Cake)**: Input teks (Maks. 45 karakter). Validasi: Karakter berbahaya disanitasi. Pilihan warna tinta krim ucapan (Cokelat, Putih, Emas, Merah Muda).
4. **Perlengkapan Pesta**:
   - Lilin Batang Ulir (Free 2 batang).
   - Lilin Angka Emas (Dropdown angka puluhan & satuan, biaya tambahan Rp 12.000 / angka).
   - Pisau Pemotong Kue Segitiga Transparan (Free 1 pcs).
   - Kartu Ucapan (*Greeting Card* cetak mini).
5. **Tanggal & Jam Pengambilan (Pickup Schedule)**:
   - Date picker (Minimal H+1 untuk custom rumit, atau slot Same-Day jika stok base cake tersedia).
   - Slot jam: `10:00 - 12:00`, `12:00 - 15:00`, `15:00 - 18:00`, `18:00 - 21:00`.
6. **DP (Uang Muka) vs Lunas**:
   - Opsi pembayaran DP minimal 50% atau Pembayaran Lunas di awal.

### 5.3. Format Thermal Receipt Printing (58mm & 80mm ESC/POS)
Sistem memiliki template generator plain-text monospace yang kompatibel dengan printer ESC/POS Bluetooth, USB, dan Network Ethernet.

#### Template Monospace 58mm (32 Karakter per Baris):
```text
================================
       D'BAI CUI ARTISAN        
     BAKERY & PATISSERIE        
  Jl. Patisserie No. 88, Jkt    
      Telp: 021-78901234        
================================
No   : DBC-20261109-0042        
Tgl  : 09/11/2026 14:32 WIB     
Kasir: Maya (K-02)              
Cust : Sarah Wijaya (VIP)       
--------------------------------
1x Croissant Almond     32.000  
1x Artisan Sourdough    45.000  
1x Custom Cake 20cm    450.000  
   *Wording: HBD Sarah 25th*    
   *Lilin Angka: [2][5]*        
   *Pickup: 10/11/26 15:00*     
--------------------------------
Subtotal               527.000  
Diskon VIP (5%)        -26.350  
PB1 (10%)               50.065  
--------------------------------
TOTAL                  550.715  
TUNAI                  600.000  
KEMBALIAN               49.285  
--------------------------------
Poin Diperoleh       : +55 Pts  
Total Poin Anda      : 420 Pts  
================================
   Terima Kasih Atas Kunjungan  
  Follow IG: @dbaicui.artisan   
================================
```

---

## 6. JADWAL BATCH OVEN & KITCHEN DISPLAY SYSTEM (KDS)

### 6.1. Spesifikasi Penjadwalan Oven Dapur
D'Bai Cui memiliki 3 unit oven industri:
1. **Oven Deck 1 (Stone Base)**: Kapasitas 4 Loyang 40x60 cm, Suhu 220°C - 240°C (Khusus Artisan Sourdough & Baguette beruap/steam).
2. **Oven Deck 2 (Convection Deck)**: Kapasitas 6 Loyang 40x60 cm, Suhu 175°C - 190°C (Khusus Croissant, Danish, Brioche).
3. **Oven Deck 3 (Rotary/Static Pastry)**: Kapasitas 4 Loyang, Suhu 150°C - 165°C (Khusus Sponge Cake, Choux, Macaron Shells).

### 6.2. Status Siklus Hidup Pesanan & Batch Oven
```
[Direncanakan] ──> [Bahan Siap / Terpotong] ──> [Sedang Di-Oven] ──> [Cooling / Finishing] ──> [Siap di Display / Siap Ambil]
```
- Tampilan KDS menampilkan hitung mundur waktu baking (*live countdown timer*).
- Indikator warna KDS:
  - Hijau: Normal dalam pengerjaan (> 30 menit sisa waktu pickup).
  - Kuning: Waktu pickup < 30 menit (butuh atensi dekorasi).
  - Merah: Terlambat (*delayed* dari jadwal janji pickup).

---

## 7. REST API SPECIFICATION PER ROLE

### 7.1. Autentikasi & Session
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, refreshToken, user: { id, name, role, email, avatar } }`
- `POST /api/auth/quick-pin-login`
  - Body: `{ pin, terminalId }`
  - Response: `{ token, user: { id, name, role: 'cashier' } }`
- `POST /api/auth/switch-role-demo` *(Khusus Staging Showcase Mode)*
  - Body: `{ targetRole: 'owner' | 'manager' | 'cashier' | 'customer' }`
  - Response: `{ token, user, message: "Switched to demo role successfully" }`

### 7.2. Owner Endpoints (`/api/owner/*`) - Role: `owner`
- `GET /api/owner/analytics/summary`: Ringkasan omzet, laba kotor, HPP total, total transaksi hari ini/bulan ini.
- `GET /api/owner/analytics/p-and-l`: Laporan laba rugi terinci (Revenue - COGS - Operasional).
- `GET /api/owner/recipes/costing`: Daftar seluruh resep dengan kalkulasi HPP dan margin persentase saat ini.
- `POST /api/owner/recipes/recalculate`: Memicu pembaruan HPP massal berdasarkan harga pembelian bahan baku terkini.
- `GET /api/owner/staff`: Daftar seluruh karyawan, peran, log aktivitas, dan total penjualan kasir.
- `POST /api/owner/staff`: Menambah staf baru / mengedit PIN kasir.

### 7.3. Store Manager & Kitchen Endpoints (`/api/kitchen/*`) - Role: `owner`, `manager`
- `GET /api/kitchen/oven-schedule`: Mengambil jadwal batch oven aktif dan antrean pemanggangan hari ini.
- `POST /api/kitchen/oven-schedule`: Membuat batch oven baru (pilih resep, jumlah loyang, estimasi waktu).
- `PATCH /api/kitchen/oven-schedule/:id/status`: Mengubah status batch (`prep`, `baking`, `cooling`, `ready`).
- `GET /api/kitchen/raw-materials`: Daftar stok bahan baku (berat/volume, stok minimum, status alert).
- `POST /api/kitchen/raw-materials`: Menambah stok bahan masuk (*Stock In / Purchase Receipt*).
- `GET /api/kitchen/expiry-tracker`: Daftar bahan baku dengan tanggal kedaluwarsa terdekat (< 14 hari).
- `GET /api/kitchen/recipes`: Mengambil detail formulasi BOM tiap produk.
- `PUT /api/kitchen/recipes/:id`: Memperbarui takaran bahan per batch resep.

### 7.4. Cashier & POS Endpoints (`/api/pos/*`) - Role: `owner`, `cashier`
- `GET /api/pos/products`: Mengambil katalog produk kasir (dengan status ketersediaan & harga retail).
- `POST /api/pos/orders`: Membuat transaksi penjualan baru (walk-in atau custom cake).
  - Body mencakup item, payment method, amount tender, memberId, customCakeDetails (jika ada).
- `GET /api/pos/orders/custom-queue`: Daftar pesanan custom cake yang dijadwalkan untuk diambil hari ini/besok.
- `POST /api/pos/orders/:id/print`: Memformat data pesanan menjadi ESC/POS bytes untuk printer 58mm/80mm.
- `GET /api/pos/members/search?phone=...`: Mencari profil member berdasarkan nomor HP atau barcode kartu.
- `POST /api/pos/orders/:id/void`: Membatalkan transaksi kasir (memerlukan PIN supervisor/manager).

### 7.5. VIP Customer Endpoints (`/api/customer/*`) - Role: `customer` (dan publik untuk katalog)
- `GET /api/customer/catalog`: Katalog kue interaktif dengan filter kategori (*Artisan Bread, Viennoiserie, Whole Cake, Entremet*).
- `POST /api/customer/pre-order`: Membuat pra-pesan kue custom mandiri oleh pelanggan VIP.
- `GET /api/customer/orders`: Riwayat pesanan pelanggan yang sedang login.
- `GET /api/customer/orders/:id/track`: Status pelacakan real-time timeline pesanan kue custom.
- `GET /api/customer/loyalty`: Total poin reward, riwayat perolehan/penukaran poin, dan tier member (Silver, Gold, Platinum).

---

## 8. SPECIFICATION ACCEPTANCE CRITERIA (AC) TERUKUR

Kriteria penerimaan ditulis menggunakan format **Gherkin (Given - When - Then)** yang dapat diuji secara fungsional.

### 8.1. Skenario Autentikasi & Quick Role Switcher (Staging Demo)
```gherkin
Feature: Autentikasi & Quick Role Switcher
  Scenario: Klien melakukan simulasi role 1-klik pada Showcase Staging
    Given Pengguna membuka halaman web staging D'Bai Cui
    And Bar navigasi atas menampilkan "Quick Role Switcher"
    When Pengguna mengklik tombol "👨‍🍳 Kitchen Head"
    Then Sistem mengganti sesi aktif menjadi Store Manager / Chef Kitchen tanpa meminta kata sandi
    And Tampilan antarmuka berganti menampilkan antrean oven dan stok bahan baku
    And Menu P&L Finansial Owner disembunyikan secara otomatis

  Scenario: Kasir melakukan pembukaan kunci cepat via PIN di POS
    Given Kasir berada di layar terkunci POS Terminal
    When Kasir memasukkan 4-digit PIN "1234"
    Then Layar POS terbuka ke antarmuka katalog kasir dalam waktu kurang dari 300 ms
    And Nama kasir aktif "Maya" tertera pada header transaksi
```

### 8.2. Skenario Kasir & Custom Cake Order Taker
```gherkin
Feature: Transaksi POS & Custom Birthday Cake
  Scenario: Kasir mencatat pesanan kue ulang tahun dengan lilin dan pesan ucapan
    Given Kasir membuka modal "Custom Cake Order Taker"
    When Kasir memilih "Signature Opera Cake 20x20cm"
    And Mengisi ucapan: "Selamat Ulang Tahun Papa Ke-50"
    And Memilih lilin angka "5" dan "0" (tambahan Rp 24.000)
    And Memilih slot pengambilan besok pukul "15:00 WIB"
    And Kasir memilih metode pembayaran "QRIS"
    Then Sistem menghasilkan kode QRIS dinamis senilai Rp 474.000
    And Setelah pembayaran terkonfirmasi, tombol "Cetak Struk 58mm" aktif
    And Pesanan masuk ke antrean KDS Dapur dengan status "Antrean Dapur"
```

### 8.3. Skenario Bill of Materials (BOM) & Auto-Deduction Stok
```gherkin
Feature: Pengurangan Otomatis Bahan Baku Resep
  Scenario: Chef Dapur memulai batch baking 24 pcs Croissant Almond
    Given Stok bahan "Anchor Croissant Butter Sheet" di sistem tercatat 10.000 gram
    And Resep standar membutuhkan 350 gram per batch 12 pcs (total 700 gram untuk 24 pcs)
    When Chef Kitchen menekan tombol "Mulai Batch Baking 24 Pcs"
    Then Sistem memotong stok bahan baku sebesar 700 gram secara otomatis
    And Sisa stok bahan Anchor Butter Sheet tercatat 9.300 gram di tabel inventory
    And Tercatat log audit pergerakan stok bertipe "PRODUCTION_OUT" dengan ID batch terkait
```

### 8.4. Skenario Expiry Tracker (FEFO) & Low Stock Alert
```gherkin
Feature: Peringatan Dini Bahan Kedaluwarsa
  Scenario: Bahan baku mendekati tanggal kedaluwarsa
    Given Terdapat batch bahan "Elle & Vire Whipping Cream" dengan kedaluwarsa 4 hari ke depan
    When Store Manager membuka halaman "Expiry Tracker"
    Then Batch tersebut ditandai dengan badge peringatan merah "Kritis: Expired < 7 Hari"
    And Muncul tombol rekomendasi "Prioritaskan Batch Ini untuk Produksi Hari Ini"
```

### 8.5. Skenario Mobile App VIP Customer (Flutter Android & iOS)
```gherkin
Feature: Pelacakan Status Pesanan di Aplikasi Mobile Pelanggan VIP
  Scenario: Pelanggan memeriksa progres pembuatan kue ulang tahun
    Given Pelanggan VIP telah login di aplikasi Flutter
    When Pelanggan membuka tab "Pesanan Saya" dan memilih pesanan #DBC-20261109-0042
    Then Sistem menampilkan timeline visual dengan status saat ini "Tahap Dekorasi & Piping"
    And Menampilkan estimasi waktu siap ambil pukul "15:00 WIB"
    And Poin loyalitas pelanggan bertambah sesuai nominal transaksi setelah status menjadi "Selesai"
```

---

## 9. MODEL DATA & REALISTIC SEED DATA SPECIFICATION

### 9.1. Relasi Entitas Database Utama
- `users`: ID, nama, email, password_hash, pin, role (`owner`, `manager`, `cashier`, `customer`), phone, loyalty_points.
- `raw_materials`: ID, kode_sku, nama_bahan, kategori (`dairy`, `flour`, `chocolate`, `sugar_dry`, `packaging`), unit (`gram`, `ml`, `pcs`), harga_per_unit, safety_stock, current_stock.
- `material_batches`: ID, material_id, lot_number, quantity, expiry_date, supplier_name.
- `products`: ID, kode_produk, nama_produk, kategori (`bread`, `viennoiserie`, `whole_cake`, `entremet`), harga_jual, status_aktif, image_url.
- `bill_of_materials (bom)`: ID, product_id, material_id, quantity_required, unit.
- `oven_schedules`: ID, batch_code, product_id, quantity_target, oven_id, start_time, end_time, status (`scheduled`, `baking`, `cooling`, `completed`).
- `orders`: ID, invoice_number, customer_id, cashier_id, order_type (`walk_in`, `custom_cake`), subtotal, discount, tax, total, payment_method (`cash`, `qris`, `debit`), status (`pending`, `kitchen_queue`, `ready`, `completed`, `cancelled`), created_at.
- `custom_cake_details`: ID, order_id, wording_on_cake, candle_type, candle_numbers, pickup_date, pickup_time_slot, cake_size, special_notes.
- `order_items`: ID, order_id, product_id, quantity, unit_price, subtotal.

### 9.2. Seed Data Master Realistis

#### Pengguna Default (Demo Credential):
1. **👑 Owner**:
   - Email: `owner@dbaicui.com`
   - Password: `Password123!`
   - Nama: Chef Richard Hartono (Founder & Executive Pastry Chef)
2. **👨‍🍳 Store Manager & Head Baker**:
   - Email: `baker@dbaicui.com`
   - Password: `Password123!`
   - Nama: Chef Pierre Santoso
3. **🏷️ Kasir & Front-Desk**:
   - Email: `kasir@dbaicui.com`
   - Password: `Password123!`
   - PIN Terminal: `1234`
   - Nama: Maya Anggraini
4. **👤 Pelanggan VIP**:
   - Email: `vip@sarahwijaya.com`
   - Password: `Password123!`
   - Nama: Sarah Wijaya (VIP Platinum - 420 Poin)
   - No. HP: `081299887766`

#### Master Bahan Baku Utama:
- **RAW-01**: Anchor Pure Unsalted Butter (Kategori: Dairy, Satuan: gram, Stok: 25.000 gr, Harga: Rp 140/gr, Exp: 2027-04-15)
- **RAW-02**: Anchor Croissant Sheet Butter (Kategori: Dairy, Satuan: gram, Stok: 15.000 gr, Harga: Rp 160/gr, Exp: 2027-03-20)
- **RAW-03**: Callebaut Dark Chocolate 811 54.5% (Kategori: Chocolate, Satuan: gram, Stok: 12.000 gr, Harga: Rp 240/gr, Exp: 2027-08-10)
- **RAW-04**: Tepung Terigu Komachi Protein Tinggi (Kategori: Flour, Satuan: gram, Stok: 50.000 gr, Harga: Rp 22/gr, Exp: 2027-02-15)
- **RAW-05**: Telur Ayam Pasteurisasi Omega (Kategori: Dairy/Egg, Satuan: butir, Stok: 300 btr, Harga: Rp 2.500/btr, Exp: 2026-11-20 -> *Warning < 14 Hari*)
- **RAW-06**: Fondant Satin Ice Pure White (Kategori: Sugar/Decor, Satuan: gram, Stok: 8.000 gr, Harga: Rp 110/gr, Exp: 2027-10-01)
- **RAW-07**: Pure Madagascar Bourbon Vanilla Extract (Kategori: Flavor, Satuan: ml, Stok: 2.000 ml, Harga: Rp 1.200/ml, Exp: 2028-01-01)

#### Master Produk Jadi Retail:
- **PRD-01**: Croissant Almond Signature (Kategori: Viennoiserie, Harga: Rp 32.000, HPP: Rp 11.465)
- **PRD-02**: Pain Au Chocolat Callebaut (Kategori: Viennoiserie, Harga: Rp 30.000, HPP: Rp 10.200)
- **PRD-03**: Artisan San Francisco Sourdough Loaf (Kategori: Bread, Harga: Rp 45.000, HPP: Rp 9.800)
- **PRD-04**: Signature Opera Cake 20x20cm (Kategori: Whole Cake, Harga: Rp 450.000, HPP: Rp 218.600)
- **PRD-05**: Classic Red Velvet Birthday Cake 20cm (Kategori: Whole Cake, Harga: Rp 380.000, HPP: Rp 165.000)
- **PRD-06**: French Macaron Gift Box (Isi 6 pcs) (Kategori: Entremet, Harga: Rp 95.000, HPP: Rp 36.000)

---

## 10. NON-FUNCTIONAL REQUIREMENTS (NFR) & DEVICE COMPLIANCE

1. **Kecepatan & Latensi**:
   - Panggilan REST API lokal/staging memiliki response time $\le 200\text{ ms}$ pada $P_{95}$.
   - Perpindahan antar tab layar POS kasir berlangsung mulus tanpa reload halaman ($< 100\text{ ms}$).
2. **Ketahanan Cetak Struk (Thermal Printing Resilience)**:
   - Apabila koneksi printer thermal Bluetooth/USB terputus, sistem menyimpan antrean print (*spooler*) dan memberikan tombol `[Cetak Ulang Struk]` yang dapat diakses kapan saja dari histori transaksi kasir.
3. **Data Integrity & Concurrency**:
   - Transaksi pemotongan stok bahan baku di database dibungkus dalam blok `ACID Transaction` (`BEGIN ... COMMIT`) untuk mencegah *race condition* bila 2 pesanan terjadi pada detik yang sama.
4. **Mobile Performance (Mode 4 Flutter)**:
   - Target rendering: Stable 60 FPS pada perangkat Android 10+ dan iOS 15+.
   - Ukuran bundel binary APK release $\le 28\text{ MB}$, mendukung arsitektur `armeabi-v7a`, `arm64-v8a`, dan `x86_64`.
   - CI/CD otomatis di GitHub Actions menghasilkan artifact APK & IPA siap sideload saat commit di-push.

---

## 11. STRUKTUR ARTIFAK & HANDOFF KE SOFTWARE TEAM

Dokumen ini menjadi rujukan tunggal (*Single Source of Truth*) bagi tim rekayasa software berikutnya:
1. **Lead Architect / Backend Engineer**: Mengimplementasikan `schema.sql`, `seed.sql`, model data, dan seluruh endpoint REST API per role beserta JWT RBAC middleware.
2. **Frontend UI/UX Engineer**: Merancang dashboard responsive SPA berbasis Tailwind CSS dengan Glassmorphism, Floating Role Switcher, Layar POS Cepat, dan Custom Cake Order Taker.
3. **Mobile Flutter Engineer**: Membangun client cross-platform iOS & Android dengan alur katalog, order tracking, dan CI/CD GitHub Actions workflow.
4. **QA / Tester**: Menguji seluruh skenario Acceptance Criteria Gherkin di Bab 8 secara manual dan otomasi end-to-end.
