# PROPOSAL TEKNIS & FITUR SISTEM
# D'BAI CUI ARTISAN BAKERY & CAKE MANAGEMENT SYSTEM
**Transformasi Digital Terpadu untuk Toko Roti Artisan, Patisserie & Custom Cake Premium**

*Kode Proyek:* `saint-sejarah-firaun`  
*Target Implementasi:* Mode 3 Hybrid (Client Showcase Staging + Full-Stack Production) & Mode 4 Mobile Cross-Platform (iOS & Android)  
*Disiapkan oleh:* Solution Architect Specialist (`team-architect`)  
*Untuk:* Manajemen & Pemilik Jenama D'Bai Cui

---

## 1. Ringkasan Eksekutif

Dalam industri *artisan bakery* dan *patisserie* bernilai tinggi setara dengan *The Harvest, Tous Les Jours*, dan *Monsieur Spoon*, keunggulan rasa dan estetika produk harus ditopang oleh sistem manajemen operasional yang presisi. Bahan baku premium seperti *butter* impor Prancis, cokelat *couverture*, dan ekstrak vanila asli memiliki nilai ekonomi tinggi dengan masa simpan (*shelf-life*) terbatas. Kesalahan takaran resep, bahan kedaluwarsa yang tidak terdeteksi, atau pesanan kue ulang tahun khusus (*custom cake*) yang tercecer dapat menggerus margin keuntungan bisnis secara signifikan.

Sistem Manajemen **D'Bai Cui** hadir sebagai solusi digital terintegrasi *end-to-end* yang mencakup:
1. **Sistem Kasir (POS) Cepat**: Dilengkapi fitur *Terminal Quick PIN* (ganti kasir hitungan detik), pembayaran instan QRIS dinamis, dan cetak struk thermal 58mm/80mm.
2. **Kalkulator HPP (COGS) & Resep (BOM) Presisi**: Menghitung biaya modal bahan hingga per gram, memperhitungkan faktor susut pemanggangan (*waste factor*), dan menyajikan laporan laba kotor (*gross profit*) per produk.
3. **Pelacak Kedaluwarsa & Antrean Oven (Oven Queue)**: Memastikan stok bahan baku selalu segar dengan sistem rotasi FIFO/FEFO dan memonitor tahapan adonan dari *mixing, proofing*, hingga siap keluar dari oven.
4. **Modul Custom Birthday Cake & Pre-Order**: Mencatat detail ucapan kue (*inscription*), catatan rasa, foto referensi dekorasi pelanggan, status uang muka (DP), dan jadwal pengambilan pesanan secara akurat.
5. **Program Loyalitas Member VIP (CRM)**: Sistem tingkat keanggotaan bertingkat (*Classic, Gold, Platinum, VVIP*) yang mendorong transaksi berulang melalui poin dan diskon eksklusif.
6. **Ekosistem Multi-Platform**: Dapat diakses melalui Web Back-Office, Interactive Staging Showcase, dan Aplikasi Mobile Cross-Platform (Flutter) untuk iOS 17+ dan Android 14.

---

## 2. Analisis Masalah Operasional & Solusi D'Bai Cui

| Masalah Operasional Bakery Tradisional | Risiko & Kerugian Finansial | Solusi Sistem D'Bai Cui |
| :--- | :--- | :--- |
| **Fluktuasi HPP Bahan Impor**<br>Harga *butter* dan bahan impor berfluktuasi tanpa perhitungan modal yang diperbarui secara berkala. | Margin laba menipis bahkan merugi pada produk tertentu tanpa disadari oleh manajemen. | **Kalkulator Otomatis BOM & HPP**: Harga pokok penjualan terhitung otomatis setiap kali harga beli bahan diperbarui, lengkap dengan simulasi margin harga jual. |
| **Bahan Baku Kedaluwarsa & Waste**<br>Bahan premium di chiller/gudang terlewat tanggal kedaluwarsanya karena pencatatan manual di kertas. | Kerugian *food waste* tinggi dan risiko pelanggaran standar mutu higienitas makanan. | **Expiry Tracker & Early Warning**: Notifikasi otomatis bahan yang mendekati kedaluwarsa (H-7 / H-3) serta audit keluar-masuk stok (*inventory logs*). |
| **Pesanan Custom Cake Sering Salah**<br>Salah tulisan nama ulang tahun di atas kue, salah jam pengambilan, atau salah varian rasa saat pesanan ramai. | Kekecewaan pelanggan VIP, komplain di media sosial, dan biaya pembuatan ulang (*remake*) kue. | **Formulir Custom Cake Terstruktur**: Wajib isi catatan ucapan, unggah foto desain, jadwal pengambilan, dan integrasi WhatsApp otomatis untuk konfirmasi ke pembeli. |
| **Pergantian Shift Kasir Lambat**<br>Kasir harus login ulang mengetik email dan password panjang di layar sentuh saat pergantian jam kerja. | Antrean pelanggan menumpuk dan pelayanan di depan etalase menjadi lambat. | **Terminal Quick PIN Mode**: Kasir cukup memasukkan 6 angka PIN personal pada layar sentuh POS untuk langsung masuk shift dalam 2 detik. |
| **Pencatatan Keuangan Terpisah**<br>Data transaksi kasir, pembelian bahan baku, dan biaya komisi staf berada di pembukuan berbeda. | Owner kesulitan melihat laba-rugi bersih (*P&L*) harian secara akurat dan tepat waktu. | **Dashboard Keuangan Eksekutif Real-Time**: Laporan laba-rugi konsolidasian (Penjualan kotor, HPP riil, komisi kasir, dan laba bersih estimasi) dalam 1 layar. |

---

## 3. Proyeksi Nilai Bisnis & Return on Investment (ROI)

Implementasi sistem D'Bai Cui diproyeksikan memberikan dampak finansial dan efisiensi kerja nyata dalam 3 hingga 6 bulan pertama:
- **Pengurangan Pemborosan Bahan Baku (Waste) Sebesar 30% - 45%**: Berkat sistem peringatan dini bahan kedaluwarsa dan batching produksi terencana.
- **Peningkatan Akurasi Margin Keuntungan Hingga 99%**: Tiap varian kue memiliki data HPP akurat sehingga promo atau diskon tidak pernah menjual di bawah modal.
- **Peningkatan Kecepatan Layanan Kasir Hingga 3x Lipat**: Pembayaran QRIS otomatis tanpa input manual ke mesin EDC serta struk thermal instan memperpendek antrean jam sibuk.
- **Peningkatan Transaksi Berulang (Customer Retention) Sebesar 25% - 40%**: Program loyalitas VIP tiering memberikan insentif bagi pelanggan tetap untuk terus kembali membeli produk D'Bai Cui.

---

## 4. Rincian Fitur Komprehensif Berdasarkan Peran Pengguna

Sistem dirancang dengan pembagian hak akses (*Role-Based Access Control*) yang ketat agar data keuangan dan resep rahasia tetap terlindungi.

```
                   +----------------------------------+
                   |  D'Bai Cui Management Ecosystem  |
                   +-----------------+----------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         ▼                           ▼                           ▼
  [Owner Dashboard]         [Production & Floor]       [Front-Desk POS & CRM]
  - Laporan Laba Rugi (P&L) - Antrean Oven (Baking)    - Transaksi Kasir Cepat
  - Analisis Margin HPP     - Master Resep & BOM       - Input Custom Cake Pre-Order
  - Audit Transaksi & User  - Tracking Expiry Bahan    - QRIS Dinamis & Struk Thermal
  - Komisi Penjualan Staf   - Stock Opname Digital     - Poin Loyalitas Member VIP
```

### 4.1 Peran 1: Owner / Superadmin (Pemilik Bisnis)
- **Executive Bento Dashboard**: Ringkasan omzet harian, laba kotor, produk terlaris (*best-sellers*), dan grafik tren mingguan.
- **Laporan Laba & Rugi (P&L) Real-Time**: Perhitungan pendapatan kotor dikurangi HPP bahan terpakai dan komisi staf toko.
- **Audit Log & Hak Akses Penuh**: Mengelola akun staf, menetapkan PIN kasir, dan memantau setiap aktivitas perubahan stok atau pembatalan transaksi (*void audit*).
- **Multi-Device Access**: Memantau perkembangan toko kapan saja dari laptop maupun ponsel pintar (iOS & Android).

### 4.2 Peran 2: Store Manager & Head Baker (Kepala Dapur & Produksi)
- **Editor Resep & Bill of Materials (BOM)**: Menentukan takaran tepung, butter, telur, dan bahan lainnya per batch resep, termasuk toleransi susut saat pemanggangan.
- **Oven Queue & Batch Tracker**: Memantau antrean loyang dan status pengerjaan adonan secara berurutan (*Queued -> Mixing -> Proofing -> Baking -> Cooling -> Ready to Sell*).
- **Manajemen Bahan Baku & Expiry Alerts**: Daftar inventaris bahan dengan indikator visual warna (Hijau: Aman, Kuning: Menipis, Merah: Mendekati Kedaluwarsa).
- **Stock Opname Digital**: Menyesuaikan stok fisik dengan sistem dan mencatat alasan selisih secara transparan.

### 4.3 Peran 3: Kasir & Front-Desk POS (Pelayanan Konsumen)
- **POS Layar Sentuh Responsif**: Katalog visual produk dengan tombol kategori cepat (*Croissant, Danish, Cakes, Beverages*).
- **Terminal Quick PIN**: Pergantian kasir saat pergantian jam kerja tanpa proses logout-login yang berbelit.
- **Formulir Khusus Custom Cake**:
  - Pilihan ukuran diameter kue (16cm, 20cm, 24cm, 2 tier).
  - Kolom teks ucapan ulang tahun di atas kue (*Contoh: "Happy Birthday Clarissa ke-30"*).
  - Unggah tautan foto desain referensi dari pelanggan.
  - Tanggal dan jam pengambilan yang pasti.
  - Pengaturan status pembayaran Uang Muka (DP minimal 50%) atau Pelunasan.
- **Metode Pembayaran Fleksibel**: Menerbitkan kode QRIS langsung di layar, mencatat pembayaran Tunai dengan kalkulasi kembalian otomatis, atau kartu Debit/Kredit.
- **Pencetakan Struk Thermal**: Format struk estetik standar 58mm atau 80mm yang kompatibel dengan printer thermal USB atau Bluetooth.

### 4.4 Peran 4: Pelanggan VIP / Member D'Bai Cui
- **Katalog Kue Digital Mewah**: Melihat foto produk kue artisan lengkap dengan deskripsi rasa dan informasi alergen (bebas gluten, mengandung kacang/susu).
- **Pre-Order Mandiri**: Pelanggan dapat memesan kue dari rumah untuk diambil di outlet pada jam yang ditentukan.
- **Loyalty Tiering & Riwayat Poin**: Melihat tingkatan membership (*Classic, Gold, Platinum, VVIP*), mengumpulkan poin dari setiap pembelanjaan, dan menukarkan poin dengan potongan harga.
- **Struk Digital & Notifikasi WhatsApp**: Konfirmasi pesanan dan status pembuatan kue dikirim langsung ke WhatsApp pelanggan.

---

## 5. Jaminan Arsitektur & Keandalan Teknis

Sistem D'Bai Cui dibangun menggunakan metodologi rekayasa perangkat lunak standar industri internasional:
1. **Penerapan Clean Architecture**: Logika bisnis dan rumus resep kue terisolasi sepenuhnya dari database dan tampilan luar, menjamin sistem awet dan mudah ditingkatkan tanpa merombak ulang.
2. **Kesesuaian Basis Data Relasional Ganda**:
   - **PostgreSQL 15+** untuk keandalan transaksi tinggi di server produksi *cloud*.
   - **SQLite 3.35+** untuk kebutuhan staging demo instan lokal yang cepat dan mandiri.
3. **Integritas Transaksi Anti-Selisih**: Operasi checkout kasir dan pemotongan bahan baku dijamin menggunakan transaksi database atomik (*ACID transactions*). Tidak akan terjadi kondisi di mana uang tercatat masuk namun stok bahan tidak terpotong.
4. **Keamanan Data & Privasi**: Kata sandi dienkripsi dengan standar *bcrypt* berkekuatan tinggi, komunikasi API menggunakan token JWT berjangka waktu terbatas, dan dilengkapi pelindung dari serangan *brute-force*.
5. **Kesiapan Cetak Struk Fisik**: Output struk telah diformat dalam struktur teks ESC/POS standar sehingga langsung bekerja mulus dengan printer kasir Epson, Xprinter, maupun printer mini Bluetooth portabel.

---

## 6. Kesiapan Ekosistem Cloud, Demo Staging & Distribusi Mobile

Sistem ini dirancang untuk segera diuji coba oleh klien tanpa hambatan teknis:
1. **Interactive Client Showcase Staging**:
   - URL Staging Interaktif: **`https://webui.5nod.com/staging/saint-sejarah-firaun/`**
   - Klien dan tim manajemen dapat langsung mencoba simulasi seluruh alur peran (Owner, Baker, Kasir, dan Member) langsung dari peramban web modern tanpa perlu menginstal aplikasi apapun terlebih dahulu.
2. **Aplikasi Mobile Cross-Platform (Flutter)**:
   - Satu kesatuan kode yang menyajikan antarmuka mewah bertema *Warm Amber & Velvet Bronze* khas bakery Eropa.
   - Menyediakan fitur *Server Switcher* di layar profil: memudahkan perpindahan antara server simulasi staging dan server *live* produksi.
3. **Otomasi Build Cloud via GitHub Actions (Zero-Local-SDK)**:
   - File instalasi **Android (`AppRelease.apk`)** dikompilasi secara otomatis menggunakan runner *Ubuntu Cloud*.
   - File instalasi **iOS (`AppRelease.ipa`)** dikompilasi pada *macOS Cloud Runner* tanpa perlu komputer Mac lokal, dan dapat langsung di-*sideload* ke iPhone menggunakan AltStore, Scarlet, atau ESign.
   - Seluruh berkas instalasi otomatis terbit di menu **GitHub Releases** untuk diunduh langsung oleh klien.

---

## 7. Rencana Kerja & Tahapan Serah Terima (Roadmap)

```
[Tahap 1: Arsitektur & Desain]
- Penetapan skema DDL 18 tabel relasional
- Finalisasi spesifikasi REST API & RBAC
- Template konfigurasi sistem (.env.example)
         │
         ▼
[Tahap 2: Staging Showcase & Simulator Klien]
- Peluncuran Simulator Web Interaktif di webui.5nod.com
- Uji coba skenario 4 peran (Owner, Baker, Kasir, Member)
- Uji alur pemesanan Custom Cake & kalkulator HPP resep
         │
         ▼
[Tahap 3: Implementasi Backend & Database Produksi]
- Perakitan REST API Node.js Express & TypeScript
- Pengujian transaksi atomik POS dan webhook QRIS
- Integrasi gateway notifikasi WhatsApp
         │
         ▼
[Tahap 4: Peluncuran Aplikasi Mobile & Pelatihan Tim]
- Otomasi kompilasi iOS .ipa dan Android .apk via GitHub Actions
- Pengujian printer thermal 58mm/80mm di lokasi toko
- Pelatihan staf kasir dengan sistem Quick PIN & Go-Live operasional
```

---

## 8. Kesimpulan

Sistem Manajemen **D'Bai Cui Artisan Bakery & Cake** dirancang bukan sekadar sebagai aplikasi kasir biasa, melainkan sebagai tulang punggung operasional dan pertumbuhan bisnis jangka panjang. Dengan pengendalian HPP yang akurat, pengawasan stok bahan baku berharga tinggi, serta pengalaman pemesanan kue ulang tahun yang elegan bagi pelanggan, sistem ini memastikan D'Bai Cui siap bersaing dan memimpin pasar *patisserie* premium modern.
