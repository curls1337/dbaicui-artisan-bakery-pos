import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Scene3DCanvas,
  EclipseOrbitalSimulation3D,
  ElevenByteTopHud,
  UxGlassHudCallout,
  KaraokeYellowSubtitlePill,
} from "./ThreeDExplainerPrimitives";

// ----------------------------------------------------------------------------
// SUBTITLE CUES (Word-by-word synchronised for 1778 frames / 59.24s)
// ----------------------------------------------------------------------------
interface SubtitleCue {
  start: number;
  end: number;
  words: string[];
}

const SUBTITLE_CUES: SubtitleCue[] = [
  // Babak 1: Orbit Normal & Kemiringan 5° (F0 - F476)
  { start: 0, end: 75, words: ["Pernahkah", "kamu", "bertanya..."] },
  {
    start: 75,
    end: 145,
    words: ["Mengapa", "gerhana", "tidak", "terjadi", "setiap", "bulan?"],
  },
  {
    start: 145,
    end: 235,
    words: ["Jawabannya", "ada", "pada", "orbit", "Bulan..."],
  },
  {
    start: 235,
    end: 335,
    words: ["Memiliki", "kemiringan", "lima", "derajat", "orbit"],
  },
  {
    start: 335,
    end: 405,
    words: ["Terhadap", "bidang", "ekliptika", "Bumi-Matahari."],
  },
  {
    start: 405,
    end: 476,
    words: ["Bayangan", "Bulan", "sering kali", "meleset!"],
  },

  // Babak 2: Gerhana Matahari & Syzygy (F476 - F905)
  { start: 476, end: 550, words: ["Namun", "pada", "momen", "istimewa..."] },
  {
    start: 550,
    end: 635,
    words: ["Ketiganya", "berbaris", "sejajar", "sempurna", "syzygy!"],
  },
  { start: 635, end: 705, words: ["Bayangan", "Bulan", "jatuh", "ke Bumi..."] },
  {
    start: 705,
    end: 780,
    words: ["Membentuk", "kerucut", "gelap", "pekat", "umbra..."],
  },
  {
    start: 780,
    end: 905,
    words: ["Dan", "area", "bayangan", "samar", "penumbra."],
  },

  // Babak 3: Totalitas & Cincin Berlian (F905 - F1335)
  {
    start: 905,
    end: 985,
    words: ["Saat", "piringan", "Bulan", "menutup", "Matahari..."],
  },
  {
    start: 985,
    end: 1065,
    words: ["Siang", "seketika", "berubah", "senja", "mistis!"],
  },
  {
    start: 1065,
    end: 1190,
    words: ["Pijar", "korona", "keemasan", "menyembur", "di angkasa..."],
  },
  {
    start: 1190,
    end: 1260,
    words: ["Diiringi", "kilauan", "cincin", "berlian..."],
  },
  {
    start: 1260,
    end: 1335,
    words: ["Spektakuler", "di tepi", "cakram", "Bulan!"],
  },

  // Babak 4: Gerhana Bulan & Hamburan Rayleigh (F1335 - F1778)
  {
    start: 1335,
    end: 1400,
    words: ["Lalu", "bagaimana", "gerhana", "Bulan?"],
  },
  {
    start: 1400,
    end: 1475,
    words: ["Bumi", "berdiri", "di antara", "Matahari-Bulan..."],
  },
  {
    start: 1475,
    end: 1555,
    words: ["Atmosfer", "membiaskan", "panjang", "gelombang", "merah..."],
  },
  {
    start: 1555,
    end: 1635,
    words: ["Melalui", "hamburan", "Rayleigh", "spektrum..."],
  },
  {
    start: 1635,
    end: 1705,
    words: ["Membasahi", "Bulan", "dengan", "cahaya", "merah..."],
  },
  {
    start: 1705,
    end: 1778,
    words: ["Cahaya", "merah", "darah", "yang", "megah!"],
  },
];

// ----------------------------------------------------------------------------
// STARFIELD COMPONENT (Background 3D Depth)
// ----------------------------------------------------------------------------
const SpaceStarfield: React.FC = () => {
  const stars = useMemo(() => {
    const list: [number, number, number, number][] = [];
    for (let i = 0; i < 90; i++) {
      const x = ((i * 79) % 28) - 14;
      const y = ((i * 47) % 24) - 12;
      const z = -6 - ((i * 31) % 18);
      const size = 0.035 + (i % 3) * 0.02;
      list.push([x, y, z, size]);
    }
    return list;
  }, []);

  return (
    <group>
      {stars.map(([x, y, z, sz], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <sphereGeometry args={[sz, 8, 8]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#E0F2FE"
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// MAIN EXPLAINER COMPOSITION
// ----------------------------------------------------------------------------
export const GerhanaExplainer3D: React.FC = () => {
  const frame = useCurrentFrame();

  // 1. Dynamic Space Background Color via interpolateColors
  const spaceBg = interpolateColors(
    frame,
    [0, 360, 476, 780, 905, 1200, 1335, 1778],
    [
      "#080B1A",
      "#080B1A", // Babak 1: Deep Indigo
      "#050711",
      "#050711", // Babak 2: Dark Solar Contrast
      "#030308",
      "#030308", // Babak 3: Totality Obsidian
      "#1A0608",
      "#24080B", // Babak 4: Rayleigh Maroon Blood
    ]
  );

  // 2. Stepper Stages & Active Index
  const steps = [
    "1. ORBIT 5°",
    "2. SYZYGY",
    "3. TOTALITAS",
    "4. BLOOD MOON",
  ];
  const activeStepIndex =
    frame < 476 ? 0 : frame < 905 ? 1 : frame < 1335 ? 2 : frame < 1720 ? 3 : 4;

  // 3. Camera Position, LookAt, and FOV Rig Choreography
  const cameraState = useMemo(() => {
    const driftX = Math.sin(frame * 0.025) * 0.04;
    const driftY = Math.cos(frame * 0.018) * 0.03;

    // BABAK 1: Wide Orbit Overview (F0 - F476)
    if (frame < 476) {
      const t = frame / 476;
      const posX =
        interpolate(frame, [0, 145, 335, 476], [0.0, 0.4, 0.8, 0.8], {
          extrapolateRight: "clamp",
        }) + driftX;
      const posY =
        interpolate(frame, [0, 145, 335, 476], [3.2, 2.6, 1.4, 1.1], {
          extrapolateRight: "clamp",
        }) + driftY;
      const posZ = interpolate(
        frame,
        [0, 145, 335, 476],
        [9.8, 9.2, 8.6, 8.2],
        { extrapolateRight: "clamp" }
      );
      const fov = interpolate(frame, [0, 476], [46, 42], {
        extrapolateRight: "clamp",
      });
      return {
        position: [posX, posY, posZ] as [number, number, number],
        lookAt: [0.2 * t, 0, 0] as [number, number, number],
        fov,
      };
    }

    // BABAK 2: Fly-Through Alignment & Syzygy (F476 - F905)
    if (frame < 905) {
      const sub = frame - 476;
      const posX =
        interpolate(sub, [0, 160, 300, 429], [0.8, 0.95, 1.35, 1.45], {
          extrapolateRight: "clamp",
        }) + driftX;
      const posY =
        interpolate(sub, [0, 160, 300, 429], [1.1, 0.45, 0.15, 0.08], {
          extrapolateRight: "clamp",
        }) + driftY;
      const posZ = interpolate(
        sub,
        [0, 160, 300, 429],
        [8.2, 7.4, 6.2, 5.8],
        { extrapolateRight: "clamp" }
      );
      const lookX = interpolate(sub, [0, 429], [0.2, 1.3], {
        extrapolateRight: "clamp",
      });
      const fov = interpolate(sub, [0, 429], [42, 34], {
        extrapolateRight: "clamp",
      });
      return {
        position: [posX, posY, posZ] as [number, number, number],
        lookAt: [lookX, 0, 0] as [number, number, number],
        fov,
      };
    }

    // BABAK 3: Macro Solar Totality POV Close-Up (F905 - F1335)
    if (frame < 1335) {
      const sub = frame - 905;
      const posZ = interpolate(sub, [0, 160, 430], [4.3, 3.9, 3.65], {
        extrapolateRight: "clamp",
      });
      const posX =
        interpolate(sub, [0, 430], [0.05, -0.04], {
          extrapolateRight: "clamp",
        }) + driftX;
      const posY =
        interpolate(sub, [0, 430], [0.02, -0.02], {
          extrapolateRight: "clamp",
        }) + driftY;
      const fov = interpolate(sub, [0, 430], [36, 32], {
        extrapolateRight: "clamp",
      });
      return {
        position: [posX, posY, posZ] as [number, number, number],
        lookAt: [0, 0, 0] as [number, number, number],
        fov,
      };
    }

    // BABAK 4: Reverse Orbital Track & Blood Moon (F1335 - F1778)
    const sub = frame - 1335;
    const posX =
      interpolate(sub, [0, 140, 300, 443], [-0.5, 0.4, 1.3, 1.95], {
        extrapolateRight: "clamp",
      }) + driftX;
    const posY =
      interpolate(sub, [0, 140, 300, 443], [1.9, 1.2, 0.65, 0.35], {
        extrapolateRight: "clamp",
      }) + driftY;
    const posZ = interpolate(
      sub,
      [0, 140, 300, 443],
      [8.4, 7.6, 6.7, 5.9],
      { extrapolateRight: "clamp" }
    );
    const lookX = interpolate(sub, [0, 443], [0.0, 1.45], {
      extrapolateRight: "clamp",
    });
    const fov = interpolate(sub, [0, 443], [42, 35], {
      extrapolateRight: "clamp",
    });
    return {
      position: [posX, posY, posZ] as [number, number, number],
      lookAt: [lookX, 0, 0] as [number, number, number],
      fov,
    };
  }, [frame]);

  // 4. Eclipse Orbital Simulation Parameters
  const simParams = useMemo(() => {
    if (frame < 476) {
      return {
        mode: "solar" as const,
        alignmentProgress: 0.12, // inclined 5.14°, shadow misses
        showOrbitRings: true,
        showShadowCones: false,
        keyColor: "#FFFFFF",
        rimColor: "#38BDF8",
        fillColor: "#F59E0B",
      };
    }
    if (frame < 905) {
      const align = interpolate(frame - 476, [0, 250], [0.2, 1.0], {
        extrapolateRight: "clamp",
      });
      return {
        mode: "solar" as const,
        alignmentProgress: align,
        showOrbitRings: true,
        showShadowCones: true,
        keyColor: "#FFFBEB",
        rimColor: "#F59E0B",
        fillColor: "#EA580C",
      };
    }
    if (frame < 1335) {
      const align = interpolate(frame - 905, [0, 60], [0.88, 1.0], {
        extrapolateRight: "clamp",
      });
      return {
        mode: "totality" as const,
        alignmentProgress: align,
        showOrbitRings: false,
        showShadowCones: false,
        keyColor: "#FEF08A",
        rimColor: "#FFFFFF",
        fillColor: "#FACC15",
      };
    }
    const align = interpolate(frame - 1335, [0, 280], [0.3, 1.0], {
      extrapolateRight: "clamp",
    });
    return {
      mode: "lunar" as const,
      alignmentProgress: align,
      showOrbitRings: true,
      showShadowCones: true,
      keyColor: "#EF4444",
      rimColor: "#DC2626",
      fillColor: "#7F1D1D",
    };
  }, [frame]);

  // 5. Active Subtitle Cue and Active Word Calculation
  const activeCue = useMemo(() => {
    return (
      SUBTITLE_CUES.find((c) => frame >= c.start && frame < c.end) ??
      SUBTITLE_CUES[SUBTITLE_CUES.length - 1]
    );
  }, [frame]);

  const activeWordIndex = useMemo(() => {
    const cueDuration = Math.max(1, activeCue.end - activeCue.start);
    const progress = (frame - activeCue.start) / cueDuration;
    return Math.min(
      activeCue.words.length - 1,
      Math.max(0, Math.floor(progress * activeCue.words.length))
    );
  }, [frame, activeCue]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: spaceBg,
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Vignette & Nebula Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.04) 0%, rgba(15, 23, 42, 0.40) 60%, rgba(0, 0, 0, 0.88) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Layer 1 & 2: True 3D WebGL Scene */}
      <Scene3DCanvas
        cameraPosition={cameraState.position}
        cameraLookAt={cameraState.lookAt}
        fov={cameraState.fov}
        keyColor={simParams.keyColor}
        rimColor={simParams.rimColor}
        fillColor={simParams.fillColor}
        showFloorGrid={false}
      >
        <SpaceStarfield />

        {/* Syzygy Axial Laser Beam (Babak 2) */}
        {frame >= 476 && frame < 905 && (
          <mesh position={[-0.5, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 6.5, 12]} />
            <meshStandardMaterial
              color="#FEF08A"
              emissive="#FACC15"
              emissiveIntensity={2.4 + Math.sin(frame * 0.2) * 0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
        )}

        {/* Rayleigh Red Atmospheric Refraction Beams (Babak 4) */}
        {frame >= 1335 && (
          <group>
            {[-0.35, 0.35].map((yOff, i) => (
              <mesh
                key={i}
                position={[1.2, yOff, 0]}
                rotation={[0, 0, Math.PI / 2 + (i === 0 ? 0.08 : -0.08)]}
              >
                <cylinderGeometry args={[0.025, 0.025, 2.6, 12]} />
                <meshStandardMaterial
                  color="#EF4444"
                  emissive="#DC2626"
                  emissiveIntensity={2.0 + Math.sin(frame * 0.18 + i) * 0.6}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Main Celestial Orbital Simulation */}
        <EclipseOrbitalSimulation3D
          mode={simParams.mode}
          alignmentProgress={simParams.alignmentProgress}
          showShadowCones={simParams.showShadowCones}
          showOrbitRings={simParams.showOrbitRings}
        />
      </Scene3DCanvas>

      {/* Layer 3: ElevenByte Top HUD (Header + 4-Stage Stepper Bar) */}
      <ElevenByteTopHud
        titleWhite="ASTRONOMI KOSMIK"
        titleGold="GERHANA MATAHARI & BULAN"
        steps={steps}
        activeStepIndex={activeStepIndex}
      />

      {/* Layer 4: VisionOS Telemetry Callouts per Sub-Beat */}
      {frame >= 0 && frame < 145 && (
        <UxGlassHudCallout
          x={740}
          y={560}
          targetX={540}
          targetY={720}
          tag="MEKANIKA ORBIT"
          title="SIKLUS BULAN"
          metric="29.53 HARI"
          accentColor="#FACC15"
          delay={5}
        />
      )}

      {frame >= 145 && frame < 335 && (
        <>
          <UxGlassHudCallout
            x={320}
            y={680}
            targetX={520}
            targetY={890}
            tag="BIDANG 0°"
            title="BIDANG EKLIPTIKA"
            metric="0.0° REF"
            accentColor="#38BDF8"
            delay={145}
          />
          <UxGlassHudCallout
            x={760}
            y={840}
            targetX={610}
            targetY={960}
            tag="INKLINASI"
            title="KEMIRINGAN ORBIT"
            metric="5.14° TILT"
            accentColor="#FACC15"
            delay={165}
          />
        </>
      )}

      {frame >= 335 && frame < 476 && (
        <UxGlassHudCallout
          x={540}
          y={520}
          targetX={490}
          targetY={740}
          tag="NON-SYZYGY"
          title="BAYANGAN MELESET"
          metric="> 384.400 KM"
          accentColor="#94A3B8"
          delay={335}
        />
      )}

      {frame >= 476 && frame < 635 && (
        <UxGlassHudCallout
          x={540}
          y={480}
          targetX={540}
          targetY={880}
          tag="KONJUNGSI"
          title="SYZYGY KOSMIK"
          metric="180° SEJAJAR"
          accentColor="#FACC15"
          delay={476}
        />
      )}

      {frame >= 635 && frame < 780 && (
        <UxGlassHudCallout
          x={750}
          y={760}
          targetX={620}
          targetY={910}
          tag="TOTALITAS"
          title="KERUCUT UMBRA"
          metric="100% GELAP"
          accentColor="#F8FAFC"
          delay={635}
        />
      )}

      {frame >= 780 && frame < 905 && (
        <UxGlassHudCallout
          x={340}
          y={1140}
          targetX={510}
          targetY={970}
          tag="PARSIAL"
          title="AREA PENUMBRA"
          metric="30% - 90% REDUP"
          accentColor="#38BDF8"
          delay={780}
        />
      )}

      {frame >= 905 && frame < 1065 && (
        <UxGlassHudCallout
          x={320}
          y={620}
          targetX={530}
          targetY={840}
          tag="FASIKEL"
          title="FASE TOTALITAS"
          metric="100% TERTUTUP"
          accentColor="#F8FAFC"
          delay={905}
        />
      )}

      {frame >= 1065 && frame < 1190 && (
        <UxGlassHudCallout
          x={760}
          y={660}
          targetX={640}
          targetY={790}
          tag="ATMOSFER SURYA"
          title="PIJAR KORONA"
          metric="1.000.000 K"
          accentColor="#FDE047"
          delay={1065}
        />
      )}

      {frame >= 1190 && frame < 1335 && (
        <UxGlassHudCallout
          x={760}
          y={1180}
          targetX={680}
          targetY={940}
          tag="DIAMOND RING"
          title="CINCIN BERLIAN"
          metric="PEAK FLARE"
          accentColor="#FFFFFF"
          delay={1190}
        />
      )}

      {frame >= 1335 && frame < 1475 && (
        <UxGlassHudCallout
          x={340}
          y={640}
          targetX={490}
          targetY={880}
          tag="OPOSISI"
          title="MATAHARI • BUMI • BULAN"
          metric="BUMI DI TENGAH"
          accentColor="#F8FAFC"
          delay={1335}
        />
      )}

      {frame >= 1475 && frame < 1635 && (
        <UxGlassHudCallout
          x={540}
          y={520}
          targetX={520}
          targetY={850}
          tag="SPEKTRUM"
          title="HAMBURAN RAYLEIGH"
          metric="λ = 650-700nm"
          accentColor="#EF4444"
          delay={1475}
        />
      )}

      {frame >= 1635 && frame < 1778 && (
        <UxGlassHudCallout
          x={740}
          y={920}
          targetX={580}
          targetY={960}
          tag="GERHANA BULAN"
          title="BLOOD MOON 3D"
          metric="MERAH TEMBAGA"
          accentColor="#DC2626"
          delay={1635}
        />
      )}

      {/* Layer 5: Active Word Karaoke Subtitle Pill (Bottom Safe Zone) */}
      <KaraokeYellowSubtitlePill
        words={activeCue.words}
        activeWordIndex={activeWordIndex}
      />

      {/* Synchronized Narration Audio */}
      <Audio src={staticFile("narration.wav")} />
    </AbsoluteFill>
  );
};
