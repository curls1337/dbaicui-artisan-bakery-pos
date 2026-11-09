# MOTION SPEC: True 3D WebGL Orbital Simulation & Camera Rig Choreography
# Bagaimana Proses Terjadinya Gerhana Matahari & Gerhana Bulan

> **Document ID:** `MOTION-SPEC-ECLIPSE-ORBITAL-3D-001`  
> **Role / Profile:** `team-video-motion` (Visual / Motion Designer)  
> **Project Workspace:** `/home/devcurl/workspace/saint-sejarah-firaun`  
> **Slug:** `saint-sejarah-firaun`  
> **Upstream Artifacts:** `SCRIPT_STORYBOARD.md`, `ThreeDExplainerPrimitives.tsx` (`/home/devcurl/workspace/keajaiban-dunia/src/ThreeDExplainerPrimitives.tsx`)  
> **Target Output:** Vertical Reels / Shorts / TikTok (`9:16`, `1080 × 1920 px`), `30.00 fps`, Target `1.680 frames` (~56 Detik Fleksibel mengikuti durasi audio aktual TTS Fola)  
> **Visual Archetype:** **Archetype 3 — Kurzgesagt / Apple Organic Science + ElevenByte True 3D WebGL**  
> **Render Engine:** `@remotion/three` (`ThreeCanvas` + Three.js PBR Engine + ANGLE Chromium OpenGL)

---

## 1. Executive Summary & Arsitektur Motion 5 Lapisan

Spesifikasi gerakan ini menerjemahkan naskah astronomi tentang mekanika Gerhana Matahari dan Gerhana Bulan ke dalam ruang **True 3D WebGL kontinu**. Visual dirancang agar audiens dapat memahami secara spasial mengapa gerhana tidak terjadi setiap bulan (kemiringan orbit 5°), bagaimana kesejajaran garis lurus (*Syzygy*) memproyeksikan kerucut *Umbra* dan *Penumbra*, bagaimana geometri totalitas menghasilkan korona dan *Diamond Ring*, serta bagaimana pembiasan atmosfer (*Rayleigh scattering*) memandikan Bulan menjadi merah tembaga (*Blood Moon*).

### Arsitektur 5 Lapisan Visual (9:16 Mobile Viewport):
1. **Lapis 1 — True 3D WebGL Cosmic Space (`Scene3DCanvas` & `CameraRig3D`)**:
   - Ruang angkasa 3D WebGL dinamis dengan pencahayaan PBR fisik (`StudioLighting3D`), *deep space starfield* berparalaks, dan pergerakan kamera frame-driven kontinu (*Wide Orbit Overview* ➔ *Axial Fly-Through Alignment* ➔ *Macro Solar Totality Zoom* ➔ *Reverse Orbital Swing-Around*).
2. **Lapis 2 — Simulasi Mekanika Orbital (`EclipseOrbitalSimulation3D`)**:
   - Geometri 3D Matahari ber-emissive plasma surya dan korona berdenyut.
   - Geometri 3D Bumi dengan rotasi deterministik kontinu, lapisan awan, dan halo atmosfer pembiasan Rayleigh.
   - Geometri 3D Bulan dengan tekstur kawah prosedural, bergerak dinamis di sepanjang bidang orbit miring 5°.
   - Geometri volumetrik kerucut ganda bayangan 3D (*Umbra* hitam pekat transparan & *Penumbra* emas transparan).
3. **Lapis 3 — `ElevenByteTopHud` / `StudioTopProcessHud`**:
   - Safe zone atas (`top: 140px – 340px`).
   - Baris 1: Headline konteks `"ASTRONOMI KOSMIK"` (`#F8FAFC`, 48px).
   - Baris 2: Topik emas `"GERHANA MATAHARI & BULAN"` (`#F59E0B`, 50px).
   - Stepper Bar 4 Tahap: `[1. ORBIT 5°]` ➔ `[2. SYZYGY]` ➔ `[3. TOTALITAS]` ➔ `[4. BLOOD MOON]`.
   - Warna Status: Aktif = Kuning (`#FACC15`), Selesai = Hijau (`#16A34A`), Menunggu = Abu-abu (`#E2E8F0`).
4. **Lapis 4 — `UxGlassHudCallout` (VisionOS Glassmorphic Telemetry Badge)**:
   - Badge glassmorphism ber-kontras tinggi (maksimal 20% area layar) dengan garis siku penunjuk (*bent elbow leader line* `───╲●`) yang menembak langsung ke proyeksi 2D koordinat objek 3D di viewport.
5. **Lapis 5 — `KaraokeYellowSubtitlePill`**:
   - Safe zone bawah (`bottom: 310px`, `z-index: 48`).
   - Menampilkan 3–4 kata per baris dengan kotak penyorot kuning aktif (`#FACC15`, teks `#0F172A`) yang berpindah kata demi kata tersinkronisasi presisi dengan vokal Fola.

---

## 2. Kanvas 9:16 Spasial & Safe Zone Layout

```
Y = 0px ------------------------------------------------------------------- (Top Viewport)
         [ TOP RESTRICTED SAFE ZONE : Y: 0px – 180px ]
         Bebas dari header TikTok/Reels, notch HP, dan audio sticker.
Y = 180px ================================================================= (Top Safe Line)

         [ 1. TOP PROCESS HUD ZONE : Y: 140px – 360px ]
         • Headline 2 Baris: ASTRONOMI KOSMIK / GERHANA MATAHARI & BULAN
         • 4-Stage Stepper Bar: [ORBIT 5°] -> [SYZYGY] -> [TOTALITAS] -> [BLOOD MOON]

         [ 2. 3D HERO STAGE & ORBITAL CANVAS : Y: 360px – 1480px ]
         • Lebar: 1080px (Safe Margin: X: 72px – 1008px, Lebar Bersih: 936px)
         • Tinggi Efektif: 1120px
         • Fokus Kamera 3D WebGL: (X: 540, Y: 920)
         • Leader Line Callout Badge (UxGlassHudCallout) menunjuk ke target objek 3D

         [ 3. KARAOKE SUBTITLE ZONE : Y: 1540px – 1640px ]
         • KaraokeYellowSubtitlePill di bottom = 310px (Y = 1550px – 1620px)

Y = 1640px ================================================================ (Bottom Safe Line)
         [ BOTTOM RESTRICTED SAFE ZONE : Y: 1640px – 1920px (280px Buffer) ]
         Bebas dari caption platform native, username, dan action icon bar.
Y = 1920px ---------------------------------------------------------------- (Bottom Viewport)
```

---

## 3. Sistem Koordinat Dunia 3D (Unified 3D World Space)

Seluruh objek dalam simulasi orbital berada dalam satu ruang koordinat Cartesian 3D terpadu:

| Objek Astronomi | Posisi Base 3D `[x, y, z]` | Dimensi Geometri | Material & Emissive Shader |
| :--- | :--- | :--- | :--- |
| **Matahari (Sun Plasma)** | `[-3.35, 0.20, 0.00]` | `sphereGeometry(1.32, 48, 48)` | `CanvasTexture` plasma, `emissive="#F59E0B"`, `intensity=1.85`, PointLight `intensity=6.5` |
| **Bumi (Earth Sphere)** | Solar Mode: `[2.55, -0.10, 0.00]`<br>Lunar Mode: `[-0.15, 0.00, 0.00]` | `sphereGeometry(1.05, 48, 48)` | `CanvasTexture` benua hijau `#16A34A` + samudra biru `#0284C7`, Fresnel halo `#38BDF8` |
| **Bulan (Lunar Sphere)** | Miring 5°: `[0.15, 0.05, 1.40]`<br>Syzygy: `[0.15, 0.05, 0.00]`<br>Totality: `[0.00, 0.00, 0.25]`<br>Blood Moon: `[2.65, 0.00, 0.00]` | `sphereGeometry(0.46, 36, 36)` | `CanvasTexture` kawah kusam `#CBD5E1`. Berubah ke `#DC2626` / emissive `#991B1B` saat masuk Umbra Bumi |
| **Cincin Orbit Bulan (5°)** | Terpusat di Bumi, rotasi `[π/2 - 0.18, 0, 0.09]` (~5.14°) | `torusGeometry(2.45, 0.025, 16, 96)` | PBR Teal `#38BDF8`, `emissive="#0284C7"`, `opacity=0.55` |
| **Kerucut Umbra (Bayangan Inti)** | Posisi Solar: `[1.35, -0.02, 0.00]`<br>Posisi Lunar: `[1.32, 0.00, 0.00]` | `coneGeometry(r=0.44..0.85, h=2.35..2.85)` | Hitam pekat `#020617`, `emissive="#090D16"`, `opacity=0.76 * progress` |
| **Kerucut Penumbra (Bayangan Kabur)** | Membungkus Umbra, `r=0.92..1.38, h=2.45..2.95` | `coneGeometry(r=0.92..1.38, h=2.45..2.95)` | Emas transparan `#F59E0B`, `emissive="#7C2D12"`, `opacity=0.26 * progress` |
| **Bintik Gerhana Total di Bumi** | Di permukaan bumi yang menghadap Bulan: `[-0.98, 0.04, 0.00]` rel. ke Bumi | `cylinderGeometry(0.26, 0.26, 0.14)` | Silinder hitam pekat `#020617`, aktif saat `mode="solar"` & `progress > 0.6` |
| **Korona Surya (Totality)** | Terpusat di Matahari `[0, 0, 0]` | 2 Lapis `sphereGeometry(1.85, 1.70)` | Plasma streamer emas-putih `#FDE047` / `#FFFBEB`, `emissiveIntensity=2.2`, berdenyut frekuensi 0.12 |
| **Diamond Ring Flare** | Di limb kanan atas Bulan: `[1.32, 0.72, 0.15]` | `sphereGeometry(0.24, 24, 24)` | Starburst putih murni `#FFFFFF`, `emissiveIntensity=4.0` |

---

## 4. Koreografi Kamera 3D Frame-by-Frame (`CameraRig3D`)

Pergerakan kamera dikontrol secara matematis menggunakan interpolasi kontinu dan spring Remotion untuk menciptakan 4 manuver sinematik:

```
[Babak 1: Wide Orbit Overview]
Kamera: [0.0, 3.2, 9.6] -> [0.8, 1.2, 8.4] | lookAt: [0.2, 0.0, 0.0] | fov: 46° -> 42°
                    │
                    ▼ (Smooth Crane Roll)
[Babak 2: Axial Fly-Through Alignment]
Kamera: [0.6, 0.4, 7.2] -> [1.4, 0.1, 5.8] | lookAt: [1.2, 0.0, 0.0] | fov: 38° -> 34°
                    │
                    ▼ (Macro Push-In to POV Earth)
[Babak 3: Macro Solar Totality Zoom]
Kamera: [0.0, 0.0, 4.2] -> [0.0, 0.0, 3.7] | lookAt: [0.0, 0.0, 0.0] | fov: 36° -> 32°
                    │
                    ▼ (180° Reverse Orbital Swing-Around)
[Babak 4: Reverse Orbital Track Blood Moon]
Kamera: [-0.4, 1.8, 8.2] -> [1.8, 0.6, 6.2] | lookAt: [0.9, 0.0, 0.0] | fov: 42° -> 36°
```

### Rincian Koordinat Kamera Per Sub-Beat (12 Sub-Beat):

```typescript
// Helper interpolasi parameter CameraRig3D
export const getCameraRigState = (frame: number) => {
  // Babak 1: F0 - F450 (Wide Orbit Overview miring 5°)
  if (frame < 450) {
    const t = frame / 450;
    const posX = interpolate(frame, [0, 135, 315, 450], [0.0, 0.4, 0.8, 0.8], { extrapolateRight: "clamp" });
    const posY = interpolate(frame, [0, 135, 315, 450], [3.2, 2.6, 1.4, 1.1], { extrapolateRight: "clamp" });
    const posZ = interpolate(frame, [0, 135, 315, 450], [9.8, 9.2, 8.6, 8.2], { extrapolateRight: "clamp" });
    const fov  = interpolate(frame, [0, 450], [46, 42], { extrapolateRight: "clamp" });
    const lookAt: [number, number, number] = [0.2 * t, 0.0, 0.0];
    return { position: [posX, posY, posZ] as [number, number, number], lookAt, fov };
  }

  // Babak 2: F450 - F855 (Fly-Through Alignment & Syzygy Shadow Projection)
  if (frame < 855) {
    const sub = frame - 450;
    const posX = interpolate(sub, [0, 150, 285, 405], [0.8, 0.95, 1.35, 1.45], { extrapolateRight: "clamp" });
    const posY = interpolate(sub, [0, 150, 285, 405], [1.1, 0.45, 0.15, 0.08], { extrapolateRight: "clamp" });
    const posZ = interpolate(sub, [0, 150, 285, 405], [8.2, 7.4, 6.2, 5.8], { extrapolateRight: "clamp" });
    const lookX = interpolate(sub, [0, 405], [0.2, 1.3], { extrapolateRight: "clamp" });
    const fov   = interpolate(sub, [0, 405], [42, 34], { extrapolateRight: "clamp" });
    return { position: [posX, posY, posZ] as [number, number, number], lookAt: [lookX, 0, 0] as [number, number, number], fov };
  }

  // Babak 3: F855 - F1260 (Macro Solar Totality POV Close-Up)
  if (frame < 1260) {
    const sub = frame - 855;
    // Micro dolly-in halus untuk sensasi kemegahan korona
    const posZ = interpolate(sub, [0, 150, 405], [4.3, 3.9, 3.65], { extrapolateRight: "clamp" });
    const posX = interpolate(sub, [0, 405], [0.05, -0.04], { extrapolateRight: "clamp" });
    const posY = interpolate(sub, [0, 405], [0.02, -0.02], { extrapolateRight: "clamp" });
    const fov  = interpolate(sub, [0, 405], [36, 32], { extrapolateRight: "clamp" });
    return { position: [posX, posY, posZ] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number], fov };
  }

  // Babak 4: F1260 - F1680 (Reverse Orbital Swing-Around & Blood Moon Macro Zoom)
  const sub = frame - 1260;
  const posX = interpolate(sub, [0, 135, 285, 420], [-0.5, 0.4, 1.3, 1.95], { extrapolateRight: "clamp" });
  const posY = interpolate(sub, [0, 135, 285, 420], [1.9, 1.2, 0.65, 0.35], { extrapolateRight: "clamp" });
  const posZ = interpolate(sub, [0, 135, 285, 420], [8.4, 7.6, 6.7, 5.9], { extrapolateRight: "clamp" });
  const lookX = interpolate(sub, [0, 420], [0.0, 1.45], { extrapolateRight: "clamp" });
  const fov   = interpolate(sub, [0, 420], [42, 35], { extrapolateRight: "clamp" });
  return { position: [posX, posY, posZ] as [number, number, number], lookAt: [lookX, 0, 0] as [number, number, number], fov };
};
```

---

## 5. Konfigurasi Parameter `EclipseOrbitalSimulation3D`

Konfigurasi parameter per babak memandu status visual objek astronomi:

```typescript
export interface EclipseSimulationState {
  mode: "solar" | "lunar" | "totality";
  alignmentProgress: number;
  showShadowCones: boolean;
  showOrbitRings: boolean;
  keyColor: string;
  rimColor: string;
  fillColor: string;
}

export const getSimulationParams = (frame: number): EclipseSimulationState => {
  // BABAK 1: Orbit Normal & Kemiringan 5° (F0 - F450)
  // Bulan berada di bidang miring, bayangan meleset jauh di atas Bumi
  if (frame < 450) {
    return {
      mode: "solar",
      alignmentProgress: 0.12, // Offset orbit ~5°
      showOrbitRings: true,
      showShadowCones: false,
      keyColor: "#FFFFFF",
      rimColor: "#38BDF8",
      fillColor: "#F59E0B",
    };
  }

  // BABAK 2: Gerhana Matahari & Syzygy (F450 - F855)
  // Bulan meluncur tepat ke garis simpul (Node) mengunci Syzygy, Umbra & Penumbra menghantam Bumi
  if (frame < 855) {
    const sub = frame - 450;
    // Interpolasi alignment dari 0.20 menuju 1.0 (Syzygy sempurna)
    const align = interpolate(sub, [0, 240], [0.20, 1.0], {
      extrapolateRight: "clamp",
    });
    return {
      mode: "solar",
      alignmentProgress: align,
      showOrbitRings: true,
      showShadowCones: true,
      keyColor: "#FFFBEB",
      rimColor: "#F59E0B",
      fillColor: "#EA580C",
    };
  }

  // BABAK 3: Totalitas & Cincin Berlian (F855 - F1260)
  // Close-up POV Bumi: Bulan menutupi 100% fotosfer Matahari, Korona & Diamond Ring menyembur
  if (frame < 1260) {
    const sub = frame - 855;
    // Bulan bergeser mengunci totalitas dari 0.88 ke 1.0
    const align = interpolate(sub, [0, 60], [0.88, 1.0], {
      extrapolateRight: "clamp",
    });
    return {
      mode: "totality",
      alignmentProgress: align,
      showOrbitRings: false,
      showShadowCones: false,
      keyColor: "#FEF08A",
      rimColor: "#FFFFFF",
      fillColor: "#FACC15",
    };
  }

  // BABAK 4: Gerhana Bulan / Blood Moon (F1260 - F1680)
  // Bumi di tengah, Bulan meluncur masuk ke kerucut bayangan Bumi & memerah (#DC2626)
  const sub = frame - 1260;
  // Interpolasi alignment dari 0.30 menuju 1.0 (masuk penuh ke Umbra Bumi)
  const align = interpolate(sub, [0, 270], [0.30, 1.0], {
    extrapolateRight: "clamp",
  });
  return {
    mode: "lunar",
    alignmentProgress: align,
    showOrbitRings: true,
    showShadowCones: true,
    keyColor: "#EF4444",
    rimColor: "#DC2626",
    fillColor: "#7F1D1D",
  };
};
```

---

## 6. Rotasi Deterministik & Physics Simulation Engine

### 6.1 Pencegahan Lonjakan Sudut Rotasi (Accumulated Phase Math)
Untuk mencegah lompatan sudut visual saat rotasi objek berubah kecepatan antar babak, dilarang memakai rumus sesaat `frame * speed(frame)`. Gunakan **akumulasi fase per frame**:

$$\theta(t) = \sum_{k=0}^{t} \omega(k)$$

Diimplementasikan dalam TypeScript Remotion:
```typescript
export const calculateDeterministicRotation = (
  frame: number,
  baseSpeed: number,
  speedMultiplierAtFrame: (f: number) => number
): number => {
  let angle = 0;
  for (let f = 0; f < frame; f++) {
    angle += baseSpeed * speedMultiplierAtFrame(f);
  }
  return angle;
};
```

### Parameter Kecepatan Rotasi Fisik Planet:
- **Rotasi Bumi Pada Porosnya**: `baseSpeed = 0.022 rad/frame` (~0.42 putaran/menit). Kemiringan sumbu bumi = `tiltX = 0.25 rad` (~14.3° terhadap kamera).
- **Rotasi Matahari (Plasma Convection)**: `sunSpinSpeed = 0.008 rad/frame`.
- **Rotasi Bulan (Tidal Lock)**: `moonSpinSpeed = 0.015 rad/frame`.
- **Denyut Korona Surya (Plasma Streamer Oscillation)**:
  $$\text{coronaPulse} = 1.0 + 0.05 \cdot \sin(\text{frame} \cdot 0.12)$$
- **Pendar Hamburan Rayleigh Atmosfer (Babak 4)**:
  $$\text{rayleighGlow} = 0.8 + 0.25 \cdot \sin(\text{frame} \cdot 0.18)$$

---

## 7. Sistem Transisi Warna Dinamis (`interpolateColors`)

Latar belakang ruang kosmik bertransisi mulus merefleksikan 4 babak emosional naskah:

```typescript
import { interpolateColors } from "remotion";

export const getCosmicSpaceBackground = (frame: number): string => {
  return interpolateColors(
    frame,
    [
      0,    360,   // Babak 1: Deep Indigo Kosmik (Misteri & Orbit 5°)
      450,  780,   // Babak 2: Deep Dark Space Kontras (Syzygy & Bayangan Tajam)
      855,  1200,  // Babak 3: Obsidian Black Gerhana Total (Pijar Korona Surya)
      1260, 1680   // Babak 4: Cosmic Maroon / Crimson Void (Blood Moon & Rayleigh)
    ],
    [
      "#080B1A", "#080B1A", // Babak 1: Deep Indigo Kosmik
      "#050711", "#050711", // Babak 2: Gelap Kontras Sinar Surya
      "#030308", "#030308", // Babak 3: Hitam Pekat Totalitas
      "#1A0608", "#24080B"  // Babak 4: Merah Marun Kosmik Blood Moon
    ]
  );
};
```

---

## 8. Pemetaan Proyeksi 3D ke 2D Viewport & `UxGlassHudCallout`

Garis penunjuk siku (*bent elbow leader line* `───╲●`) menghubungkan lencana badge VisionOS (`x`, `y`) ke posisi 2D objek 3D di layar (`targetX`, `targetY`).

### Koordinat Terkalibrasi Viewport 9:16 (1080 × 1920 px):

| Sub-Beat | Target Objek 3D | Koordinat 3D Objek | Proyeksi 2D Layar `(targetX, targetY)` | Posisi Badge Glass `(x, y)` | Kategori Tag | Judul Lencana Callout | Data Metrik |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1A** | Bulan Melintas di Orbit | `[1.85, 0.85, 0.95]` | `(740, 760)` | `(760, 480)` | `MEKANIKA ORBIT` | `SIKLUS BULAN: 29,5 HARI` | `PERIODE SIDERIS` |
| **1B-1** | Bidang Ekliptika (0°) | `[0.00, 0.00, 0.00]` | `(540, 960)` | `(320, 1140)` | `BIDANG ACUAN` | `BIDANG EKLIPTIKA (0°)` | `ORBIT BUMI-MATAHARI` |
| **1B-2** | Busur Sudut Kemiringan | `[1.40, 0.55, 0.20]` | `(690, 840)` | `(780, 1080)` | `INKLINASI ORBIT` | `KEMIRINGAN ORBIT 5°` | `BUSUR 5,14° KOSMIK` |
| **1C** | Kerucut Bayangan Meleset | `[2.20, 1.25, 0.00]` | `(660, 680)` | `(540, 470)` | `POSISI BULAN BARU` | `BAYANGAN MELESET` | `LEWAT DI ATAS KUTUB` |
| **2A** | Garis Kesejajaran Syzygy | `[0.15, 0.05, 0.00]` | `(540, 930)` | `(540, 490)` | `KONFIGURASI LANGKA` | `SYZYGY: GARIS SEJAJAR` | `DEV = 0,00° PRESISI` |
| **2B** | Titik Kontak Umbra di Bumi | `[1.57, -0.06, 0.00]`| `(680, 970)` | `(770, 750)` | `GERHANA TOTAL` | `KERUCUT UMBRA PEKAT` | `DIAMETER ~150 KM` |
| **2C** | Selubung Melebar Penumbra| `[1.95, 0.45, 0.00]` | `(740, 840)` | `(540, 1280)` | `GERHANA PARSIAL` | `BAYANGAN PENUMBRA` | `CAKUPAN REGIONAL` |
| **3A** | Tepi Kontak Piringan Bulan | `[0.00, 0.00, 0.25]` | `(540, 920)` | `(360, 520)` | `FASE TOTALITAS` | `GERHANA MATAHARI 100%` | `OKULTASI TOTAL` |
| **3B** | Halo Pijar Korona Surya | `[1.15, -0.85, 0.00]`| `(720, 1150)`| `(760, 520)` | `PLASMA MATAHARI` | `PIJAR KORONA SURYA` | `T = 1.000.000 KELVIN` |
| **3C** | Suar Starburst Diamond Ring| `[1.32, 0.72, 0.15]` | `(765, 715)` | `(740, 1180)` | `FENOMENA LIMB` | `CINCIN BERLIAN (DIAMOND)`| `EFEK LEMBAH BULAN` |
| **4A** | Bumi Menghalangi Matahari | `[-0.15, 0.00, 0.00]`| `(520, 920)` | `(340, 680)` | `GEOMETRI KOSMIK` | `POSISI: MATAHARI-BUMI-BULAN` | `BUMI DI TENGAH` |
| **4B** | Cincin Hamburan Rayleigh | `[0.85, 0.45, 0.00]` | `(660, 860)` | `(540, 490)` | `OPTIKA ATMOSFER` | `HAMBURAN RAYLEIGH` | `REFRAKSI GELOMBANG MERAH` |
| **4C** | Wajah Bulan Merah Tembaga | `[2.65, 0.00, 0.00]` | `(790, 920)` | `(760, 1140)` | `PUNCAK GERHANA` | `BLOOD MOON KOSMIK` | `SPEKTRUM #DC2626` |

---

## 9. Matriks Beat-by-Beat Motion & Telemetri HUD Lengkap

Sinkronisasi frame demi frame untuk durasi 1.680 frame (56 detik @ 30 FPS):

| Sub-Beat | Frame Range (30fps) | Kalimat Narasi Fola | `CameraRig3D` `[x,y,z]` & `lookAt` | Parameter `EclipseOrbital` | Timing Curve & Easing | Telemetri HUD & Stepper Bar |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1A** | `F0 – F135`<br>(0.0s – 4.5s) | *"Pernahkah kamu bertanya... mengapa gerhana tidak terjadi setiap bulan?"* | Pos: `[0.0, 3.2, 9.8]` ➔ `[0.4, 2.6, 9.2]`<br>LookAt: `[0.0, 0.0, 0.0]`<br>FOV: `46° ➔ 45°` | `mode="solar"`<br>`alignmentProgress=0.12`<br>`showOrbitRings=true`<br>`showShadowCones=false` | `spring({ damping: 14, stiffness: 140 })`<br>Micro-drift horizontal: `sin(frame*0.04)*12px` | **TopHud**: Step 1 `ORBIT 5°` Aktif (`#FACC15`)<br>**Callout**: `SIKLUS BULAN: 29,5 HARI`<br>**Karaoke**: 4 kata sinkron |
| **1B** | `F135 – F315`<br>(4.5s – 10.5s) | *"Jawabannya ada pada orbit Bulan... yang memiliki kemiringan lima derajat terhadap bidang ekliptika Bumi dan Matahari."* | Pos: `[0.4, 2.6, 9.2]` ➔ `[0.8, 1.4, 8.6]`<br>LookAt: `[0.1, 0.0, 0.0]`<br>FOV: `45° ➔ 43°` | `mode="solar"`<br>`alignmentProgress=0.12`<br>Dua bidang orbit menyala:<br>Ekliptika Kuning & Orbit Teal | `interpolate(frame, [135, 315], [0, 1])`<br>Busur sudut 5° tumbuh via spring | **TopHud**: Step 1 Aktif<br>**Callout 1**: `BIDANG EKLIPTIKA (0°)`<br>**Callout 2**: `KEMIRINGAN ORBIT 5°`<br>**Karaoke**: Highlight aktif |
| **1C** | `F315 – F450`<br>(10.5s – 15.0s) | *"Akibatnya... bayangan Bulan sering kali meleset di atas atau di bawah Bumi."* | Pos: `[0.8, 1.4, 8.6]` ➔ `[0.8, 1.1, 8.2]`<br>LookAt: `[0.2, 0.0, 0.0]`<br>FOV: `43° ➔ 42°` | `mode="solar"`<br>Bulan melintas di titik atas;<br>berkas bayangan meleset di atas kutub | `interpolate(frame, [315, 450], ...)`<br>Transisi mulus tanpa jeda | **TopHud**: Step 1 Aktif<br>**Callout**: `BAYANGAN MELESET`<br>**Karaoke**: Highlight aktif |
| **2A** | `F450 – F600`<br>(15.0s – 20.0s) | *"Namun pada momen istimewa... ketiganya berbaris sejajar lurus sempurna dalam fenomena syzygy."* | Pos: `[0.8, 1.1, 8.2]` ➔ `[0.95, 0.45, 7.4]`<br>LookAt: `[0.2, 0.0, 0.0]` ➔ `[0.6, 0.0, 0.0]`<br>FOV: `42° ➔ 39°` | `mode="solar"`<br>`alignmentProgress: 0.20 ➔ 0.65`<br>Garis laser emas Syzygy menyala lurus | `spring({ damping: 16, stiffness: 160 })`<br>Laser glow pulse: `sin(frame*0.2)*0.3` | **TopHud**: Step 1 Hijau (`#16A34A`), Step 2 `SYZYGY` Kuning (`#FACC15`)<br>**Callout**: `SYZYGY: GARIS SEJAJAR` |
| **2B** | `F600 – F735`<br>(20.0s – 24.5s) | *"Bayangan Bulan pun jatuh menghantam permukaan Bumi... membentuk kerucut gelap pekat umbra..."* | Pos: `[0.95, 0.45, 7.4]` ➔ `[1.35, 0.15, 6.2]`<br>LookAt: `[0.6, 0.0, 0.0]` ➔ `[1.1, 0.0, 0.0]`<br>FOV: `39° ➔ 36°` | `mode="solar"`<br>`alignmentProgress: 0.65 ➔ 0.90`<br>`showShadowCones=true`<br>Bintik hitam Umbra di Bumi | `interpolate(frame, [600, 735], ...)`<br>Dentuman halus camera shake 2 frame pada kontak | **TopHud**: Step 2 Aktif<br>**Callout**: `KERUCUT UMBRA PEKAT`<br>**Karaoke**: Highlight aktif |
| **2C** | `F735 – F855`<br>(24.5s – 28.5s) | *"...dan area bayangan samar penumbra."* | Pos: `[1.35, 0.15, 6.2]` ➔ `[1.45, 0.08, 5.8]`<br>LookAt: `[1.1, 0.0, 0.0]` ➔ `[1.3, 0.0, 0.0]`<br>FOV: `36° ➔ 34°` | `mode="solar"`<br>`alignmentProgress: 0.90 ➔ 1.0`<br>Penumbra emas melebar semitransparan | `spring({ damping: 14, stiffness: 180 })`<br>Ekspansi kerucut luar | **TopHud**: Step 2 Aktif<br>**Callout**: `BAYANGAN PENUMBRA`<br>**Karaoke**: Highlight aktif |
| **3A** | `F855 – F1005`<br>(28.5s – 33.5s) | *"Saat piringan Bulan menutup Matahari seutuhnya... siang seketika berubah menjadi senja mistis!"* | **Macro Zoom Fly-In POV Bumi**<br>Pos: `[0.05, 0.02, 4.3]` ➔ `[0.00, 0.00, 3.9]`<br>LookAt: `[0.0, 0.0, 0.0]`<br>FOV: `36° ➔ 34°` | `mode="totality"`<br>`alignmentProgress=1.0`<br>Piringan Bulan menutup 100% Matahari | `spring({ damping: 12, stiffness: 120 })`<br>Langit meredup drastis ke `#030308` | **TopHud**: Step 2 Hijau, Step 3 `TOTALITAS` Kuning<br>**Callout**: `GERHANA MATAHARI 100%`<br>**Karaoke**: Highlight aktif |
| **3B** | `F1005 – F1125`<br>(33.5s – 37.5s) | *"Pijar korona putih keemasan menyembur di angkasa..."* | Pos: `[0.00, 0.00, 3.9]` ➔ `[-0.02, -0.01, 3.75]`<br>LookAt: `[0.0, 0.0, 0.0]`<br>FOV: `34° ➔ 33°` | `mode="totality"`<br>Korona 2 lapis merekah berdenyut:<br>`coronaPulse = 1 + 0.05*sin(frame*0.12)` | Denyutan plasma kontinu deterministik | **TopHud**: Step 3 Aktif<br>**Callout**: `PIJAR KORONA SURYA`<br>**Karaoke**: Highlight aktif |
| **3C** | `F1125 – F1260`<br>(37.5s – 42.0s) | *"...diiringi kilauan spektakuler cincin berlian di tepi cakram Bulan."* | Pos: `[-0.02, -0.01, 3.75]` ➔ `[-0.04, -0.02, 3.65]`<br>LookAt: `[0.0, 0.0, 0.0]`<br>FOV: `33° ➔ 32°` | `mode="totality"`<br>Starburst suar di `[1.32, 0.72, 0.15]`,<br>`emissiveIntensity=4.0` | `spring({ damping: 10, stiffness: 220 })`<br>Flash intensitas suar meledak | **TopHud**: Step 3 Aktif<br>**Callout**: `CINCIN BERLIAN (DIAMOND)`<br>**Karaoke**: Highlight aktif |
| **4A** | `F1260 – F1395`<br>(42.0s – 46.5s) | *"Lalu bagaimana dengan gerhana Bulan? Saat Bumi berdiri tepat di antara Matahari dan Bulan..."* | **Reverse Orbital Swing-Around**<br>Pos: `[-0.5, 1.9, 8.4]` ➔ `[0.4, 1.2, 7.6]`<br>LookAt: `[0.0, 0.0, 0.0]` ➔ `[0.5, 0.0, 0.0]`<br>FOV: `42° ➔ 39°` | `mode="lunar"`<br>`alignmentProgress: 0.30 ➔ 0.55`<br>Bumi di tengah: `[-0.15, 0, 0]` | Rotasi kamera memutar 180° via `interpolate` mulus | **TopHud**: Step 3 Hijau, Step 4 `BLOOD MOON` Kuning<br>**Callout**: `POSISI: MATAHARI-BUMI-BULAN` |
| **4B** | `F1395 – F1545`<br>(46.5s – 51.5s) | *"...atmosfer Bumi membiaskan panjang gelombang merah melalui hamburan Rayleigh..."* | Pos: `[0.4, 1.2, 7.6]` ➔ `[1.3, 0.65, 6.7]`<br>LookAt: `[0.5, 0.0, 0.0]` ➔ `[1.0, 0.0, 0.0]`<br>FOV: `39° ➔ 37°` | `mode="lunar"`<br>`alignmentProgress: 0.55 ➔ 0.85`<br>Berkas sinar biru terhambur, sinar merah membengkok menembus atmosfer | `spring({ damping: 15, stiffness: 150 })`<br>Partikel foton mengalir ke bayangan | **TopHud**: Step 4 Aktif<br>**Callout**: `HAMBURAN RAYLEIGH`<br>**Karaoke**: Highlight aktif |
| **4C** | `F1545 – F1680`<br>(51.5s – 56.0s) | *"...membasahi permukaan Bulan dengan cahaya merah darah yang megah!"* | **Macro Zoom to Blood Moon**<br>Pos: `[1.3, 0.65, 6.7]` ➔ `[1.95, 0.35, 5.9]`<br>LookAt: `[1.0, 0.0, 0.0]` ➔ `[1.45, 0.0, 0.0]`<br>FOV: `37° ➔ 35°` | `mode="lunar"`<br>`alignmentProgress: 0.85 ➔ 1.0`<br>Permukaan Bulan memerah pekat: `#DC2626`, `emissiveIntensity=0.95` | `interpolate(frame, [1545, 1680], ...)`<br>Glow halo merah darah merekah | **TopHud**: Semua 4 Step Hijau Selesai (`#16A34A`) di akhir<br>**Callout**: `BLOOD MOON KOSMIK` |

---

## 10. Zero-Static Guarantee & Micro-Physics Engine

Sesuai aturan mutlak **Zero-Static (< 3.5 detik / 105 frame)**, tidak boleh ada frame yang diam:
1. **Breathing Camera Drift**:
   ```typescript
   const microPanX = Math.sin(frame * 0.025) * 0.06;
   const microPanY = Math.cos(frame * 0.018) * 0.04;
   // Ditambahkan ke posisi CameraRig3D
   ```
2. **Deterministic Planet Rotation**:
   Bumi terus berputar `0.022 rad/frame`, Matahari berkonveksi plasma `0.008 rad/frame`, Bulan berotasi sinkron `0.015 rad/frame`.
3. **Pulsing Starfield Paralaks**:
   Lapisan partikel bintang kosmik (120 bintang) melayang perlahan dengan paralaks kedalaman `depthFactor` 0.15 – 0.40.
4. **Fluid Ray / Photon Particle Streams**:
   Sinar surya kuning pada Babak 1–2 dan sinar merah pembiasan Rayleigh pada Babak 4 digerakkan oleh pergeseran fase `(frame * 0.03) % 1.0` sehingga aliran energi kosmik tampak hidup kontinu.

---

## 11. Petunjuk Teknis Implementasi & Handoff

### A. Untuk `team-video-editor`:
1. **File Referensi Primitives**:
   Import komponen dari `/home/devcurl/workspace/keajaiban-dunia/src/ThreeDExplainerPrimitives.tsx`:
   - `Scene3DCanvas`
   - `CameraRig3D`
   - `EclipseOrbitalSimulation3D`
   - `ElevenByteTopHud` (atau `StudioTopProcessHud`)
   - `UxGlassHudCallout`
   - `KaraokeYellowSubtitlePill`
2. **Audio Sync Fleksibel**:
   - Ambil narasi dari `/home/devcurl/workspace/saint-sejarah-firaun/tts_input.txt` dengan suara Fola.
   - Ukur durasi aktual file audio dengan `ffprobe` dan pasang sebagai durasi komposisi Remotion.
3. **Renderer WebGL ANGLE**:
   - Pastikan `remotion.config.ts` memuat `Config.setChromiumOpenGlRenderer("angle");`.
   - Jalankan render atau still dengan flag `--gl=angle`.
4. **Safe Zone Verification**:
   - HUD di atas: `top: 140px – 340px`.
   - Subtitle di bawah: `bottom: 310px`.
   - Margin horizontal: minimal `72px`.

### B. Untuk `team-video-qc`:
- **Wajib Gerbang Konfirmasi**: Jangan jalankan pengujian QC otomatis sebelum menanyakan konfirmasi kepada pengguna:
  *"Apakah ingin dilanjutkan ke pemeriksaan akhir QC (Quality Control)? Balas **Ya** atau **Tidak**."*
