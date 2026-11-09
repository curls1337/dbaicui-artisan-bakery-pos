# SCRIPT & STORYBOARD: PROSES TERJADINYA GERHANA MATAHARI & GERHANA BULAN
**Durasi Target:** ~56 Detik Fleksibel (Estimasi 1.680 Frame @ 30 FPS mengikuti durasi aktual TTS) | **Rasio:** 9:16 Vertical (1080 × 1920)  
**Voice ID:** Fola (`id-ID` — Wanita, Clear & Friendly, Medium Pitch, Google AI Studio Gemini 3.8 Flash TTS)  
**Archetype Visual:** Archetype 3 — Kurzgesagt / Apple Organic Science + ElevenByte True 3D WebGL  
**Engine Visual:** `@remotion/three` (`Scene3DCanvas` + `EclipseOrbitalSimulation3D` + `ElevenByteTopHud` + `UxGlassHudCallout` + `KaraokeYellowSubtitlePill`)  
**Project Workspace:** `/home/devcurl/workspace/saint-sejarah-firaun`

---

## 1. Tujuan, Audience, Kriteria Hasil & Arsitektur 5 Lapisan 3D

- **Tujuan & Audience**: Menyajikan penjelasan astronomi yang akurat, imersif, dan mudah dipahami tentang mekanika orbital gerhana matahari dan gerhana bulan bagi audiens umum, pelajar, dan penikmat konten sains di platform vertikal (Reels/Shorts/TikTok).
- **Hak Sumber & Klaim Fakta**: Mekanika orbital berbasis prinsip astronomi dasar (kemiringan orbit Bulan ~5,14° / dibulatkan 5° dalam narasi edukatif terhadap bidang ekliptika, fenomena *syzygy*, proyeksi kerucut *umbra* dan *penumbra*, korona & *diamond ring*, serta *Rayleigh scattering* oleh atmosfer Bumi). Tidak menggunakan rekaman berhak cipta; seluruh visual disintesis secara prosedural dalam True 3D WebGL.
- **Arsitektur Hybrid 3D (5 Lapisan Wajib)**:
  1. **Lapis 1 — True 3D WebGL (`Scene3DCanvas`)**: Ruang angkasa 3D kontinu dengan `CameraRig3D` (*Orbital Pan*, *Side-Elevation Tilt*, *Axial Fly-Through*, *Macro Solar Zoom*), pencahayaan PBR fisik (*Sun PointLight Emissive + Directional Rim + Ambient Nebula Fill*), dan *starfield* paralaks 3D.
  2. **Lapis 2 — Simulasi Orbital (`EclipseOrbitalSimulation3D`)**: Model 3D Matahari dengan shader plasma/korona berdenyut, Bumi berotasi dengan tekstur benua-lautan serta cincin atmosfer tipis berkilau (*Rayleigh rim shader*), Bulan bertekstur kawah PBR, cincin lintasan bidang Ekliptika & bidang Orbit Bulan bersudut 5°, serta geometri kerucut bayangan *Umbra* dan *Penumbra* dinamis.
  3. **Lapis 3 — `ElevenByteTopHud`**: Header 2 baris di bagian atas (*Safe Zone* `top >= 180px`) dengan `titleWhite`: `"ASTRONOMI KOSMIK"` dan `titleGold`: `"GERHANA MATAHARI & BULAN"`, serta *4-Stage Process Stepper Bar*:
     - `[1. ORBIT 5°]` ➔ `[2. SYZYGY]` ➔ `[3. TOTALITAS]` ➔ `[4. BLOOD MOON]`
     - Aktif: Kuning (`#FACC15`), Selesai: Hijau (`#16A34A`), Berikutnya: Abu-abu Terang (`#94A3B8`).
  4. **Lapis 4 — `UxGlassHudCallout`**: Badge glassmorphism VisionOS dengan garis siku (`───╲●`) menunjuk langsung ke koordinat komponen 3D (maksimal 20% luas layar).
  5. **Lapis 5 — `KaraokeYellowSubtitlePill`**: Pill gelap di area bawah aman (`bottom >= 280px`) menampilkan 3–4 kata per baris dengan kotak highlight kuning (`#FACC15`) bergerak kata demi kata menyinkronkan suara Fola.
- **Kepatuhan Safe Zone 9:16 (1080 × 1920)**:
  - Batas Atas: `top >= 180px` untuk `ElevenByteTopHud`.
  - Batas Bawah: `bottom >= 280px` untuk `KaraokeYellowSubtitlePill`.
  - Margin Kiri/Kanan: minimal `72px`.

---

## 2. Evolusi Palet Warna (`interpolateColors`) & Variasi Layout 4 Babak

1. **Babak 1 — Orbit Normal (0.0s – 15.0s | Frames 0 – 450)**
   - **Layout A (3D Orbital Overview + Inclination Arc)**: Kamera perspektif miring menampakkan sistem Matahari–Bumi–Bulan secara keseluruhan dengan dua bidang orbit bercahaya.
   - **Palet Warna**: Langit Kosmik Deep Indigo (`#080B1A` ➔ `#111633`), bidang Ekliptika Kuning Emas (`#FACC15`), bidang Orbit Bulan Teal (`#14B8A6`).
2. **Babak 2 — Gerhana Matahari & Syzygy (15.0s – 28.5s | Frames 450 – 855)**
   - **Layout B (Axial Alignment + Shadow Cone Projection)**: Kamera berputar ke tampilan tampak samping (*side-elevation cross-section*) memperlihatkan garis lurus *Syzygy* dan dua kerucut bayangan yang menyentuh permukaan Bumi.
   - **Palet Warna**: Ruang Angkasa Gelap Kontras (`#050711`), sinar Matahari Emas Terang (`#F59E0B`), kerucut Umbra Hitam Pekat bertepi Emas, Penumbra Abu-abu Kebiruan Transparan (`#64748B`).
3. **Babak 3 — Totalitas & Cincin Berlian (28.5s – 42.0s | Frames 855 – 1260)**
   - **Layout C (Macro Solar Perspective / POV dari Bumi)**: Kamera melakukan *fly-through* mendarat ke sudut pandang pengamat di permukaan Bumi menatap langsung cakram Matahari yang tertutup sempurna oleh Bulan.
   - **Palet Warna**: Hitam Gerhana Total (`#030308`) dengan ledakan cahaya Korona Putih-Emas (`#FFFFFF` / `#FEF08A` / `#FBBF24`) dan kilau *Diamond Ring* Biru-Putih (`#E0F2FE`).
4. **Babak 4 — Gerhana Bulan / Blood Moon (42.0s – 56.0s | Frames 1260 – 1680)**
   - **Layout D (Orbital Swing-Around + Atmospheric Refraction Flow)**: Kamera melayang mundur menjauhi Matahari menuju sisi malam Bumi, menampilkan sinar matahari membengkok menembus cincin atmosfer Bumi dan memandikan Bulan dengan cahaya merah tembaga.
   - **Palet Warna**: Merah Marun Kosmik (`#1A0608` ➔ `#2B090C`), pembiasan atmosfer Merah Crimson (`#EF4444` / `#DC2626`), permukaan Bulan Merah Darah (*Blood Moon* `#B91C1C` & `#FCA5A5`).

---

## 3. Naskah Narasi Lengkap (Word Count: 126 Kata | Estimasi: ~56 Detik)

> **[Babak 1: Orbit Normal & Kemiringan 5° | 0.0s – 15.0s]**  
> Pernahkah kamu bertanya... mengapa gerhana tidak terjadi setiap bulan? Jawabannya ada pada orbit Bulan... yang memiliki kemiringan lima derajat terhadap bidang ekliptika Bumi dan Matahari. Akibatnya... bayangan Bulan sering kali meleset di atas atau di bawah Bumi.
>
> **[Babak 2: Gerhana Matahari & Syzygy | 15.0s – 28.5s]**  
> Namun pada momen istimewa... ketiganya berbaris sejajar lurus sempurna dalam fenomena syzygy. Bayangan Bulan pun jatuh menghantam permukaan Bumi... membentuk kerucut gelap pekat umbra... dan area bayangan samar penumbra.
>
> **[Babak 3: Totalitas & Cincin Berlian | 28.5s – 42.0s]**  
> Saat piringan Bulan menutup Matahari seutuhnya... siang seketika berubah menjadi senja mistis! Pijar korona putih keemasan menyembur di angkasa... diiringi kilauan spektakuler cincin berlian di tepi cakram Bulan.
>
> **[Babak 4: Gerhana Bulan (Blood Moon) & Hamburan Rayleigh | 42.0s – 56.0s]**  
> Lalu bagaimana dengan gerhana Bulan? Saat Bumi berdiri tepat di antara Matahari dan Bulan... atmosfer Bumi membiaskan panjang gelombang merah melalui hamburan Rayleigh... membasahi permukaan Bulan dengan cahaya merah darah yang megah!

---

## 4. Matriks Story Beat Sheet Per Babak (12 Sub-Beat Sinkron Detik demi Detik @ 30 FPS)

| Sub-Beat | Rentang Waktu & Frame (30fps) | Kalimat Narasi Fola | Emosi & Palet Warna (`interpolateColors`) | Aksi Visual 3D (`Scene3DCanvas` & `EclipseOrbitalSimulation3D`) | Pemetaan `UxGlassHudCallout` & `ElevenByteTopHud` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1A** | **0.0s – 4.5s**<br>`(0 – 135)` | *"Pernahkah kamu bertanya... mengapa gerhana tidak terjadi setiap bulan?"* | **Penasaran, Mengundang**.<br>Indigo Kosmik Dalam (`#080B1A`). | `CameraRig3D` melakukan *orbital sweep* dari atas sudut 35° memperlihatkan Matahari bercahaya hangat di kiri belakang, Bumi berotasi di pusat, dan Bulan mengelilingi Bumi cepat sepanjang lintasan bercahaya. | **TopHud**: Step 1 `ORBIT 5°` aktif (`#FACC15`).<br>**Callout 1A** *(Kanan Atas)*: `SIKLUS BULAN: 29,5 HARI` *(Menunjuk titik Bulan bergerak)*. |
| **1B** | **4.5s – 10.5s**<br>`(135 – 315)` | *"Jawabannya ada pada orbit Bulan... yang memiliki kemiringan lima derajat terhadap bidang ekliptika Bumi dan Matahari."* | **Edukatif, Eksplanatori**.<br>Indigo + Grid Ekliptika Emas (`#FACC15`) vs Cincin Teal (`#14B8A6`). | Kamera turun ke ketinggian setara bidang Bumi (*eye-level side tilt*). Dua bidang cakram 3D transparan menyala: Bidang Ekliptika horizontal & Bidang Orbit Bulan terangkat miring membentuk sudut busur 5° yang berpendar jelas. | **TopHud**: Step 1 `ORBIT 5°` aktif.<br>**Callout 1B-1** *(Kiri Tengah)*: `BIDANG EKLIPTIKA (0°)` *(Menunjuk bidang orbit Bumi-Matahari)*.<br>**Callout 1B-2** *(Kanan Tengah)*: `KEMIRINGAN ORBIT 5°` *(Menunjuk busur sudut antara 2 bidang)*. |
| **1C** | **10.5s – 15.0s**<br>`(315 – 450)` | *"Akibatnya... bayangan Bulan sering kali meleset di atas atau di bawah Bumi."* | **Terjawab, Jelas**.<br>Kontras sorot bayangan abu-abu kebiruan melintas di ruang hampa. | Bulan melintas di posisi *Bulan Baru* bagian atas bidang miring; proyeksi garis bayangan kerucut muncul dari Bulan namun lewat jelas di atas kutub utara Bumi tanpa menyentuh permukaan. | **TopHud**: Step 1 `ORBIT 5°` aktif.<br>**Callout 1C** *(Atas Tengah)*: `BAYANGAN MELESET` *(Menunjuk kerucut bayangan di atas kutub Bumi)*. |
| **2A** | **15.0s – 20.0s**<br>`(450 – 600)` | *"Namun pada momen istimewa... ketiganya berbaris sejajar lurus sempurna dalam fenomena syzygy."* | **Antusias, Takjub**.<br>Transisi ke Gelap Angkasa Fokus (`#050711`). | Bidang Orbit Bulan dan Ekliptika berpotongan di *Node* (titik simpul). Kamera melakukan *dolly-pan* sejajar sumbu X. Garis laser emas *Syzygy* menembak lurus menembus pusat Matahari ➔ Bulan ➔ Bumi. | **TopHud**: Step 1 `ORBIT 5°` selesai (`#16A34A`); Step 2 `SYZYGY` aktif (`#FACC15`).<br>**Callout 2A** *(Tengah Atas)*: `SYZYGY: GARIS SEJAJAR` *(Menunjuk garis aksial Matahari–Bulan–Bumi)*. |
| **2B** | **20.0s – 24.5s**<br>`(600 – 735)` | *"Bayangan Bulan pun jatuh menghantam permukaan Bumi... membentuk kerucut gelap pekat umbra..."* | **Dramatis, Presisi**.<br>Gelap Pekat & Emas Rim (`#F59E0B`). | Kamera *zoom-in* menuju ruang antara Bulan dan Bumi. Kerucut inti gelap pekat (*Umbra*) memanjang dari Bulan hingga ujung lancipnya menghantam tepat di atas wilayah benua Bumi sebagai bintik hitam pekat. | **TopHud**: Step 2 `SYZYGY` aktif.<br>**Callout 2B** *(Kanan Tengah)*: `KERUCUT UMBRA (GERHANA TOTAL)` *(Menunjuk titik kontak ujung kerucut gelap pada Bumi)*. |
| **2C** | **24.5s – 28.5s**<br>`(735 – 855)` | *"...dan area bayangan samar penumbra."* | **Informatif, Kontras**.<br>Cahaya menyebar Abu-abu Kebiruan (`#64748B`). | Lapisan kerucut luar melebar semitransparan (*Penumbra*) mengembang di sekeliling kerucut Umbra, menyelimuti area yang lebih luas di permukaan Bumi dengan bayangan redup parsial. | **TopHud**: Step 2 `SYZYGY` aktif.<br>**Callout 2C** *(Bawah Tengah)*: `BAYANGAN PENUMBRA (PARSIAL)` *(Menunjuk selubung kerucut luar yang melebar)*. |
| **3A** | **28.5s – 33.5s**<br>`(855 – 1005)` | *"Saat piringan Bulan menutup Matahari seutuhnya... siang seketika berubah menjadi senja mistis!"* | **Kagum, Mistis**.<br>Transisi cepat ke Hitam Totalitas (`#030308`). | *Fly-Through Transition*: Kamera melesat masuk menyusuri kerucut Umbra ke sudut pandang pengamat di Bumi. Cakram gelap Bulan bergeser presisi menutup tepat 100% bulatan Matahari; langit 3D meredup menjadi senja berbintang. | **TopHud**: Step 2 `SYZYGY` selesai (`#16A34A`); Step 3 `TOTALITAS` aktif (`#FACC15`).<br>**Callout 3A** *(Kiri Atas)*: `FASE TOTALITAS 100%` *(Menunjuk tepi cakram Bulan menutup Matahari)*. |
| **3B** | **33.5s – 37.5s**<br>`(1005 – 1125)` | *"Pijar korona putih keemasan menyembur di angkasa..."* | **Megah, Terpukau**.<br>Pendaran Putih Murni & Emas (`#FFFFFF` + `#FEF08A`). | Di sekeliling siluet hitam Bulan, shader *Korona Matahari* 3D merekah berdenyut dengan filamen plasma putih keemasan yang memancar keluar mengikuti garis medan magnetik surya. | **TopHud**: Step 3 `TOTALITAS` aktif.<br>**Callout 3B** *(Kanan Atas)*: `PIJAR KORONA MATAHARI` *(Menunjuk halo plasma putih keemasan)*. |
| **3C** | **37.5s – 42.0s**<br>`(1125 – 1260)` | *"...diiringi kilauan spektakuler cincin berlian di tepi cakram Bulan."* | **Klimaks Visual, Berkilau**.<br>Ledakan Starburst Putih-Biru (`#E0F2FE`) + Emas (`#FACC15`). | Sesaat sebelum/sesudah totalitas, celah lembah tepi Bulan melepas seberkas cahaya fotosfer super terang membentuk efek *Diamond Ring* beserta kilau suar lensa 3D (*starburst flare*) di tepi cincin tipis. | **TopHud**: Step 3 `TOTALITAS` aktif.<br>**Callout 3C** *(Kanan Bawah)*: `CINCIN BERLIAN (DIAMOND RING)` *(Menunjuk titik kilau cahaya starburst di tepi kanan cakram)*. |
| **4A** | **42.0s – 46.5s**<br>`(1260 – 1395)` | *"Lalu bagaimana dengan gerhana Bulan? Saat Bumi berdiri tepat di antara Matahari dan Bulan..."* | **Transisi Penasaran ➔ Agung**.<br>Menarik mundur ke Merah Marun Gelap (`#1A0608`). | Kamera menarik mundur cepat (*camera swing-around*) memutar posisi 180°. Kali ini Bumi berdiri tegak di tengah antara Matahari (kiri) dan Bulan (kanan), menjebak Bulan di dalam bayangan Umbra raksasa Bumi. | **TopHud**: Step 3 `TOTALITAS` selesai (`#16A34A`); Step 4 `BLOOD MOON` aktif (`#FACC15`).<br>**Callout 4A** *(Kiri Tengah)*: `POSISI: MATAHARI • BUMI • BULAN` *(Menunjuk posisi Bumi di tengah)*. |
| **4B** | **46.5s – 51.5s**<br>`(1395 – 1545)` | *"...atmosfer Bumi membiaskan panjang gelombang merah melalui hamburan Rayleigh..."* | **Ilmiah, Memukau**.<br>Spektrum Pembiasan Merah (`#EF4444`, `#DC2626`) + Biru Terhambur (`#38BDF8`). | Animasi berkas partikel cahaya putih dari Matahari menghantam cincin atmosfer tipis Bumi: gelombang cahaya biru berhamburan menyamping, sementara gelombang merah panjang membengkok (*refraction*) menembus ke dalam kerucut bayangan Bumi. | **TopHud**: Step 4 `BLOOD MOON` aktif.<br>**Callout 4B** *(Tengah Atas)*: `HAMBURAN RAYLEIGH` *(Menunjuk berkas sinar merah membengkok di cincin atmosfer Bumi)*. |
| **4C** | **51.5s – 56.0s**<br>`(1545 – 1680)` | *"...membasahi permukaan Bulan dengan cahaya merah darah yang megah!"* | **Klimaks Penutup, Penuh Kagum**.<br>Merah Tembaga Kosmik (`#B91C1C` & `#FCA5A5`). | Kamera *zoom-in* ke wajah Bulan purnama 3D di dalam bayangan Bumi. Tekstur kawah Bulan berubah perlahan dari abu-abu dingin menjadi pijar merah darah tembaga (*Blood Moon*) yang bersinar megah menutup video. | **TopHud**: Seluruh 4 Step (`ORBIT 5°`, `SYZYGY`, `TOTALITAS`, `BLOOD MOON`) berstatus Hijau Selesai (`#16A34A`) pada frame akhir.<br>**Callout 4C** *(Kanan Tengah)*: `BLOOD MOON (GERHANA BULAN TOTAL)` *(Menunjuk permukaan Bulan merah tembaga)*. |

---

## 5. Desain Audio & Ambience (Sound Design)

- **Narasi Utama**: Suara **Fola** (`gemini-3.8-flash-tts`, pace natural, ekspresi ramah antusias & rasa kagum sains). Tidak boleh di-*speed-up* (`atempo`). Durasi komposisi mengikuti durasi audio aktual dari `ffprobe`.
- **00.0s – 15.0s (Babak 1)**: Ambient ruang angkasa lembut (*deep cosmic pad*) + suara *whoosh* halus saat pergerakan lintasan orbit 5°.
- **15.0s – 28.5s (Babak 2)**: Nada sub-bass rendah yang meninggi (*alignment resonance*) saat garis *Syzygy* mengunci lurus + dentum halus saat kerucut Umbra menyentuh Bumi.
- **28.5s – 42.0s (Babak 3)**: Hening sejenak (*dramatic drop*) saat totalitas menutup ➔ disusul gemerincing kristal berkilau (*shimmer chime*) pada kilau *Diamond Ring* & korona.
- **42.0s – 56.0s (Babak 4)**: Transisi sapuan orkestra hangat (*cosmic swell*) saat sinar pembiasan merah menembus atmosfer Bumi, diakhiri *pad* atmosfer megah yang mereda lembut (*fade out*).

---

## 6. Instruksi Handoff Produksi (Next Steps)

1. **Audio Generation (`team-video-editor` / Script TTS Runner)**:
   - Gunakan berkas bersih `/home/devcurl/workspace/saint-sejarah-firaun/tts_input.txt` untuk men-generate audio narasi suara **Fola** (`google-ai-studio`, `gemini-3.8-flash-tts`, `id-ID`).
   - Ukur durasi aktual file audio keluaran menggunakan `ffprobe`, lalu atur `durationInFrames` pada komposisi Remotion agar persis mengikuti durasi audio aktual (tanpa `atempo`).
2. **Ke `team-video-motion` & `team-video-editor`**:
   - Bangun komposisi True 3D WebGL Remotion (`1080 × 1920`, `30 FPS`) dengan komponen wajib: `Scene3DCanvas`, `EclipseOrbitalSimulation3D`, `ElevenByteTopHud`, `UxGlassHudCallout`, dan `KaraokeYellowSubtitlePill`.
   - Wajib gunakan **akumulasi fase deterministik per frame** untuk rotasi planet dan bulan agar perubahan kecepatan antar babak tidak memicu lonjakan sudut visual.
   - Wajib aktifkan `Config.setChromiumOpenGlRenderer("angle");` di `remotion.config.ts` serta jalankan render/still dengan flag `--gl=angle`.
   - Jaga posisi HUD & Subtitle tetap dalam *Safe Zone* (`top >= 180px`, `bottom >= 280px`, margin kiri/kanan `72px`).
3. **Ke `team-video-qc` (Wajib Gerbang Konfirmasi)**:
   - Setelah proses pembuatan dan render video MP4 selesai oleh Editor, **JANGAN langsung menjalankan QC otomatis**. Ajukan gerbang konfirmasi kepada pemilik terlebih dahulu: *"Apakah ingin dilanjutkan ke pemeriksaan akhir QC (Quality Control)? Balas **Ya** atau **Tidak**."*
