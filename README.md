# D'Bai Cui - Artisan Bakery & Cake Management System
> **Mode 3 Hybrid** (Staging Client Showcase + Full-Stack Production Codebase) & **Mode 4 Mobile** (iOS `.ipa` Sideload & Android `.apk` Release via GitHub Actions CI)

Sistem manajemen terintegrasi untuk jaringan toko roti, patisserie, dan custom cake artisan premium (seperti *D'Bai Cui, The Harvest, Monsieur Spoon*). Menggabungkan **Point of Sale (POS) Kasir Berkecepatan Tinggi**, **Kitchen Display & Oven Queue (KDS)**, **Bill of Materials (BOM) & Inventaris Otomatis**, **Multi-Role RBAC**, serta **Aplikasi Mobile Flutter Cross-Platform (iOS 17+ & Android 14)**.

---

## 🌟 Demo & Staging Live URL
- **Staging Showcase URL**: [https://webui.5nod.com/staging/saint-sejarah-firaun/](https://webui.5nod.com/staging/saint-sejarah-firaun/)
- **Dual View Mode**:
  1. **Desktop/Tablet Web Suite**: POS Kasir Kiosk, Struk Thermal ESC/POS 58mm/80mm, Kitchen Display 3 Oven, Inventaris Bahan FEFO, Owner Financial Dashboard, dan Quick Role Switcher.
  2. **Mobile Device Simulator**: Simulator interaktif frame iPhone 15 Pro & Android Material 3 dengan 5 layar komersial (`mobile-premium-ui-ux`).

---

## 🏗️ Arsitektur & Struktur Proyek

```
saint-sejarah-firaun/
├── backend/                       # REST API Backend (Node.js & Express)
│   ├── middlewares/               # JWT Auth & Role-Based Access Control (RBAC)
│   ├── routes/                    # Endpoint POS, Inventaris, Analitik, & Auth
│   ├── db.js                      # Adapter Database SQLite / PostgreSQL
│   ├── package.json               # Dependensi backend
│   └── server.js                  # Entrypoint server (Port 5000)
├── database/                      # Skema & Data Awal Relasional
│   ├── schema.sql                 # 18 Tabel & 46 Indeks Relasional Kompatibel
│   └── seed.sql                   # Seed data lengkap 4 akun role, menu artisan, & bahan
├── mobile/                        # Aplikasi Mobile Cross-Platform (Flutter)
│   ├── lib/                       # Clean Architecture 5 Layar Komersial
│   │   ├── models/                # State management bakery & keranjang
│   │   ├── screens/               # Login, Home Bento, Katalog CRUD, KDS, & Profile
│   │   ├── widgets/               # Bottom Sheet Tambah Produk & Quick Tender
│   │   └── main.dart              # Entrypoint Flutter
│   └── pubspec.yaml               # Dependensi Flutter (Provider, Google Fonts, Http)
├── .github/workflows/             # Zero-Local-Build CI/CD Pipeline
│   └── build-mobile.yml           # macOS (iOS .ipa no-codesign) & Ubuntu (Android .apk)
├── index.html                     # Interactive Staging Showcase & Mobile Simulator
├── BRD_PRD.md                     # Business Requirements Document & User Stories
├── ARCHITECTURE_SPEC.md           # Spesifikasi Arsitektur Sistem & Kontrak API
├── UI_SPEC.md                     # Design System Artisan Warm Luxury & UI Flow
├── CLIENT_PROPOSAL_SPEC.md        # Proposal Teknis & Fitur untuk Klien
├── PROJECT_INTAKE.json            # Ringkasan Spesifikasi Intake Disetujui
└── .env.example                   # Template variabel lingkungan
```

---

## 👥 4 Tingkat Hak Akses Pengguna (RBAC Matrix)

| Role | Kredensial / PIN | Hak Akses Utama |
|---|---|---|
| 👑 **Owner / Superadmin** | `owner@dbaicui.com` / `1234` | Full P&L Financials, Analitik Omzet & Laba Bersih, HPP/BOM, Manajemen User |
| 👨‍🍳 **Store Manager & Head Baker** | `manager@dbaicui.com` / `1234` | Jadwal 3 Unit Oven KDS, Formula Resep BOM, Pemotongan Bahan Otomatis, FEFO Expiry |
| 🏷️ **Kasir / Front-Desk** | `cashier@dbaicui.com` / `1234` | POS Kasir Cepat, Custom Cake Order Taker, Struk Thermal 58/80mm, Quick Tender QRIS/Tunai |
| 👤 **Pelanggan VIP / Member** | `customer@dbaicui.com` / `1234` | Katalog Digital, Pre-order Kue Custom, Loyalty Points, Live Order Status Tracking |

---

## 🚀 Panduan Menjalankan Sistem

### 1. Menjalankan Backend REST API
```bash
cd backend
npm install
cp ../.env.example .env
npm start
# Server berjalan di http://localhost:5000
```

### 2. Membuka Demo Staging Showcase
Buka browser dan akses:
`https://webui.5nod.com/staging/saint-sejarah-firaun/`
- Tekan tombol **Quick Switch Role** di bagian atas untuk menguji tampilan setiap hak akses tanpa perlu login manual.
- Tekan tombol **📱 Buka Simulator Mobile** untuk mencoba simulasi iPhone 15 Pro & Android.

### 3. Build Otomatis Mobile iOS (`.ipa`) & Android (`.apk`) via GitHub Actions
Aplikasi mobile menggunakan standar **Zero-Local-Build**:
1. Buat repository baru di GitHub atau push folder proyek:
   ```bash
   git init
   git add .
   git commit -m "feat: D'Bai Cui Artisan Bakery System v1.0.0"
   gh repo create dbaicui-bakery-pos --public --source=. --push
   ```
2. Workflow `.github/workflows/build-mobile.yml` otomatis berjalan di cloud:
   - Runner `macos-latest`: Membangun bundle iOS Runner release tanpa code-signing menjadi paket `.ipa` siap sideload (GBox, Scarlet, ESign, TrollStore).
   - Runner `ubuntu-latest`: Mengompilasi paket Android `.apk` release.
3. Unduh hasil instalasi langsung dari menu **Releases** di GitHub repository Anda!

---

## 🧾 Standar Thermal Receipt ESC/POS (58mm / 80mm)
- **Zero Grayscale**: Menggunakan font bold murni (`#000000`) agar terbakar merata pada kertas thermal printer Bluetooth portable (Kassen, Goojprt).
- **Anti-Border Stripe**: Menggunakan pemisah karakter ASCII putus-putus tanpa border container CSS vertikal.
- **WhatsApp Digital Receipt**: Tombol kirim struk instan ke nomor WhatsApp pelanggan.
