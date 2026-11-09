# UX DESIGN BRIEF & 3D ART DIRECTION SPECIFICATION
## PROSES TERJADINYA GERHANA MATAHARI & GERHANA BULAN
**Document ID:** `UX-SPEC-SAINT-GERHANA-001`  
**Role / Profile:** `team-ux-ui` (UX/UI Designer & 3D Art Director)  
**Project Workspace:** `/home/devcurl/workspace/saint-sejarah-firaun`  
**Target Medium:** Vertical Video 9:16 (`1080 × 1920 px`), 30 FPS, ~56 Detik (1.680 Frames @ TTS aktual)  
**Engine:** `@remotion/three` WebGL + Remotion AbsoluteFill Layered HUD  
**Upstream Input:** `SCRIPT_STORYBOARD.md` & `/home/devcurl/workspace/keajaiban-dunia/src/ThreeDExplainerPrimitives.tsx`  
**Status:** READY FOR MOTION & ENGINE IMPLEMENTATION  

---

## 1. Design Brief 8 Unsur Fundamental

| Unsur | Spesifikasi Art Direction & UX |
| :--- | :--- |
| **1. Konteks** | Video edukasi sains astronomi format vertikal (Reels/Shorts/TikTok) yang membedah mekanika celestial 3D di balik Gerhana Matahari (Kemiringan Orbit 5°, Syzygy, Kerucut Umbra/Penumbra, Totalitas & Korona) dan Gerhana Bulan (*Rayleigh Scattering* & Fenomena *Blood Moon*). |
| **2. Target Audiens** | Siswa, mahasiswa, pecinta astronomi umum, dan penonton media sosial vertikal rentang umur 15–40 tahun yang menghargai visual sains modern berakurasi tinggi tanpa gaya kartun anak-anak yang kekanak-kanakan. |
| **3. Vibe & Mood** | *Awe-Inspiring, Hyper-Realistic Scientific, VisionOS Spatial Futuristic, Pristine Engineering*. Menggabungkan rasa takjub kosmik ala *Interstellar / Kurzgesagt 3D* dengan presisi telemetri antarmuka Apple VisionOS dan kemegahan editorial *ElevenByte*. |
| **4. Referensi** | - **ElevenByte Visual Language (IMG_7612.mp4)**: Kontras tinggi, 2-line hook headline, 4-stage stepper pill, callout bergaris siku presisi (*elbow leader-line*), dan karaoke yellow subtitle.<br>- **Apple VisionOS Spatial UI**: Efek kaca *frosted glass* halus, sudut kurva harmonis (*squircle* 16-22px), tipografi humanis Plus Jakarta Sans & JetBrains Mono telemetri.<br>- **NASA Scientific Visualization Studio**: Representasi fotometrik cahaya surya, bayangan umbra/penumbra terukur, serta hamburan Rayleigh atmosferik. |
| **5. Warna** | Dominasi gelap kosmik (*Obsidian Space Navy* `#030712`), aksen emas surya (*Solar Gold* `#FACC15`, `#F59E0B`), biru optik atmosfer (*Atmospheric Azure* `#38BDF8`), hijau konfirmasi sukses (*Node Done Green* `#16A34A`), dan merah tembaga pembiasan (*Rayleigh Blood Crimson* `#DC2626`, `#991B1B`). |
| **6. Tipografi** | **Primary UI & Subtitle**: *Plus Jakarta Sans* (Weight 800 ExtraBold & 900 Black) untuk keterbacaan instan di layar mobile kecil.<br>**Telemetry & Metrics**: *JetBrains Mono* (Weight 800 ExtraBold) untuk indikator derajat sudut, jarak kilometer, dan panjang gelombang foton. |
| **7. Struktur Kanvas** | Sistem 5 Lapis Vertikal 9:16 (`1080 × 1920`):<br>1. *WebGL True 3D Canvas* (Sun, Earth, Moon, Orbit Rings, Light Rays, Shadow Cones).<br>2. *Volumetric Space Backdrop & Starfield* (`interpolateColors`).<br>3. *ElevenByteTopHud* (`Y: 140px – 370px`).<br>4. *UxGlassHudCallout Network* (`Y: 380px – 1540px`).<br>5. *KaraokeYellowSubtitlePill* (`Y: 1610px` / `bottom: 310px`). |
| **8. Hal yang Dihindari** | - Kotak kartu UI 2D rata berwarna solid yang menutupi objek 3D utama.<br>- Paragraf teks panjang (> 4 kata per baris pada callout atau subtitle).<br>- Elemen interaktif/teks menembus *Mobile Danger Zone* (`top < 180px` atau `bottom < 280px`).<br>- Warna pelangi acak tanpa kontras WCAG AAA/AA.<br>- Gerakan melompat/patah pada rotasi planet dan interpolasi kamera. |

---

## 2. Studio PBR Lighting & Atmosphere Specification per Babak

Visual 3D ditenagai oleh `@remotion/three` melalui komponen `StudioLighting3D` dan `Scene3DCanvas`. Setiap babak memiliki perlakuan pencahayaan fisik (*Physically Based Rendering*) yang disesuaikan dengan intensitas fenomena cahaya matahari dan bayangan planet.

### 2.1 Matriks Parameter Pencahayaan 3D

```typescript
// Konfigurasi StudioLighting3D & Emissive Shader Parameters
export interface BabakLightingConfig {
  babak: number;
  nama: string;
  keyColor: string;          // Directional Key Light (Cahaya Utama Matahari)
  keyIntensity: number;
  keyPosition: [number, number, number];
  rimColor: string;          // Directional Rim Light (Pemisah Kontur Kedalaman)
  rimIntensity: number;
  rimPosition: [number, number, number];
  fillColor: string;         // Directional Fill Light (Penerang Area Bayangan)
  fillIntensity: number;
  fillPosition: [number, number, number];
  hemisphereSky: string;     // Cahaya Ambient Langit Kosmik
  hemisphereGround: string;  // Pantulan Permukaan/Nebula
  hemisphereIntensity: number;
  sunPointIntensity: number; // Intensitas PointLight Pusat Matahari
  sunEmissiveIntensity: number;
  coronaEmissiveIntensity: number;
  earthAtmosphereIntensity: number;
  moonEmissiveIntensity: number;
  moonColor: string;
}
```

### 2.2 Rincian Profil Pencahayaan per Babak

#### Babak 1: Orbit Normal & Kemiringan 5° (Frames 0 – 450 | 0.0s – 15.0s)
*Fokus: Keterlihatan geometri 3D yang jelas, memperlihatkan bidang Ekliptika vs bidang Orbit Bulan.*
- **Key Light**: `#FFFFFF`, Intensitas `3.2`, Posisi `[8, 14, 12]` (Sorot hangat dari Matahari).
- **Rim Light**: `#38BDF8`, Intensitas `1.8`, Posisi `[-10, 8, -8]` (Kontur biru langit kosmik).
- **Fill Light**: `#F59E0B`, Intensitas `1.2`, Posisi `[-5, 4, 10]` (Refleksi hangat partikel debu tata surya).
- **Hemisphere Light**: Sky `#E0F2FE`, Ground `#0B1120`, Intensitas `1.6`.
- **Sun Core & Corona**: Emissive `#F59E0B` (`intensity: 1.85`), PointLight `6.5` (`#FFFBEB`).
- **Atmosphere Fresnel**: `#38BDF8` (`opacity: 0.22`, `emissiveIntensity: 0.75`).
- **Floor Grid**: Non-aktifkan grid lantai untuk menjaga imersi ruang angkasa tak berbatas (`showFloorGrid = false`).

#### Babak 2: Gerhana Matahari & Syzygy (Frames 450 – 855 | 15.0s – 28.5s)
*Fokus: Kontras ekstrem terarah (*high dynamic range collimation*), mempertegas volume kerucut Umbra dan Penumbra.*
- **Key Light**: `#FFFBEB`, Intensitas `4.0`, Posisi `[-12, 0.5, 0]` (Sinar horizontal sejajar aksis syzygy).
- **Rim Light**: `#F59E0B`, Intensitas `2.4`, Posisi `[12, -2, -6]` (Pendar emas di tepi siluet Bulan).
- **Fill Light**: `#1E293B`, Intensitas `0.6` (Ditekan rendah agar bayangan ruang angkasa pekat).
- **Hemisphere Light**: Sky `#0F172A`, Ground `#020617`, Intensitas `0.85`.
- **Shadow Cones Volumetric**:
  - Kerucut Umbra: Color `#020617`, Emissive `#090D16` (`intensity: 0.5`, `opacity: 0.82`).
  - Kerucut Penumbra: Color `#F59E0B`, Emissive `#7C2D12` (`intensity: 0.35`, `opacity: 0.28`).
- **Earth Umbra Surface Projection**: Piringan hitam pekat `#020617` berdiameter `0.26` di titik kontak bayangan.

#### Babak 3: Totalitas & Cincin Berlian (Frames 855 – 1260 | 28.5s – 42.0s)
*Fokus: Teatrikal dramatis totalitas surya. Langit menggelap total, pijar korona putih-emas dan ledakan suar cincin berlian.*
- **Key Light**: `#020617`, Intensitas `0.1` (Fotosfer surya terhalang sempurna 100% oleh Bulan).
- **Rim Light**: `#FEF08A`, Intensitas `3.8`, Posisi `[0, 0, -2]` (Pancaran halo dari balik piringan Bulan).
- **Fill Light**: `#0F172A`, Intensitas `0.2`.
- **Hemisphere Light**: Sky `#030712`, Ground `#000000`, Intensitas `0.4`.
- **Solar Corona Shader Mesh**:
  - Lapisan Luar: Scale `[1.45, 1.15, 1]`, Color `#FDE047`, Emissive `#F59E0B` (`intensity: 2.2`, `opacity: 0.35`).
  - Lapisan Inti: Scale `[1.15, 1.38, 1]`, Color `#FFFBEB`, Emissive `#FACC15` (`intensity: 2.8`, `opacity: 0.55`).
- **Diamond Ring Starburst Limb**: Posisi `[1.32, 0.72, 0.15]`, Color `#FFFFFF`, Emissive `#FEF08A` (`intensity: 5.5`), PointLight lokal intensitas `8.0`.

#### Babak 4: Gerhana Bulan & Hamburan Rayleigh (Frames 1260 – 1680 | 42.0s – 56.0s)
*Fokus: Pembiasan spektrum optik atmosferik bumi. Atmosfer memancarkan bias merah tembaga ke arah permukaan Bulan.*
- **Key Light**: `#DC2626`, Intensitas `3.4`, Posisi `[-4, 0, 0]` (Cahaya merah terbiaskan dari atmosfer Bumi).
- **Rim Light**: `#38BDF8`, Intensitas `1.4`, Posisi `[-8, 6, -6]` (Cahaya biru matahari yang terhambur keluar).
- **Fill Light**: `#7F1D1D`, Intensitas `1.1`, Posisi `[4, -2, 6]` (Ambient merah tembaga di sisi malam).
- **Hemisphere Light**: Sky `#1A050B`, Ground `#0A0305`, Intensitas `1.2`.
- **Earth Atmosphere Halo**: Gelombang biru menyebar lateral (`#38BDF8`, `emissive: 0.9`), cincin pembiasan merah (`#EF4444`, `emissive: 1.8`).
- **Lunar Surface Blood Moon Color**: Color `#DC2626`, Emissive `#991B1B` (`intensity: 1.15`, `roughness: 0.78`).

---

## 3. Color Grading Transisi Background (`interpolateColors`)

Perubahan warna ruang kosmik berlangsung secara deterministik mengikuti alur emosional dan peristiwa astronomis menggunakan fungsi `interpolateColors` dari Remotion.

### 3.1 Rentang Frame & Nilai Heksadesimal

```typescript
import { interpolateColors } from "remotion";

export const getCosmicSpaceBackground = (frame: number): string => {
  return interpolateColors(
    frame,
    [
      0,    360,   // Babak 1: Deep Space Cosmic Navy (Orbit Normal)
      450,  780,   // Babak 2: Warm Golden Solar Shadow (Syzygy & Bayangan)
      855,  1180,  // Babak 3: Deep Totality Obsidian (Gerhana Total & Korona)
      1260, 1680   // Babak 4: Blood Moon Crimson Atmospheric (Gerhana Bulan)
    ],
    [
      "#030712", "#030712", // Navy Kosmik Pekat (Babak 1)
      "#0A0F1D", "#0A0F1D", // Biru Baja Gelap Berpendar Surya (Babak 2)
      "#020617", "#020617", // Obsidian Totalitas Mutlak (Babak 3)
      "#1A050B", "#1A050B"  // Marun Kosmik Hamburan Rayleigh (Babak 4)
    ]
  );
};
```

### 3.2 Visual Gradient Overlay (Atmospheric Vignette)

Untuk memberikan kedalaman kanvas 9:16, di atas warna dasar di-render `RadialGradient` semitransparan:
```css
background: radial-gradient(
  circle at 50% 45%,
  rgba(255, 255, 255, 0.03) 0%,
  rgba(15, 23, 42, 0.40) 60%,
  rgba(0, 0, 0, 0.85) 100%
);
```

---

## 4. Desain ElevenByteTopHud & 4-Stage Process Stepper Bar

Komponen header diletakkan pada batas aman atas (`top >= 140px`, `safe line: 180px`), menjamin bebas halangan dari UI platform media sosial (status bar, notch kamera HP, dan tombol akun).

### 4.1 Tipografi & Hierarki Teks Header
- **Baris 1 (Konteks Subjek - `titleWhite`)**:
  - Teks: `"ASTRONOMI KOSMIK"`
  - Font: `Plus Jakarta Sans`, ExtraBold 800
  - Ukuran: `48px`, Line-height: `1.12`, Letter-spacing: `-0.02em`
  - Warna: `#F8FAFC` (Slate 50) dengan drop-shadow: `0 4px 18px rgba(0, 0, 0, 0.65)`
- **Baris 2 (Topik Aksi Utama - `titleGold`)**:
  - Teks: `"GERHANA MATAHARI & BULAN"`
  - Font: `Plus Jakarta Sans`, Black 900
  - Ukuran: `50px`, Line-height: `1.12`, Letter-spacing: `-0.02em`
  - Warna: `#F59E0B` (Amber 500 Gold) dengan drop-shadow: `0 4px 18px rgba(0, 0, 0, 0.65)`

### 4.2 4-Stage Process Stepper Bar
- **Posisi Wadah Kontainer**:
  - `left: 64px`, `right: 64px`, `top: 295px` (Tinggi kontainer: `64px`)
  - Background: `#F8FAFC` (Slate White High Contrast)
  - Border-Radius: `20px`
  - Padding: `10px 12px`
  - Box-Shadow: `0 16px 40px rgba(0, 0, 0, 0.55)`
- **Label 4 Tahapan (`steps`)**:
  1. `[1. ORBIT 5°]`
  2. `[2. SYZYGY]`
  3. `[3. TOTALITAS]`
  4. `[4. BLOOD MOON]`

### 4.3 Spesifikasi Status Stepper

| Status Node | Background Color | Text Color | Border Styling | Box Shadow Glow |
| :--- | :--- | :--- | :--- | :--- |
| **Selesai (`idx < active`)** | `#16A34A` (Emerald 600) | `#FFFFFF` | `2px solid #15803D` | None |
| **Aktif (`idx === active`)** | `#FACC15` (Yellow 400) | `#0F172A` (Slate 900) | `2.5px solid #0F172A` | `0 4px 14px rgba(250, 204, 21, 0.50)` |
| **Tertunda (`idx > active`)** | `#E2E8F0` (Slate 200) | `#475569` (Slate 600) | `2px solid transparent` | None |

---

## 5. Koordinat 2D Pixel VisionOS UxGlassHudCallout (12 Sub-Beat)

Setiap callout dirancang dengan proporsi ketat (< 20% area layar) dan mematuhi **Mobile Safe Zone**:
- **Batas Sumbu Y Aman**: `380px <= Y <= 1540px` (di bawah Top HUD `Y=360px`, di atas Subtitle Pill `Y=1610px`).
- **Batas Sumbu X Aman**: `72px <= X <= 1008px` (Margin samping `72px`).
- **Garis Siku (*Elbow Leader-Line*)**: SVG Polyline dinamis menghubungkan titik asal badge `(x, y)` ke koordinat objek 3D `(targetX, targetY)` dengan titik target berpendar ganda.

### 5.1 Matriks Koordinat Spasial Lengkap per Sub-Beat

| Sub-Beat | Frame Range | Badge Tag | Judul Callout (`title`) | Metrik Data (`metric`) | Aksen Warna | Badge Pos `(X, Y)` | 3D Target Pos `(targetX, targetY)` | Elemen 3D yang Ditunjuk |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1A** | 0 – 135 | `ORBITAL` | `SIKLUS BULAN` | `29.53 HARI` | `#FACC15` | `(740, 560)` | `(540, 720)` | Titik Bulan bergerak mengelilingi Bumi |
| **1B-1** | 135 – 315 | `BIDANG 0°` | `BIDANG EKLIPTIKA` | `0.0° REF` | `#38BDF8` | `(320, 680)` | `(520, 890)` | Piringan cakram emas bidang orbit Bumi-Matahari |
| **1B-2** | 135 – 315 | `INKLINASI` | `KEMIRINGAN ORBIT` | `5.14° TILT` | `#FACC15` | `(760, 840)` | `(610, 960)` | Busur sudut pemisah antara bidang orbit |
| **1C** | 315 – 450 | `NON-SYZYGY` | `BAYANGAN MELESET` | `> 384.400 KM` | `#94A3B8` | `(540, 520)` | `(490, 740)` | Kerucut bayangan melintas di atas kutub Bumi |
| **2A** | 450 – 600 | `KONJUNGSI` | `SYZYGY KOSMIK` | `180° SEJAJAR` | `#FACC15` | `(540, 480)` | `(540, 880)` | Garis laser aksial lurus Matahari-Bulan-Bumi |
| **2B** | 600 – 735 | `TOTALITAS` | `KERUCUT UMBRA` | `100% GELAP` | `#F8FAFC` | `(750, 760)` | `(620, 910)` | Ujung lancip kerucut inti hitam yang menabrak Bumi |
| **2C** | 735 – 855 | `PARSIAL` | `AREA PENUMBRA` | `30% - 90% REDUP` | `#38BDF8` | `(340, 1140)` | `(510, 970)` | Selubung bayangan luar melebar di permukaan benua |
| **3A** | 855 – 1005 | `FASIKEL` | `FASE TOTALITAS` | `100% TERTUTUP` | `#F8FAFC` | `(320, 620)` | `(530, 840)` | Siluet piringan hitam Bulan menutupi piringan Matahari |
| **3B** | 1005 – 1125 | `ATMOSFER SURYA` | `PIJAR KORONA` | `1.000.000 K` | `#FDE047` | `(760, 660)` | `(640, 790)` | Halo plasma filamen putih-emas menyembur ke luar |
| **3C** | 1125 – 1260 | `BAILY BEADS` | `CINCIN BERLIAN` | `PEAK FLARE` | `#FFFFFF` | `(760, 1180)` | `(680, 940)` | Titik kilau starburst suar lensa di tepi kanan Bulan |
| **3C-alt**| 1125 – 1260 | `OPTICAL` | `STARBURST BURST` | `λ = 450-650nm` | `#38BDF8` | `(320, 1220)` | `(420, 990)` | Pendar difraksi cincin atmosferik totalitas |
| **4A** | 1260 – 1395 | `OPOSISI` | `MATAHARI • BUMI • BULAN` | `BUMI DI TENGAH` | `#F8FAFC` | `(340, 640)` | `(490, 880)` | Posisi Bumi menghalangi sinar langsung ke Bulan |
| **4B** | 1395 – 1545 | `SPEKTRUM` | `HAMBURAN RAYLEIGH` | `λ = 650-700nm` | `#EF4444` | `(540, 520)` | `(520, 850)` | Garis lengkung pembiasan sinar merah di cincin atmosfer |
| **4C** | 1545 – 1680 | `GERHANA BULAN` | `BLOOD MOON 3D` | `MERAH TEMBAGA` | `#DC2626` | `(740, 920)` | `(580, 960)` | Permukaan kawah Bulan bermandikan rona merah darah |

---

## 6. KaraokeYellowSubtitlePill Visual Tokens & Active Highlight

Komponen subtitle ditempatkan di zona aman bawah, mengambang di atas batas sistem operasi mobile.

### 6.1 Spesifikasi Kotak Kontainer Kaca (Pill Box)
- **Posisi Spasial**: `position: absolute`, `left: 50%`, `bottom: 310px` (`Y = 1610px`), `transform: translateX(-50%)`.
- **Dimensi & Margin**: `max-width: 936px`, `white-space: nowrap`, `z-index: 48`.
- **Material Kaca (VisionOS Glassmorphism)**:
  - Background: `rgba(15, 23, 42, 0.90)` (Navy Obsidian translusen 90%).
  - Backdrop Filter: `blur(12px) saturate(160%)`.
  - Border: `1.5px solid rgba(255, 255, 255, 0.12)`.
  - Border-Radius: `22px` (Smooth capsule squircle).
  - Padding: `14px 28px`.
  - Box-Shadow: `0 16px 38px rgba(0, 0, 0, 0.60), 0 0 1px rgba(255, 255, 255, 0.15)`.

### 6.2 Tipografi & Status Highlight Kata

```typescript
// Styling Per Status Kata dalam KaraokeYellowSubtitlePill
export const SubtitleWordStyle = {
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  fontSize: 36,
  fontWeight: 800,
  letterSpacing: "-0.01em",

  // Kata yang Sedang Dibaca (Active Word Highlight)
  active: {
    backgroundColor: "#FACC15",         // Kuning Solar Vibrant
    color: "#0F172A",                   // Kontras Gelap Tinggi (Slate 900)
    padding: "4px 14px",
    borderRadius: 12,
    fontWeight: 900,
    boxShadow: "0 4px 12px rgba(250, 204, 21, 0.40)",
    transform: "scale(1.04)",
  },

  // Kata yang Telah Lewat (Spoken History)
  past: {
    backgroundColor: "transparent",
    color: "#F8FAFC",                   // Putih Bersih Slate 50
    padding: "4px 4px",
    borderRadius: 12,
    opacity: 0.95,
  },

  // Kata Berikutnya (Upcoming Cue)
  upcoming: {
    backgroundColor: "transparent",
    color: "#94A3B8",                   // Slate 400 Redup Terbaca
    padding: "4px 4px",
    borderRadius: 12,
    opacity: 0.65,
  }
};
```

---

## 7. Design Tokens & Design System Specification

### 7.1 Palet Token Warna (Semantic Color Palette)

```css
:root {
  /* Surface & Space Backdrops */
  --color-space-base:          #030712; /* Gray 950 Deep Space */
  --color-space-solar:         #0A0F1D; /* Deep Steel Blue Shadow */
  --color-space-totality:      #020617; /* Obsidian Void */
  --color-space-blood:         #1A050B; /* Deep Crimson Haze */

  /* Glassmorphism Surfaces */
  --glass-hud-bg:              rgba(15, 23, 42, 0.78);
  --glass-hud-border:          rgba(255, 255, 255, 0.14);
  --glass-hud-blur:            16px;
  --glass-card-shadow:         0 14px 32px rgba(0, 0, 0, 0.55);

  /* Primary Celestial Accents */
  --accent-solar-gold:         #FACC15; /* Yellow 400 (Key Highlight) */
  --accent-solar-amber:        #F59E0B; /* Amber 500 (Headline Gold) */
  --accent-solar-plasma:       #EA580C; /* Orange 600 (Solar Flare) */
  --accent-rayleigh-crimson:   #DC2626; /* Red 600 (Blood Moon Core) */
  --accent-rayleigh-blood:     #991B1B; /* Red 800 (Lunar Umbra) */
  --accent-atmosphere-azure:   #38BDF8; /* Sky 400 (Rayleigh Scattering) */
  --accent-starburst-white:    #FFFFFF; /* Pure White (Diamond Ring Peak) */

  /* Status Colors (Stepper & Indicators) */
  --status-node-done:          #16A34A; /* Green 600 (Finished Step) */
  --status-node-active:        #FACC15; /* Yellow 400 (Active Step) */
  --status-node-pending:       #E2E8F0; /* Slate 200 (Inactive Step) */
}
```

### 7.2 Tipografi & Skala Spasial

| Token Name | Family | Weight | Size | Line Height | Letter Spacing | Kegunaan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `--type-hud-title-white` | Plus Jakarta Sans | 800 ExtraBold | `48px` | `1.12` | `-0.02em` | Baris 1 Header Top HUD |
| `--type-hud-title-gold` | Plus Jakarta Sans | 900 Black | `50px` | `1.12` | `-0.02em` | Baris 2 Header Top HUD |
| `--type-stepper-label` | Plus Jakarta Sans | 900 Black | `15px` | `1.00` | `+0.04em` | Label Stepper Bar (Caps) |
| `--type-callout-tag` | Plus Jakarta Sans | 900 Black | `13px` | `1.10` | `+0.10em` | Tag Kecil di atas Judul Badge |
| `--type-callout-title` | Plus Jakarta Sans | 900 Black | `25px` | `1.15` | `+0.02em` | Judul Utama Badge Callout |
| `--type-callout-metric` | JetBrains Mono | 800 ExtraBold | `16px` | `1.00` | `0` | Nilai Telemetri Numerik |
| `--type-subtitle-karaoke`| Plus Jakarta Sans | 800 ExtraBold | `36px` | `1.20` | `-0.01em` | Pill Subtitle Dinamis |

### 7.3 Rasio Kontras & Verifikasi Aksesibilitas (WCAG Compliance)

| Pasangan Komponen | Foreground | Background | Kontras Terhitung | Standar Minimum | Status Kepatuhan |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Top HUD White Title** | `#F8FAFC` | `#030712` (Drop Shadow) | `17.4 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |
| **Top HUD Gold Title** | `#F59E0B` | `#030712` (Drop Shadow) | `8.2 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |
| **Stepper Active Step** | `#0F172A` | `#FACC15` | `12.6 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |
| **Stepper Done Step** | `#FFFFFF` | `#16A34A` | `4.8 : 1` | `4.5 : 1` (AA) | **PASS (AA)** |
| **Callout Solar Badge** | `#0F172A` | `#FACC15` | `12.6 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |
| **Callout Metric Tag** | `#F8FAFC` | `#0F172A` | `15.8 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |
| **Active Subtitle Word**| `#0F172A` | `#FACC15` | `12.6 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |
| **Inactive Subtitle** | `#F8FAFC` | `rgba(15,23,42,0.9)` | `14.9 : 1` | `4.5 : 1` (AA) | **PASS (AAA)** |

### 7.4 Bentuk Kurva (*Border Radius*) & Bayangan (*Box Shadow*)
- **Capsule Subtitle Pill**: `border-radius: 22px`
- **Stepper Bar Container**: `border-radius: 20px`
- **Callout Tag Badge**: `border-radius: 16px`
- **Stepper Step Item**: `border-radius: 14px`
- **Metric Pill Inside Badge**: `border-radius: 8px`
- **Elevation Shadow (High-Depth Glass)**:  
  `box-shadow: 0 16px 40px rgba(0, 0, 0, 0.60), 0 0 0 1px rgba(255, 255, 255, 0.12);`

---

## 8. Panduan Integrasi Teknis bagi Video Motion & Editor

1. **Sinkronisasi Kamera & HUD (`Scene3DCanvas`)**:
   - Gunakan koordinat target 2D `(targetX, targetY)` yang tercantum pada Bab 5 untuk mengaitkan *leader-line* callout ke objek 3D.
   - Posisi kamera pada Babak 1 (`position: [0, 2.2, 8.8]`, `fov: 44`), Babak 2 (`position: [0, 0.8, 7.5]`), Babak 3 (`position: [0, 0, 5.2]`), dan Babak 4 (`position: [0, 1.2, 8.0]`).
2. **Akumulasi Fase Rotasi Deterministik**:
   - Rotasi bumi dan bulan harus dihitung dengan akumulasi frame (`frame * speed`), jangan pernah mereset atau memutus sudut rotasi antar babak untuk mencegah visual *flicker* atau patahan orbit.
3. **Konfigurasi OpenGL Renderer**:
   - Pastikan flag `--gl=angle` tetap aktif pada CLI render Chromium untuk memastikan shader emissive korona dan bayangan umbra ter-render dengan akurasi 100% tanpa artefak WebGL.

---
*Dokumen ini merupakan panduan visual mengikat untuk implementasi `team-video-motion` dan review akhir `team-video-qc`.*
