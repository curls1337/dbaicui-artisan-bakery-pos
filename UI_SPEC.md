# UI/UX & ART DIRECTION SPECIFICATION
## D'BAI CUI ARTISAN BAKERY & CAKE MANAGEMENT SYSTEM
**Document ID:** `UI-SPEC-DBC-2026-001`  
**Profile / Role:** `team-ux-ui` (UX/UI Designer & Art Director)  
**Project Slug:** `saint-sejarah-firaun`  
**Workspace Path:** `/home/devcurl/workspace/saint-sejarah-firaun`  
**Target Environment:** Mode 3 Hybrid Staging Showcase SPA (`https://webui.5nod.com/staging/saint-sejarah-firaun/`) & Mode 4 Cross-Platform Mobile (iOS 17+ & Android 14 Flutter)  
**Status:** APPROVED & READY FOR ENGINEERING IMPLEMENTATION  

---

## 1. DESIGN BRIEF (8 UNSUR FUNDAMENTAL)

| No | Unsur Design Brief | Spesifikasi Art Direction & UX D'Bai Cui |
| :---: | :--- | :--- |
| **1** | **Konteks Proyek** | Sistem manajemen bakery artisan, patisserie, bespoke custom cake, dan kasir POS ritel multi-peran (Owner, Kitchen Head, Kasir POS, Pelanggan VIP). Mengintegrasikan kalkulasi HPP presisi, rotasi bahan FEFO, antrean oven 3 unit, pencatatan pesanan kue custom, cetak struk thermal 58mm/80mm, serta simulator mobile responsif. |
| **2** | **Target Pengguna** | 1. **Executive Owner**: Membutuhkan data agregat laba-rugi (P&L), HPP, dan performa omzet dalam sekali lirik.<br>2. **Store Manager / Chef Kitchen**: Bekerja di dapur panas/sibuk, butuh kontras tinggi, tombol besar tahan sentuhan tepung/sarung tangan, timer oven visual.<br>3. **Kasir Front-Desk**: Membutuhkan kecepatan tender < 12 detik, keypad PIN cepat, anti-clipping kartu kue, dan pencegah salah ketik ucapan kue.<br>4. **Pelanggan VIP / Member**: Menginginkan impresi mewah *quiet luxury*, kemudahan lacak status kue custom real-time, dan transparansi poin. |
| **3** | **Vibe & Mood** | *Artisan Warm Luxury, Parisian Elegance, Tactile Warmth, Quiet Luxury Hospitality*. Memberikan rasa hangat toko roti butik Eropa berkelas tinggi (seperti aroma mentega Normandia panggang dan cokelat couverture), berpadu dengan ketepatan arsitektural Swiss/Linear. |
| **4** | **Referensi Visual** | *The Harvest Patisserie*, *Monsieur Spoon*, *Tous Les Jours*, *Linear App* (untuk micro-interactions & keyboard navigation), *Apple HIG iOS 17+* (Dynamic Island, squircle cards), dan *Google Material 3* (tonal elevation, expressive shape). |
| **5** | **Palet Warna Utama** | - **Velvet Rose (`#881337`)**: Aksen primer dramatis, status eksklusif, tombol aksi utama.<br>- **Warm Gold (`#D97706`)**: Aksen sekunder mewah, tier VIP, indikator oven aktif, highlight tombol konfirmasi.<br>- **Cashmere Canvas (`#FAF8F5`)**: Latar belakang utama bernuansa hangat, ramah di mata, tekstur tepung lembut.<br>- **Deep Espresso (`#1E1B18`)**: Warna teks primer berbobot tinggi, header pekat, kontras ekstrem tanpa hitam mentah. |
| **6** | **Tipografi** | - **Display & Editorial Accents**: *Playfair Display* / *Cormorant Garamond* (Weight 600 SemiBold / 700 Bold) untuk nama toko, headline produk signature, dan kartu loyalitas VIP.<br>- **UI & Body Standard**: *Plus Jakarta Sans* (Weight 400 Regular, 500 Medium, 600 SemiBold, 700 Bold) untuk tombol, input form, label POS, dan bento card.<br>- **Telemetry, Numpad & Thermal Monospace**: *JetBrains Mono* / *Courier New* (Weight 600 SemiBold, 700 Bold) untuk harga, hitung mundur oven, PIN kasir, dan format ESC/POS. |
| **7** | **Struktur Tata Letak** | 1. **Desktop / Tablet POS**: Fixed left vertical sidebar navigation (68px collapsed / 240px expanded), Top Bar dengan Floating Quick Role Switcher, Main Content Grid responsif, dan Persistent Checkout Drawer (POS).<br>2. **Mobile Client / Simulator**: Bingkai ganda (iPhone 15 Pro & Android M3) dengan Dynamic Island / Punch Hole, Floating Frosted Glass Bottom Tab Bar, dan Interactive Modal Bottom Sheet CRUD. |
| **8** | **Hal yang Dihindari** | - Dilarang menggunakan warna neon jenuh atau abu-abu dingin korporat (#F3F4F6 dingin).<br>- Dilarang membiarkan kartu produk terpotong (anti-clipping min-h 225px wajib dipatuhi).<br>- Dilarang menggunakan border stripe/gradasi pada struk thermal (wajib zero grayscale ESC/POS).<br>- Dilarang antarmuka 1 layar polos pada simulator mobile (wajib 5 layar komersial).<br>- Dilarang tombol interaktif lebih kecil dari 44x44 pt. |

---

## 2. DESIGN SYSTEM & DESIGN TOKENS (ARTISAN WARM LUXURY)

### 2.1 Token Warna Semantik (Semantic Colors)

```css
:root {
  /* Surface & Base Canvas */
  --color-canvas-primary:       #FAF8F5; /* Cashmere Canvas (Warm Alabaster) */
  --color-canvas-secondary:     #F3EFEA; /* Soft Oat Flour Background */
  --color-surface-card:         #FFFFFF; /* Pure White Elevated Card */
  --color-surface-elevated:     #FDFCFB; /* Floating Overlay / Sheet */
  --color-surface-glass:        rgba(250, 248, 245, 0.85); /* Frosted Blur */

  /* Text & Inks */
  --color-ink-primary:          #1E1B18; /* Deep Espresso Charcoal */
  --color-ink-secondary:        #57534E; /* Warm Stone Muted */
  --color-ink-tertiary:         #8C857E; /* Soft Biscuit Biscuit Inactive */
  --color-ink-inverse:          #FFFFFF; /* Pure Contrast Ink */

  /* Brand Accents */
  --color-brand-velvet:         #881337; /* Velvet Rose 900 (High-Luxury Primary) */
  --color-brand-velvet-hover:   #70102D; /* Deeper Velvet Dark */
  --color-brand-velvet-subtle:  #FFF1F2; /* Velvet Tint 50 (Soft Badge) */
  --color-brand-gold:           #D97706; /* Warm Artisan Gold (Secondary) */
  --color-brand-gold-hover:     #B45309; /* Deep Amber Gold */
  --color-brand-gold-subtle:    #FEF3C7; /* Amber Tint 50 (Gold Highlight) */

  /* Functional Status Indicators */
  --color-status-success:       #15803D; /* Fresh Green (Oven Ready / Lunas) */
  --color-status-success-bg:    #F0FDF4;
  --color-status-warning:       #D97706; /* Amber Warning (Oven Proofing / H-7 Expiry) */
  --color-status-warning-bg:    #FFFBEB;
  --color-status-danger:        #BE123C; /* Crimson Danger (Kritis Expiry < 3 Hari / Overdue) */
  --color-status-danger-bg:     #FFF1F2;
  --color-status-info:          #0369A1; /* Bakery Water Blue (Queue Status) */
  --color-status-info-bg:       #F0F9FF;

  /* Borders & Dividers */
  --color-border-subtle:        #E7E1D8; /* Warm Biscuit Border */
  --color-border-strong:        #D6CDC0; /* Crisp Card Separator */
  --color-border-focused:       #881337; /* Velvet Ring on Focus */
}
```

### 2.2 Uji Rasio Kontras Aksesibilitas (WCAG 2.1 Compliance)

| Komponen & Teks | Foreground Hex | Background Hex | Rasio Kontras | Standar Target | Status Kepatuhan |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Headline Primer pada Cashmere Canvas** | `#1E1B18` | `#FAF8F5` | **15.2 : 1** | 4.5:1 (Normal Text AA) | **PASS (AAA)** |
| **Tombol Velvet Primary (Teks Putih)** | `#FFFFFF` | `#881337` | **7.8 : 1** | 4.5:1 (Normal Text AA) | **PASS (AAA)** |
| **Badge Warm Gold (Teks Deep Espresso)** | `#1E1B18` | `#FEF3C7` | **12.4 : 1** | 4.5:1 (Normal Text AA) | **PASS (AAA)** |
| **Tombol Quick Tender Gold (Teks Putih)**| `#FFFFFF` | `#B45309` | **4.9 : 1** | 4.5:1 (Normal Text AA) | **PASS (AA)** |
| **Muted Secondary Text pada Kartu Putih**| `#57534E` | `#FFFFFF` | **7.1 : 1** | 4.5:1 (Normal Text AA) | **PASS (AAA)** |
| **Struk Kasir Thermal ESC/POS** | `#000000` | `#FFFFFF` | **21.0 : 1** | 7.0:1 (High Contrast) | **PASS (AAA Max)** |

### 2.3 Tipografi & Skala Spasial

| Token Style | Family | Weight | Size | Line Height | Letter Spacing | Penggunaan |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `display-brand` | Playfair Display | 700 Bold | `32px` | `1.2` | `-0.02em` | Nama Toko D'Bai Cui & Header Eksekutif |
| `heading-1` | Plus Jakarta Sans | 700 Bold | `24px` | `1.25` | `-0.015em` | Judul Layar & Kartu Hero Bento |
| `heading-2` | Plus Jakarta Sans | 600 SemiBold | `18px` | `1.3` | `-0.01em` | Header Section & Nama Produk POS |
| `body-base` | Plus Jakarta Sans | 400 Regular | `14px` | `1.45` | `0` | Paragraf, Keterangan Form, Riwayat |
| `body-medium` | Plus Jakarta Sans | 500 Medium | `14px` | `1.45` | `0` | Nilai Input, Item Keranjang |
| `label-caps` | Plus Jakarta Sans | 700 Bold | `11px` | `1.0` | `+0.08em` | Badge Status, Kategori Pill, Table Header |
| `telemetry-mono`| JetBrains Mono | 600 SemiBold | `15px` | `1.2` | `-0.02em` | Harga IDR, Timer Oven, Numpad PIN, Struk |

### 2.4 Radius Sudut, Elevasi & Bayangan (Shadows & Radii)

- **Radius Sudut (*Border Radius*)**:
  - `radius-sm`: `6px` (Badge kecil, checkbox, tooltip).
  - `radius-md`: `12px` (Input text field, tombol sekunder, chip kategori).
  - `radius-lg`: `18px` (Kartu produk POS, modal dialog, panel resep).
  - `radius-xl`: `24px` (Kartu Bento KPI Hero, Bottom Sheet modal, frame device).
  - `radius-pill`: `9999px` (Status badges, Quick Role Switcher pills, tab toggle).
- **Elevasi & Bayangan Lembut (*Warm Luxury Shadows*)**:
  - `elevation-flat`: `0 0 0 1px #E7E1D8` (Border inline tanpa bayangan).
  - `elevation-card`: `0 2px 8px -1px rgba(30, 27, 24, 0.04), 0 0 0 1px rgba(231, 225, 216, 0.8)` (Kartu default).
  - `elevation-hover`: `0 12px 24px -4px rgba(136, 19, 55, 0.08), 0 0 0 1px #881337` (State interaktif aktif).
  - `elevation-sheet`: `0 -8px 32px rgba(30, 27, 24, 0.12), 0 0 0 1px #E7E1D8` (Modal Bottom Sheet).

---

## 3. WIREFRAME & USER FLOW 4 ROLE

### 3.1 Layar 1: Dual-Mode Login + Floating Quick Role Switcher Bar

Layar autentikasi mendukung 2 mode utama dalam 1 antarmuka elegan:
1. **Mode A (Standar Email & Password)**: Untuk Owner, Kitchen Head, dan Pelanggan VIP.
2. **Mode B (Cashier 4-Digit Quick PIN Keypad)**: Untuk Kasir front-desk agar pergantian shift berlangsung < 2 detik.
3. **Floating Quick Role Switcher Bar**: Berada di bagian atas tengah layar untuk kebutuhan demonstrasi hybrid staging (1-klik switch sesi).

```
+---------------------------------------------------------------------------------------------------------+
|                                    [ FLOATING QUICK ROLE SWITCHER BAR ]                                  |
|   [👑 Owner (Richard)]     [👨‍🍳 Kitchen (Pierre)]     [🏷️ Kasir (Maya)]     [👤 VIP Member (Sarah)]    |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|                                        D'BAI CUI ARTISAN BAKERY                                         |
|                                     -- Haute Patisserie & Cake --                                       |
|                                                                                                         |
|                            +-----------------------------------------------+                            |
|                            |    [  Email & Sandi  ]    [ 🏷️ Kasir PIN ]    |  <-- Dual-Mode Tab Switch  |
|                            +-----------------------------------------------+                            |
|                            |                                               |                            |
|                            |  [MODE A: EMAIL & PASSWORD]                   |                            |
|                            |  Email Pengguna                               |                            |
|                            |  [ owner@dbaicui.com                        ] |                            |
|                            |  Kata Sandi                                   |                            |
|                            |  [ •••••••••••••••                      (👁️) ] |                            |
|                            |  [X] Ingat perangkat ini                      |                            |
|                            |  +-----------------------------------------+  |                            |
|                            |  |       MASUK KE SISTEM D'BAI CUI         |  |  <-- #881337 Velvet Rose   |
|                            |  +-----------------------------------------+  |                            |
|                            |  - ATAU -                                     |                            |
|                            |  [MODE B: 4-DIGIT QUICK PIN TERMINAL]         |                            |
|                            |  Pilih Kasir: [ Maya Anggraini (Shift Pagi) v]|                            |
|                            |  Masukkan PIN: [ • ] [ • ] [ • ] [ • ]        |                            |
|                            |  +-----------------------------------------+  |                            |
|                            |  |   [ 1 ]       [ 2 ]       [ 3 ]         |  |                            |
|                            |  |   [ 4 ]       [ 5 ]       [ 6 ]         |  |  <-- Touchscreen Keypad|
|                            |  |   [ 7 ]       [ 8 ]       [ 9 ]         |  |      min 56px per key  |
|                            |  |   [ C ]       [ 0 ]       [ ⌫ ]         |  |                            |
|                            |  +-----------------------------------------+  |                            |
|                            +-----------------------------------------------+                            |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

---

### 3.2 Layar 2: Owner Executive Dashboard (Bento KPI Grid & P&L Analytics)

Dirancang untuk pemilik bisnis: menyajikan rasio omzet, HPP, margin laba bersih, 4 unit Bento Card metrik utama, grafik tren omzet 7 hari terakhir, dan top produk best-seller.

```
+---------------------------------------------------------------------------------------------------------+
| [D'BAI CUI]  [Dashboard P&L]  [BOM & HPP]  [Laporan Kasir]  [User & Hak Akses]  | Maya (Kasir) [Logout] |
+---------------------------------------------------------------------------------------------------------+
|  Ringkasan Eksekutif Hari Ini (Senin, 09 Nov 2026)                      [Filter: Hari Ini v] [📥 Export]|
|                                                                                                         |
|  +-----------------------------+ +-----------------------------+ +-----------------------------------+  |
|  | HERO METRIC: TOTAL OMZET    | | TOTAL HPP / COGS            | | LABA BERSIH ESTIMASI (NET)        |  |
|  | Rp 14.850.000               | | Rp 4.900.500 (33.0%)        | | Rp 9.949.500 (67.0%)              |  |
|  | ▲ +18.4% vs kemarin         | | ▼ HPP efisien (-2.1%)       | | ▲ Rekor margin minggu ini         |  |
|  +-----------------------------+ +-----------------------------+ +-----------------------------------+  |
|                                                                                                         |
|  BENTO GRID ANALYTICS (2x2 Expanded):                                                                   |
|  +--------------------------------------------------+ +-----------------------------------------------+ |
|  | TREN PENJUALAN 7 HARI (Chart.js Line)            | | KOMPOSISI PRODUK TERLARIS (Top 5 Best-Seller) | |
|  | 16M |            .-.                             | | 1. Croissant Almond      : 84 pcs (Rp 2.688k) | |
|  | 12M |     .-.   /   \    .-.                     | | 2. Signature Opera Cake  : 14 pcs (Rp 6.300k) | |
|  |  8M | .--/   \-/     \--/   \                    | | 3. SF Sourdough Loaf     : 38 pcs (Rp 1.710k) | |
|  |  4M |/                       \                   | | 4. Pain Au Chocolat      : 42 pcs (Rp 1.260k) | |
|  |  0M +---------------------------                 | | 5. Classic Red Velvet    :  6 pcs (Rp 2.280k) | |
|  |     Sen Sel Rab Kam Jum Sab Min                  | |                                               | |
|  +--------------------------------------------------+ +-----------------------------------------------+ |
|  | STATUS KAS & DRAWER POS                          | | PERINGATAN BIAYA & WASTE BAHAN                | |
|  | Saldo Awal Drawer : Rp  1.500.000                | | [!] Telur Omega (< 11 hari lagi kedaluwarsa)  | |
|  | Transaksi Tunai   : Rp  4.800.000                | | [!] Mentega Anchor (Stok 4.2 kg < Min 5.0 kg) | |
|  | Transaksi QRIS    : Rp  7.950.000                | | Estimasi Waste Tercegah FEFO: Rp 1.450.000    | |
|  | Total Kas Aktual  : Rp  6.300.000 [Balance MATCH]| | Rekomendasi: Panggang 2 Batch Croissant Siang | |
|  +--------------------------------------------------+ +-----------------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
```

---

### 3.3 Layar 3: Store Manager & Kitchen Display (Status Oven 3 Unit, Antrean & FEFO)

Dirancang tahan banting untuk layar tablet dapur: memantau status fisik 3 unit oven industri secara real-time, antrean resep adonan, dan persediaan bahan baku dengan indikator FEFO.

```
+---------------------------------------------------------------------------------------------------------+
| [D'BAI CUI KITCHEN]  Oven Active: 3/3 | Batch Queue: 4 Menunggu | Suhu Ruang: 22°C  [ Pierre (Chef) v ] |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  UNIT OVEN MONITOR (3 UNIT DECK INDUSTRI):                                                              |
|  +---------------------------+ +---------------------------+ +---------------------------------------+  |
|  | OVEN #1: STONE DECK       | | OVEN #2: CONVECTION DECK  | | OVEN #3: ROTARY PASTRY DECK           |  |
|  | Suhu Target : 230°C       | | Suhu Target : 185°C       | | Suhu Target : 160°C                   |  |
|  | Suhu Aktual : 231°C [OK]  | | Suhu Aktual : 184°C [OK]  | | Suhu Aktual : 160°C [OK]              |  |
|  | Batch: Sourdough (Batch 2)| | Batch: Croissant (Batch 4)| | Batch: Opera Sponge (Custom Cake #42) |  |
|  | [ TIMER: 14:22 MENIT ]    | | [ TIMER: 03:45 MENIT ]    | | [ TIMER: 22:10 MENIT ]                |  |
|  | Status: [ BAKING ] (Gold) | | Status: [ READY DUSTING ] | | Status: [ PRE-HEATING ]               |  |
|  | [ Selesaikan & Keluarkan ]| | [ Selesai -> Cooling Rack]| | [ Masukkan Loyang ]                   |  |
|  +---------------------------+ +---------------------------+ +---------------------------------------+  |
|                                                                                                         |
|  ANTREAN PRODUKSI HARIAN (PRODUCTION PIPELINE):                                                         |
|  +---------------------------------------------------------------------------------------------------+  |
|  | ID Batch      | Produk              | Target Qty | Jadwal Mulai | Status Tahapan     | Aksi       |  |
|  |---------------+---------------------+------------+--------------+--------------------+------------|  |
|  | OVN-261109-01 | Artisan Sourdough   | 24 Loaves  | 06:00 WIB    | [✔ Selesai Etalase]| [Detail]   |  |
|  | OVN-261109-02 | Croissant Almond    | 24 Pcs     | 08:30 WIB    | [ BAKING 80% ]     | [Buka Oven]|  |
|  | OVN-261109-03 | Pain Au Chocolat    | 24 Pcs     | 10:00 WIB    | [ Proofing 35°C ]  | [Mulai Ovn]|  |
|  | OVN-261109-04 | Custom Opera Cake   | 1 Unit     | 11:15 WIB    | [ Persiapan Bahan] | [PotongBOM]|  |
|  +---------------------------------------------------------------------------------------------------+  |
|                                                                                                         |
|  INVENTARIS BAHAN BAKU KRITIS & FEFO TRACKER:                                                           |
|  +---------------------------------------------------------------------------------------------------+  |
|  | Bahan Baku             | Stok Saat Ini | Satuan | Kedaluwarsa Terdekat | Indikator FEFO | Status     |  |
|  |------------------------+---------------+--------+----------------------+----------------+------------|  |
|  | Telur Omega Pasteuris  | 48            | butir  | 2026-11-20 (H-11)    | [ KUNING FEFO ]| Wajib Pakai|  |
|  | Anchor Croissant Sheet | 4.200         | gram   | 2027-03-20           | [ HIJAU AMAN ] | Normal     |  |
|  | Callebaut 811 54.5%    | 12.500        | gram   | 2027-08-10           | [ HIJAU AMAN ] | Normal     |  |
|  | Elle & Vire Whip Cream | 2.100         | ml     | 2026-11-13 (H-4)     | [ MERAH KRITIS]| Expire Soon|  |
|  +---------------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------------+
```

---

### 3.4 Layar 4: Kasir POS Screen (Anti-Clipping Catalog, Custom Cake & Quick Tender)

Layar POS Kasir dirancang sesuai standar **Quiet Luxury POS**:
- Tata letak **Vertical Sidebar** & grid katalog 3-kolom.
- **Anti-clipping min-h 225px** pada setiap kartu produk agar gambar, nama produk 2-baris, badge HPP, stok, dan tombol tambah tidak pernah bertumpuk.
- Panel pesanan custom cake terintegrasi (tulisan ucapan, lilin angka, jam pickup).
- Panel kalkulator **Quick Tender** pembayaran tunai pecahan uang kertas Indonesia (50k, 100k, 200k) dan QRIS dinamis.

```
+---------------------------------------------------------------------------------------------------------+
| [D'BAI CUI POS]  Kasir: Maya A. | Shift Pagi | Mode Toko: Dine-in / Takeaway      [🔒 Kunci PIN (Shift)]|
+------------------------------------+--------------------------------------------------------------------+
| KATALOG PRODUK (Grid Anti-Clipping)| KERANJANG TRANSAKSI #DBC-20261109-0042                             |
| Filter: [Semua] [Croissant] [Cake] | Pelanggan: [ Sarah Wijaya (VIP Platinum - Diskon 5%)        (x) ]  |
| Pencarian: [ Cari kue / SKU...   ] | ------------------------------------------------------------------ |
|                                    | 1. Croissant Almond Premium                    1 x Rp  32.000  (🗑️)|
| +--------------------------------+ | 2. Artisan Sourdough Loaf                      1 x Rp  45.000  (🗑️)|
| | [GAMBAR FOTO 16:10 KUE]        | | 3. Signature Opera Cake 20x20 cm               1 x Rp 450.000  (🗑️)|
| | Croissant Almond Premium       | |    - Ucapan: "Happy 25th Sarah!"                                   |
| | Flaky butter with almond cream | |    - Lilin: Lilin Angka [2] dan [5] (+Rp 24.000)                   |
| | Rp 32.000  | Stok: 18 pcs      | |    - Jadwal Pickup: 10 Nov 2026 @ 15:00 WIB                        |
| | [+ Tambah ke Keranjang]        | | ------------------------------------------------------------------ |
| +--------------------------------+ | Subtotal                                       : Rp 551.000        |
| (Tinggi Kartu: 236px >= min 225px) | Diskon Member VIP (5%)                         : -Rp  27.550        |
|                                    | PB1 / Pajak Restoran (10%)                     : Rp  52.345        |
| +--------------------------------+ | ------------------------------------------------------------------ |
| | [GAMBAR FOTO 16:10 KUE]        | | TOTAL PEMBAYARAN                             : Rp 575.795        |
| | Signature Opera Cake 20x20     | |                                                                  |
| | Joconde, Espresso, Ganache     | | METODE PEMBAYARAN:                                               |
| | Rp 450.000 | Pre-Order Ready   | | [  📱 QRIS Dinamis  ]   [  💵 TUNAI / CASH  ]   [  💳 EDC DEBIT  ] |
| | [🎂 Buka Form Custom Cake]     | |                                                                  |
| +--------------------------------+ | KALKULATOR TENDER CEPAT TUNAI:                                     |
|                                    | [ Rp 576.000 (Pas) ]   [ Rp 600.000 (3x 200k) ]   [ Rp 1.000.000 ] |
| +--------------------------------+ | [ Rp 50.000 ]          [ Rp 100.000 ]             [ Input Bebas]   |
| | [GAMBAR FOTO 16:10 KUE]        | | Uang Diterima : [ Rp 600.000                                     ] |
| | Artisan San Francisco Sourdough| | Kembalian     : Rp 24.205  (Font Hijau Tebal 20px)                 |
| | 36-hr cold fermentation        | | ------------------------------------------------------------------ |
| | Rp 45.000  | Stok: 8 pcs       | | [🖨️ BAYAR & CETAK STRUK 58mm]     [💬 KIRIM STRUK WHATSAPP]       |
| | [+ Tambah ke Keranjang]        | | (Tombol Aksi Utama: #881337 Velvet Rose, Tinggi 54px, Full Width)  |
+------------------------------------+--------------------------------------------------------------------+
```

#### Modal Pop-Up: Custom Cake Order Taker
Ketika tombol `[🎂 Buka Form Custom Cake]` ditekan, pop-up modal terbuka di tengah layar:
- **Pilihan Varian Ukuran**: `[ Bulat 16cm ]` `[ Bulat 20cm (Standar) ]` `[ Bulat 24cm ]` `[ Persegi 30x30cm ]`.
- **Wording on Cake (Ucapan di Kue)**: Input teks (Maks. 45 Karakter) dengan counter karakter real-time + pilihan warna krim tulisan (`Emas`, `Cokelat Tua`, `Merah Muda`, `Putih`).
- **Pilihan Lilin**:
  - `(o) Lilin Batang Ulir Gratis (2 pcs)`.
  - `(o) Lilin Angka Emas (+Rp 12.000 / angka)` -> Dropdown Angka 1: `[ 2 ]`, Dropdown Angka 2: `[ 5 ]`.
- **Jadwal Pengambilan (Pickup Slot)**:
  - Date Picker: `10/11/2026`.
  - Jam Slot: `[ 10:00 - 12:00 ]` `[ 12:00 - 15:00 ]` `[ 15:00 - 18:00 (Dipilih) ]` `[ 18:00 - 21:00 ]`.
- **Tipe Pembayaran Kue Custom**: `[ Pembayaran Lunas 100% ]` atau `[ DP Minimal 50% (Rp 225.000) ]`.
- **Catatan Khusus**: Textarea untuk alergi kacang, gluten, preferensi hiasan fondant.

---

### 3.5 Layar 5: Customer VIP Portal (Katalog, Lacak Status Kue & Poin Loyalitas)

Antarmuka ramah mobile untuk pelanggan setia D'Bai Cui:

```
+---------------------------------------------------------------------------------------------------------+
| [D'BAI CUI VIP CLUB]  Halo, Sarah Wijaya (VIP Platinum)  | Poin: 420 Pts (Rp 42.000)  | [Riwayat / Profil]|
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  KARTU LOYALITAS DIGITAL (MEMBER VIP CARD - GOLD/PLATINUM FOIL GRADIENT):                               |
|  +---------------------------------------------------------------------------------------------------+  |
|  |  D'BAI CUI ARTISAN PATISSERIE                     TIER: PLATINUM MEMBER                           |  |
|  |  SARAH WIJAYA                                     POIN REWARD: 420 PTS                            |  |
|  |  ID: DBC-VIP-889921                              Potongan Belanja Tersedia: Rp 42.000             |  |
|  |  Perks: Diskon Otomatis 5% + Free Birthday Pastry + Akses Pre-Order 24 Jam                        |  |
|  +---------------------------------------------------------------------------------------------------+  |
|                                                                                                         |
|  STATUS PESANAN AKTIF (LIVE TRACKING TIMELINE):                                                         |
|  Pesanan #DBC-20261109-0042: Signature Opera Cake 20x20 cm                                              |
|  Pengambilan: Besok, 10 Nov 2026 @ 15:00 WIB di Outlet Kebayoran Baru                                   |
|                                                                                                         |
|  (✔ Diterima) === (✔ Antrean Oven) === (✔ Baking Selesai) === [● SEDANG DEKORASI] === ( Siap Diambil )  |
|      14:32              16:00                 18:15                SEKARANG (19:40)          Est 10 Nov |
|                                                                                                         |
|  Catatan Chef: "Base cake telah dingin sempurna, sedang proses pelapisan ganache & piping kaligrafi emas" |
|  [💬 Hubungi Pastry Chef via WhatsApp]   [📄 Lihat Struk Digital E-Receipt]                             |
|                                                                                                         |
|  KATALOG PRODUK FAVORIT ANDA (REPEAT ORDER INSTAN):                                                     |
|  +-----------------------+ +-----------------------+ +-----------------------+ +---------------------+  |
|  | [Croissant Almond]    | | [Valrhona Macaron]    | | [Vanilla Eclair]      | | [Artisan Baguette]  |  |
|  | Rp 32.000             | | Rp 95.000 (Box 6)     | | Rp 38.000             | | Rp 28.000           |  |
|  | [Pesan Lagi Cepat]    | | [Pesan Lagi Cepat]    | | [Pesan Lagi Cepat]    | | [Pesan Lagi Cepat]  |  |
|  +-----------------------+ +-----------------------+ +-----------------------+ +---------------------+  |
+---------------------------------------------------------------------------------------------------------+
```

---

## 4. THERMAL RECEIPT UI & ESC/POS STYLING (58MM & 80MM)

### 4.1 Standar Struk Cetak Kasir Anti-Gagal (Quiet Luxury Thermal)
1. **Zero Grayscale (100% Monokrom murni)**:
   - Dilarang keras menggunakan rastering abu-abu (*halftone dots*) karena jarum print head thermal akan menghasilkan titik buram dan memperlambat pemrosesan.
   - Semua elemen murni hitam (`#000000`) di atas kertas thermal putih murni (`#FFFFFF`).
2. **Anti-Border Stripe**:
   - Garis pemisah menggunakan karakter teks ASCII solid atau putus-putus (`--------------------------------` atau `================================`). Dilarang memakai tag HTML `border: 1px solid gray` yang bergaris tebal pada printer ESC/POS.
3. **Kerapatan Karakter Standar Industri**:
   - **58mm Printer**: Tepat **32 Karakter per baris** (Font A: 12x24 dots).
   - **80mm Printer**: Tepat **48 Karakter per baris** (Font A: 12x24 dots).
4. **WhatsApp E-Receipt Share**:
   - Tautan langsung tombol WhatsApp Web/API yang menghasilkan teks struk rapi berformat monospace Markdown (*triple backticks* ```).

### 4.2 Template Layout 58mm (Lebar 32 Karakter)
```text
================================
       D'BAI CUI ARTISAN        
      BAKERY & PATISSERIE       
  Jl. Patisserie No. 88, Jkt    
      Telp: 021-78901234        
================================
No   : DBC-20261109-0042        
Tgl  : 09/11/2026 14:32 WIB     
Kasir: Maya (Shift Pagi)        
Cust : Sarah Wijaya (VIP)       
--------------------------------
1x Croissant Almond     32.000  
1x Artisan Sourdough    45.000  
1x Custom Cake 20cm    450.000  
   *Ucapan: HBD Sarah 25th*     
   *Lilin Angka: [2] [5]*       
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
       PEMBAYARAN LUNAS         
  Simpan Struk Untuk Pengambilan
  Follow IG: @dbaicui.artisan   
================================
```

### 4.3 Template Layout 80mm (Lebar 48 Karakter)
```text
================================================
              D'BAI CUI ARTISAN                 
             BAKERY & PATISSERIE                
     Jl. Patisserie No. 88, Jakarta Selatan     
               Telp: 021-78901234               
================================================
No Transaksi : DBC-20261109-0042                
Waktu Cetak  : 09/11/2026 14:32:18 WIB          
Kasir POS    : Maya Anggraini (Terminal #02)    
Pelanggan    : Sarah Wijaya (VIP Platinum Member)
------------------------------------------------
Item Produk                 Qty   Harga    Total
------------------------------------------------
Croissant Almond Premium     1   32.000   32.000
Artisan SF Sourdough Loaf    1   45.000   45.000
Signature Opera Cake 20cm    1  450.000  450.000
 * Pesan Kue : "Happy 25th Birthday Sarah!"     
 * Aksesoris : Lilin Angka Emas [2] & [5]       
 * Jadwal Ambil: 10 Nov 2026, Pukul 15:00 WIB   
------------------------------------------------
Subtotal Penjualan                     Rp 527.000
Potongan Diskon Member VIP (5%)       -Rp  26.350
Pajak Restoran PB1 (10%)               Rp  50.065
------------------------------------------------
TOTAL TAGIHAN AKHIR                    Rp 550.715
METODE PEMBAYARAN: TUNAI (CASH)        Rp 600.000
UANG KEMBALIAN KASIR                   Rp  49.285
------------------------------------------------
Ringkasan Program Loyalitas VIP:                
- Poin Didapatkan Transaksi Ini : +55 Poin      
- Total Akumulasi Poin Reward   : 420 Poin      
- Nilai Voucher Poin Tersedia   : Rp 42.000     
================================================
           TERIMA KASIH ATAS KUNJUNGAN          
     Kue Menggunakan 100% French Butter Murni   
       Instagram & TikTok: @dbaicui.artisan     
================================================
```

### 4.4 WhatsApp E-Receipt Payload Generator (Spesifikasi URL)
URL WhatsApp dibentuk secara dinamis dari frontend POS:
`https://api.whatsapp.com/send?phone=6281299887766&text={ENCODED_MESSAGE}`

Format pesan dienkripsi URL dengan format teks bersih:
```text
*STRUK DIGITAL D'BAI CUI ARTISAN BAKERY*
No: DBC-20261109-0042
Yth. Ibu Sarah Wijaya (VIP Platinum)

Detail Pesanan:
- 1x Croissant Almond Premium: Rp 32.000
- 1x Artisan Sourdough Loaf: Rp 45.000
- 1x Signature Opera Cake 20cm: Rp 450.000
  (Ucapan: "Happy 25th Sarah!" | Lilin: 2 & 5)
  (Jadwal Ambil: 10 Nov 2026 @ 15:00 WIB)

*Total Tagihan: Rp 550.715 (LUNAS - Tunai)*
Bonus Poin: +55 Poin (Total: 420 Pts)

Pantau progres dekorasi kue Anda secara live:
https://webui.5nod.com/staging/saint-sejarah-firaun/#/track/DBC-20261109-0042
```

---

## 5. INTERACTIVE MOBILE SIMULATOR SPECIFICATION

Simulator mobile responsif dibangun di direktori web staging `/staging/saint-sejarah-firaun/index.html` dan menyediakan **Dual-Frame Hardware Simulation** (*iPhone 15 Pro iOS 17* dan *Android Material Design 3*).

### 5.1 Spesifikasi Bingkai Perangkat (Hardware Frames)

| Spesifikasi | Bingkai iPhone 15 Pro (iOS 17+) | Bingkai Android Flagship (Material 3) |
| :--- | :--- | :--- |
| **Dimensi Bingkai** | `393px × 852px` (Viewport CSS) | `412px × 892px` (Viewport CSS) |
| **Border & Bezel** | Bezel Titanium `12px`, `border-radius: 54px`, shadow `0 25px 60px rgba(0,0,0,0.35)` | Bezel Matte Alumunium `10px`, `border-radius: 40px`, shadow `0 20px 50px rgba(0,0,0,0.28)` |
| **Top Notch / Cutout**| **Interactive Dynamic Island** (`126px × 36px` pill hitam dengan status baking oven) | **Center Punch Hole Camera** (`14px × 14px` lingkaran hitam minimalis) |
| **Status Bar Atas** | Jam iOS (`9:41`), Cellular 5G, Wi-Fi, Baterai 100% | Jam Android (`10:00`), Ikon Notifikasi M3, Wi-Fi, Baterai Pill |
| **Indikator Bawah** | **iOS Home Indicator Bar** (`134px × 5px` pill rounded putih/gelap di dasar layar) | **Android 3-Button / Gesture Bar** minimalis |
| **Toggle Switcher** | Tombol di atas simulator: `[ 📱 Switch to iPhone 15 Pro ]` ↔ `[ 🤖 Switch to Android M3 ]` |

### 5.2 Arsitektur 5 Layar Komersial Mobile Terintegrasi

Sesuai standar skill `mobile-premium-ui-ux`, simulator wajib memuat alur lengkap:

```
+---------------------------------------------------------------------------------------+
|                       INTERACTIVE MOBILE DEVICE SIMULATOR BAR                         |
|   Device: [ (o) iPhone 15 Pro  |  ( ) Android M3 ]    Role: [ 👑 Owner | 🏷️ Kasir ]   |
+---------------------------------------------------------------------------------------+
|  +-------------------------------------+  |  +-------------------------------------+  |
|  | [ DYNAMIC ISLAND: Oven #2 Ready ]   |  |  | [ PUNCH HOLE ]            10:00 100%|  |
|  | 9:41                            5G  |  |  |                                     |  |
|  |                                     |  |  | D'BAI CUI ARTISAN BAKERY            |  |
|  | HERO CARD: OMZET HARI INI           |  |  | Halo, Chef Pierre (Kitchen Head)    |  |
|  | Rp 14.850.000                       |  |  |                                     |  |
|  | [Bento: HPP 33%] [Bento: Laba 67%]  |  |  | UNIT OVEN AKTIF (3/3):               |  |
|  |                                     |  |  | [Deck 1: 230°C] [Deck 2: 185°C]     |  |
|  | KATALOG CEPAT & TRANSAKSI           |  |  |                                     |  |
|  | [ + Tambah Pesanan / Custom Cake ]  |  |  | ANTREAN OVEN:                       |  |
|  |                                     |  |  | 1. Croissant Almond (Baking 80%)    |  |
|  | RECENT ORDERS FEED:                 |  |  | 2. Sourdough Loaf (Cooling)         |  |
|  | - #0042 Sarah W. (Rp 550.715) [Lunas]|  |  |                                     |  |
|  |                                     |  |  | +---------------------------------+ |  |
|  | +---------------------------------+ |  |  | | [M3 NAV: Home | Oven | Bahan | Set]| |  |
|  | | [TAB 1] [TAB 2] [TAB 3] [TAB 4] | |  |  | +---------------------------------+ |  |
|  | |   Home    POS   Kitchen Profile | |  |  |                                     |  |
|  | +---------------------------------+ |  |  |                                     |  |
|  |         [ — HOME INDICATOR — ]      |  |  |                                     |  |
|  +-------------------------------------+  |  +-------------------------------------+  |
|        (iPhone 15 Pro iOS 17 View)         |           (Android M3 View)               |
+---------------------------------------------------------------------------------------+
```

#### Rincian 5 Tab Navigasi Bawah (*Bottom Tab Bar*):
1. **Layar 1 — Onboarding / Login & Quick Role Switcher**:
   - Logo D'Bai Cui, dual mode email/password & keypad 4-digit PIN.
   - Quick Demo Role Pill Bar (*👑 Owner*, *👨‍🍳 Head Baker*, *🏷️ Kasir*, *👤 Pelanggan VIP*).
2. **Layar 2 — Tab 1: Home / Executive Dashboard**:
   - Hero Gradient Card (Omzet harian, margin kotor, total pesanan).
   - Bento KPI Grid 2x2 berbingkai squircle mewah.
   - Live Activity Feed transaksi kasir terbaru.
3. **Layar 3 — Tab 2: Core Feature / Katalog POS & Custom Cake (CRUD Interaktif)**:
   - Search bar & horizontal chip filter (*Semua, Viennoiserie, Sourdough, Custom Cake*).
   - Grid kartu produk anti-clipping dengan gambar rasio 16:10.
   - Floating Action Button (FAB) `[ + Pesan Custom ]` yang membuka **Modal Bottom Sheet**.
4. **Layar 4 — Tab 3: Oven Queue, Kitchen KDS & Order Tracking**:
   - Status interaktif 3 unit oven industri dengan countdown timer.
   - Tracking timeline pembuatan pesanan kue custom step-by-step.
5. **Layar 5 — Tab 4: Profile, Thermal Settings & Server Switcher**:
   - Profil pengguna aktif & badge loyalty tier.
   - Switcher Bluetooth printer thermal (58mm vs 80mm).
   - **Backend Server API Switcher**: Input URL server (`https://webui.5nod.com/staging/saint-sejarah-firaun/api` vs `localhost:5000`) dengan status indikator ping hijau (*Live Connected*).
   - Kartu link download build GitHub Actions: **`AppRelease.apk`** & **`AppRelease.ipa`**.

---

## 6. SPESIFIKASI INTERAKSI, MICRO-INTERACTIONS & STATE COVERAGE

### 6.1 State Coverage Lengkap
1. **Empty State**:
   - *Keranjang POS Kosong*: Ilustrasi outline minimalis croissant emas + teks *"Keranjang Belanja Masih Kosong — Sentuh produk di katalog sebelah kiri untuk memulai pesanan"*.
   - *Antrean Oven Kosong*: Teks *"Seluruh oven telah selesai memanggang — Siap untuk batch adonan baru"*.
2. **Loading Skeleton State**:
   - Kartu produk dan bento grid menggunakan efek gelombang shimmer hangat (`background: linear-gradient(90deg, #F3EFEA 0%, #FAF8F5 50%, #F3EFEA 100%)`, durasi `1.5s infinite`).
3. **Error & Form Validation State**:
   - Input tulisan ucapan pada kue custom melebihi 45 karakter: Border berubah menjadi `#BE123C` (Crimson) dengan pesan teks pembantu *"Maksimal 45 karakter agar tulisan krim di atas kue terbaca rapi"*.
   - PIN Kasir salah: Animasi *shake* horizontal 400ms + pesan *"PIN kasir keliru, sisa 2 kesempatan"*.
4. **Active & Hover Micro-Interactions**:
   - Sentuhan kartu produk di POS: Efek scale halus `scale(0.98)` saat tap/klik, memicu feedback visual border Velvet Rose tipis.
   - Tombol Quick Tender Uang Pas: Highlight emas menyala seketika dan nilai kalkulator kembalian terhitung tanpa jeda (< 50ms).

---

## 7. CHECKLIST ACCEPTANCE CRITERIA UI/UX TERUKUR

- [x] **Design Tokens & Brand Identity**: Palet warna *Artisan Warm Luxury* lengkap dengan kontras teruji WCAG AAA/AA (`#881337`, `#D97706`, `#FAF8F5`, `#1E1B18`).
- [x] **Dual-Mode Login**: Formulir mendukung Email/Sandi dan Numpad 4-Digit Quick PIN Kasir beserta Floating Quick Role Switcher Bar.
- [x] **Owner Executive Dashboard**: Bento KPI Grid 2x2, kartu hero omzet, grafik tren penjualan mingguan, dan top produk best-seller.
- [x] **Kitchen & Oven Screen**: Monitor 3 unit oven industri (Stone Deck, Convection, Rotary Pastry) dengan live countdown, tabel antrean batch, dan inventaris FEFO.
- [x] **Kasir POS Screen**: Katalog kue grid anti-clipping min-h 225px, modal custom cake order taker (ucapan, lilin angka, jam pickup), kalkulator uang kembalian cepat pecahan 50k/100k/200k.
- [x] **Thermal Receipt ESC/POS**: Template teruji 58mm (32 kolom) & 80mm (48 kolom) tanpa grayscale, anti-border stripe, serta link WhatsApp e-receipt.
- [x] **Interactive Mobile Simulator**: Frame ganda iPhone 15 Pro (Dynamic Island) dan Android M3 dengan arsitektur lengkap 5 tab komersial.

---
*Dokumen spesifikasi UI/UX ini mengikat secara teknis dan menjadi pedoman baku bagi implementasi frontend SPA Tailwind CSS dan mobile client Flutter.*
