import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * ============================================================================
 * THREE.JS + @REMOTION/THREE REALISTIC 3D ENGINEERING ENGINE (v3 ELEVENBYTE)
 * ============================================================================
 * Dirancang mengikuti standar visual referensi IMG_7612.mp4 (@elevenbyte style):
 * 1. True 3D Vertex-Displaced Water Surface + Caustics CanvasTexture + Waterfall
 *    Cascade & Foam Particles (BUKAN balok biru kaku atau tongkat putih!).
 * 2. High-Detail Procedural 3D Hardware & Engineering Sub-Meshes dengan
 *    THREE.CanvasTexture (garis blok beton, skala meter kedalaman, baut,
 *    kisi-kisi intake, sirip trafo, lilitan tembaga, label teknis mesin).
 * 3. 5 Lapisan HUD Hidup ala IMG_7612.mp4:
 *    - ElevenByteTopHeader (2 baris: Konteks Putih + Aksi Kuning Emas)
 *    - ProcessStepperBar (Bar 6 tahapan: Hijau = Selesai, Kuning = Aktif)
 *    - EngineeringElbowCallout (Badge tegas dengan garis penunjuk siku ───╲●)
 *    - KaraokeYellowSubtitlePill (Subtitle 3-4 kata dengan kotak highlight kuning)
 */

// ----------------------------------------------------------------------------
// HELPER: PROCEDURAL CANVAS TEXTURE GENERATORS (For Realistic 3D Surfaces)
// ----------------------------------------------------------------------------
function createWaterCausticsTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Deep ocean-to-cyan gradient base
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, "#0284C7");
  grad.addColorStop(0.5, "#0EA5E9");
  grad.addColorStop(1, "#0369A1");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle organic water caustic wave bands
  ctx.strokeStyle = "rgba(186, 230, 253, 0.35)";
  ctx.lineWidth = 3;
  for (let row = 0; row < 16; row++) {
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 16) {
      const y =
        row * 32 +
        Math.sin((x / 512) * Math.PI * 4 + row) * 10 +
        Math.cos((x / 512) * Math.PI * 2 - row) * 6;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Highlight foam speckles
  ctx.fillStyle = "rgba(224, 242, 254, 0.28)";
  for (let i = 0; i < 90; i++) {
    const rx = (i * 73) % 500;
    const ry = (i * 137) % 500;
    ctx.beginPath();
    ctx.arc(rx, ry, 2 + (i % 4), 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createConcreteDamTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#64748B";
  ctx.fillRect(0, 0, 512, 512);

  // Concrete panel grid seams & rivets
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  for (let x = 0; x <= 512; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Depth elevation ruler markings on left edge
  ctx.fillStyle = "#E2E8F0";
  ctx.font = "bold 18px monospace";
  const levels = ["120M", "100M", "80M", "60M", "40M", "20M"];
  levels.forEach((lbl, idx) => {
    const yPos = 60 + idx * 75;
    ctx.fillRect(12, yPos, 26, 4);
    ctx.fillText(lbl, 46, yPos + 7);
  });

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ----------------------------------------------------------------------------
// 1. CAMERA RIG 3D (Deterministic Frame-Driven 3D Camera Orbit & Fly-Through)
// ----------------------------------------------------------------------------
export const CameraRig3D: React.FC<{
  position: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
}> = ({ position, lookAt = [0, 0, 0], fov = 44 }) => {
  const { camera } = useThree();

  React.useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));
  }, [camera, position, lookAt, fov]);

  return null;
};

// ----------------------------------------------------------------------------
// 2. STUDIO PBR LIGHTING & 3D DEPTH ENVIRONMENT (Cinema4D / ElevenByte Style)
// ----------------------------------------------------------------------------
export const StudioLighting3D: React.FC<{
  keyColor?: string;
  rimColor?: string;
  fillColor?: string;
  showFloorGrid?: boolean;
  floorY?: number;
}> = ({
  keyColor = "#FFFFFF",
  rimColor = "#38BDF8",
  fillColor = "#F59E0B",
  showFloorGrid = true,
  floorY = -3.4,
}) => {
  return (
    <group>
      <hemisphereLight args={["#E0F2FE", "#0F172A", 1.75]} />
      <ambientLight intensity={0.9} color="#F8FAFC" />

      <directionalLight
        position={[8, 14, 12]}
        intensity={2.9}
        color={keyColor}
      />
      <directionalLight
        position={[-10, 8, -8]}
        intensity={1.7}
        color={rimColor}
      />
      <directionalLight
        position={[-5, 4, 10]}
        intensity={1.3}
        color={fillColor}
      />
      <pointLight
        position={[0, 4, 7]}
        intensity={1.8}
        distance={30}
        color={fillColor}
      />
      <pointLight
        position={[0, -1.5, 5]}
        intensity={1.5}
        distance={24}
        color={rimColor}
      />

      {showFloorGrid && (
        <group position={[0, floorY, 0]}>
          <gridHelper args={[42, 42, "#1E293B", "#0F172A"]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
            <planeGeometry args={[48, 48]} />
            <meshStandardMaterial
              color="#0B111E"
              roughness={0.8}
              metalness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------------
// 3. 3D CURVED PIPE & FLUID/ENERGY STREAM (CatmullRomCurve3 + TubeGeometry)
// ----------------------------------------------------------------------------
export const PipeFlow3D: React.FC<{
  points: [number, number, number][];
  radius?: number;
  pipeColor?: string;
  fluidColor?: string;
  flowProgress?: number; // 0 to 1
  flowSpeed?: number;
  particleCount?: number;
  pipeOpacity?: number;
}> = ({
  points,
  radius = 0.28,
  pipeColor = "#64748B",
  fluidColor = "#0EA5E9",
  flowProgress = 1,
  flowSpeed = 0.022,
  particleCount = 24,
  pipeOpacity = 0.42,
}) => {
  const frame = useCurrentFrame();

  const curve = useMemo(() => {
    const vectors = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    return new THREE.CatmullRomCurve3(vectors);
  }, [points]);

  const outerTubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, radius, 24, false);
  }, [curve, radius]);

  const innerCoreGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, radius * 0.72, 20, false);
  }, [curve, radius]);

  // Flange bolts & rings along the 3D pipe
  const flanges = useMemo(() => {
    const list: { pos: THREE.Vector3; quat: THREE.Quaternion }[] = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        tangent
      );
      list.push({ pos, quat });
    }
    return list;
  }, [curve]);

  // Streamlined elongated fluid/energy capsules flowing along the curve
  const activeStreams = useMemo(() => {
    const items: {
      pos: THREE.Vector3;
      quat: THREE.Quaternion;
      scale: number;
    }[] = [];
    if (flowProgress <= 0.01) return items;
    for (let i = 0; i < particleCount; i++) {
      const rawT = (i / particleCount + frame * flowSpeed) % 1;
      if (rawT <= flowProgress) {
        const pos = curve.getPointAt(rawT);
        const tangent = curve.getTangentAt(rawT).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          tangent
        );
        const scale = 0.85 + Math.sin(frame * 0.25 + i) * 0.2;
        items.push({ pos, quat, scale });
      }
    }
    return items;
  }, [curve, frame, flowProgress, flowSpeed, particleCount]);

  return (
    <group>
      {/* Outer Cutaway Steel/Glass Penstock Pipe */}
      <mesh geometry={outerTubeGeo}>
        <meshStandardMaterial
          color={pipeColor}
          metalness={0.55}
          roughness={0.22}
          transparent
          opacity={pipeOpacity}
        />
      </mesh>

      {/* Inner Flowing Liquid/Energy Stream Core */}
      {flowProgress > 0.02 && (
        <mesh geometry={innerCoreGeo}>
          <meshStandardMaterial
            color={fluidColor}
            emissive={fluidColor}
            emissiveIntensity={0.75 * Math.min(1, flowProgress * 1.4)}
            roughness={0.12}
            metalness={0.1}
            transparent
            opacity={0.82 * Math.min(1, flowProgress)}
          />
        </mesh>
      )}

      {/* Industrial Bolted Flange Rings */}
      {flanges.map((f, idx) => (
        <mesh key={idx} position={f.pos} quaternion={f.quat}>
          <torusGeometry args={[radius * 1.18, radius * 0.14, 14, 28]} />
          <meshStandardMaterial
            color="#CBD5E1"
            metalness={0.65}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Streamlined Flowing Water/Energy Jets Inside Pipe */}
      {activeStreams.map((p, idx) => (
        <mesh
          key={idx}
          position={p.pos}
          quaternion={p.quat}
          scale={[p.scale, p.scale * 1.8, p.scale]}
        >
          <capsuleGeometry args={[radius * 0.28, radius * 0.55, 8, 14]} />
          <meshStandardMaterial
            color="#E0F2FE"
            emissive={fluidColor}
            emissiveIntensity={1.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// 4. REALISTIC 3D HYDROELECTRIC DAM & VERTEX-WAVE WATER RESERVOIR CUTAWAY
//    (Menggantikan kotak biru kaku & 3 tongkat putih dengan gelombang air 3D nyata!)
// ----------------------------------------------------------------------------
export const HydroDamReservoir3D: React.FC<{
  position?: [number, number, number];
  gateOpenRatio?: number; // 0 (closed) to 1 (open)
  waterLevel?: number; // 0.3 to 1.0
}> = ({
  position = [0, 0, 0],
  gateOpenRatio = 0.5,
  waterLevel = 0.88,
}) => {
  const frame = useCurrentFrame();
  const waterTex = useMemo(() => createWaterCausticsTexture(), []);
  const concreteTex = useMemo(() => createConcreteDamTexture(), []);

  // Build a real 3D Vertex-Displaced Sinusoidal Water Surface Geometry!
  const waterSurfaceGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.55, 2.85, 36, 28);
    geo.rotateX(-Math.PI / 2);
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const wave1 = Math.sin(vx * 2.6 + frame * 0.14) * 0.075;
      const wave2 = Math.cos(vz * 3.1 - frame * 0.11) * 0.055;
      const ripple = Math.sin((vx + vz) * 4.5 + frame * 0.18) * 0.025;
      posAttr.setY(i, wave1 + wave2 + ripple);
    }
    geo.computeVertexNormals();
    return geo;
  }, [frame]);

  const waterHeight = 2.35 * waterLevel;
  const surfaceY = -1.32 + waterHeight;

  return (
    <group position={position}>
      {/* 1. ROCKY CANYON & REINFORCED RESERVOIR BASIN FLOOR */}
      <mesh position={[-2.05, -1.55, 0]}>
        <boxGeometry args={[4.1, 0.48, 3.3]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* Canyon Back Wall with Rock Strata Layers */}
      <mesh position={[-2.05, 0.28, -1.55]}>
        <boxGeometry args={[4.1, 3.6, 0.32]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.7}
          metalness={0.18}
        />
      </mesh>
      {/* Left Upstream Retaining Wall */}
      <mesh position={[-3.95, 0.15, 0]}>
        <boxGeometry args={[0.32, 3.3, 3.3]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.68}
          metalness={0.2}
        />
      </mesh>

      {/* 2. LAYERED TRANSLUCENT 3D WATER BODY + VERTEX WAVE SURFACE */}
      {/* Deep Water Lower Layer */}
      <mesh position={[-2.05, -1.32 + waterHeight * 0.48, 0]}>
        <boxGeometry args={[3.55, waterHeight * 0.96, 2.85]} />
        <meshStandardMaterial
          map={waterTex}
          color="#0284C7"
          emissive="#0369A1"
          emissiveIntensity={0.35}
          roughness={0.1}
          metalness={0.12}
          transparent
          opacity={0.86}
        />
      </mesh>

      {/* True 3D Vertex-Displaced Sinusoidal Water Surface Mesh */}
      <mesh
        geometry={waterSurfaceGeo}
        position={[-2.05, surfaceY, 0]}
      >
        <meshStandardMaterial
          map={waterTex}
          color="#38BDF8"
          emissive="#0EA5E9"
          emissiveIntensity={0.45}
          roughness={0.08}
          metalness={0.22}
          transparent
          opacity={0.94}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Submerged Swirling 3D Water Streamlines & Rising Micro-Bubbles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const streamProgress = ((frame * 0.025 + i * 0.11) % 1);
        const bx = -3.6 + streamProgress * 3.1;
        const by =
          -1.0 +
          ((i % 4) * 0.45) * waterLevel +
          Math.sin(frame * 0.12 + i) * 0.08;
        const bz = -1.0 + ((i * 0.37) % 2.0);
        return (
          <mesh key={i} position={[bx, by, bz]}>
            <sphereGeometry args={[0.045 + (i % 3) * 0.02, 12, 12]} />
            <meshStandardMaterial
              color="#E0F2FE"
              emissive="#7DD3FC"
              emissiveIntensity={1.1}
              transparent
              opacity={0.75}
            />
          </mesh>
        );
      })}

      {/* 3. ARCHITECTURAL CONCRETE GRAVITY DAM WITH BUTTRESSES, SPILLWAY & INTAKE */}
      <group position={[0.15, 0.1, 0]}>
        {/* Main Textured Concrete Dam Core */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.25, 3.45, 3.25]} />
          <meshStandardMaterial
            map={concreteTex}
            color="#94A3B8"
            roughness={0.48}
            metalness={0.28}
          />
        </mesh>

        {/* Sloped Downstream Spillway Apron */}
        <mesh position={[0.65, -0.22, 0]} rotation={[0, 0, 0.24]}>
          <boxGeometry args={[0.85, 3.25, 3.05]} />
          <meshStandardMaterial
            color="#CBD5E1"
            roughness={0.45}
            metalness={0.3}
          />
        </mesh>

        {/* Structural Concrete Buttress Ribs Along Downstream Face */}
        {[-1.15, 0, 1.15].map((zOff, idx) => (
          <mesh
            key={idx}
            position={[0.82, -0.25, zOff]}
            rotation={[0, 0, 0.24]}
          >
            <boxGeometry args={[0.45, 3.15, 0.26]} />
            <meshStandardMaterial
              color="#64748B"
              roughness={0.5}
              metalness={0.35}
            />
          </mesh>
        ))}

        {/* Dam Crest Roadway, Parapet Walls & Spillway Gantry Crane */}
        <mesh position={[0.12, 1.82, 0]}>
          <boxGeometry args={[1.65, 0.24, 3.35]} />
          <meshStandardMaterial
            color="#E2E8F0"
            roughness={0.35}
            metalness={0.4}
          />
        </mesh>
        {/* Top Gantry Hoist Frame Above Sluice Gate */}
        <mesh position={[-0.48, 2.25, 0]}>
          <boxGeometry args={[0.38, 0.65, 1.55]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.65}
            roughness={0.25}
          />
        </mesh>

        {/* Intake Trash Rack Grill Bars (Kisi-kisi Penyaring Baja) */}
        {[-0.45, -0.22, 0, 0.22, 0.45].map((zBar, idx) => (
          <mesh key={idx} position={[-0.66, -0.55, zBar]}>
            <cylinderGeometry args={[0.025, 0.025, 1.45, 10]} />
            <meshStandardMaterial
              color="#CBD5E1"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* Hydraulic Piston Rod Lifting the Sluice Gate */}
        <mesh position={[-0.58, 1.05, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 14]} />
          <meshStandardMaterial
            color="#F8FAFC"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Heavy Industrial Sluice Gate (Pintu Air Baja Kuning-Hitam) */}
        <group position={[-0.58, -0.52 + gateOpenRatio * 1.15, 0]}>
          <mesh>
            <boxGeometry args={[0.2, 1.28, 1.35]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#D97706"
              emissiveIntensity={0.3}
              metalness={0.55}
              roughness={0.22}
            />
          </mesh>
          {/* Horizontal Steel Reinforcement Ribs on Gate */}
          {[-0.38, 0, 0.38].map((ry, i) => (
            <mesh key={i} position={[-0.08, ry, 0]}>
              <boxGeometry args={[0.08, 0.12, 1.38]} />
              <meshStandardMaterial
                color="#1E293B"
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>

        {/* Whitewater Foam & Vortex Jets Gushing Through Open Gate */}
        {gateOpenRatio > 0.08 &&
          Array.from({ length: 12 }).map((_, i) => {
            const p = ((frame * 0.06 + i * 0.08) % 1);
            const gx = -0.85 + p * 0.9;
            const gy = -0.95 - p * 0.35 + Math.sin(i * 2 + frame * 0.2) * 0.08;
            const gz = -0.4 + ((i % 5) * 0.2);
            return (
              <mesh key={i} position={[gx, gy, gz]}>
                <sphereGeometry args={[0.075 * (1 - p * 0.3), 12, 12]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#38BDF8"
                  emissiveIntensity={1.4}
                />
              </mesh>
            );
          })}
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------------
// 5. 3D TURBINE + SHAFT + MAGNETIC GENERATOR STATOR/ROTOR ASSEMBLY
// ----------------------------------------------------------------------------
export const TurbineGenerator3D: React.FC<{
  position?: [number, number, number];
  spinSpeed?: number; // radians per frame
  rotationY?: number; // optional explicit cumulative rotation angle
  showGenerator?: boolean;
  electricIntensity?: number; // 0 to 1
}> = ({
  position = [0, 0, 0],
  spinSpeed = 0.16,
  rotationY: explicitRotationY,
  showGenerator = true,
  electricIntensity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const rotationY =
    typeof explicitRotationY === "number"
      ? explicitRotationY
      : frame * spinSpeed;

  return (
    <group position={position}>
      {/* LOWER SECTION: 3D FRANCIS HYDRO TURBINE RUNNER & SPIRAL SCROLL CASING */}
      <group position={[0, showGenerator ? -1.42 : 0, 0]}>
        {/* Outer Spiral Scroll Casing (Volute Cutaway) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.52, 0.3, 22, 52]} />
          <meshStandardMaterial
            color="#64748B"
            emissive="#1E293B"
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.2}
            transparent
            opacity={0.52}
          />
        </mesh>

        {/* Wicket Gates (12 Stationary Guide Vanes Around Runner) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 1.25, 0, Math.sin(a) * 1.25]}
              rotation={[0, -a + 0.35, 0]}
            >
              <boxGeometry args={[0.24, 0.52, 0.06]} />
              <meshStandardMaterial
                color="#94A3B8"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          );
        })}

        {/* Rotating 3D Francis Runner Hub, Nose Cone & 12 Curved Hydrofoil Blades */}
        <group rotation={[0, rotationY, 0]}>
          <mesh>
            <cylinderGeometry args={[0.58, 0.46, 0.72, 32]} />
            <meshStandardMaterial
              color="#E2E8F0"
              emissive="#334155"
              emissiveIntensity={0.25}
              metalness={0.65}
              roughness={0.16}
            />
          </mesh>
          {/* Lower Runner Nose Cone */}
          <mesh position={[0, -0.52, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.45, 0.42, 28]} />
            <meshStandardMaterial
              color="#CBD5E1"
              metalness={0.7}
              roughness={0.18}
            />
          </mesh>

          {Array.from({ length: 12 }).map((_, i) => {
            const bladeAngle = (i / 12) * Math.PI * 2;
            return (
              <group key={i} rotation={[0, bladeAngle, 0]}>
                <mesh position={[0.88, 0, 0]} rotation={[0.52, 0.18, 0.16]}>
                  <boxGeometry args={[0.78, 0.48, 0.085]} />
                  <meshStandardMaterial
                    color="#38BDF8"
                    emissive="#0284C7"
                    emissiveIntensity={0.48}
                    metalness={0.52}
                    roughness={0.16}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* MIDDLE SECTION: VERTICAL 3D TITANIUM DRIVE SHAFT & GUIDE BEARINGS */}
      {showGenerator && (
        <group position={[0, 0, 0]}>
          {/* Stationary Bearing Collar */}
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.42, 0.46, 0.28, 24]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.7}
              roughness={0.22}
            />
          </mesh>

          {/* Spinning Steel Shaft */}
          <group rotation={[0, rotationY, 0]}>
            <mesh>
              <cylinderGeometry args={[0.24, 0.24, 2.65, 28]} />
              <meshStandardMaterial
                color="#F1F5F9"
                emissive="#475569"
                emissiveIntensity={0.35}
                metalness={0.65}
                roughness={0.14}
              />
            </mesh>
            {/* Glowing Kinetic Torque Rings Ascending Shaft */}
            {[-0.45, 0.05, 0.55].map((yOff, idx) => (
              <mesh
                key={idx}
                position={[0, yOff, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <torusGeometry args={[0.32, 0.048, 14, 28]} />
                <meshStandardMaterial
                  color="#FDE047"
                  emissive="#F59E0B"
                  emissiveIntensity={1.25}
                />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* UPPER SECTION: 3D ELECTROMAGNETIC GENERATOR (12 Copper Stator Coils + N/S Rotor) */}
      {showGenerator && (
        <group position={[0, 1.42, 0]}>
          {/* Outer Copper Stator Windings (12 Detailed Copper Coils) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const coilAngle = (i / 12) * Math.PI * 2;
            const r = 1.38;
            const glow =
              electricIntensity * (0.55 + 0.45 * Math.sin(frame * 0.35 + i));
            return (
              <group
                key={i}
                position={[
                  Math.cos(coilAngle) * r,
                  0,
                  Math.sin(coilAngle) * r,
                ]}
                rotation={[0, -coilAngle, 0]}
              >
                <mesh>
                  <boxGeometry args={[0.32, 1.02, 0.34]} />
                  <meshStandardMaterial
                    color="#F59E0B"
                    emissive="#D97706"
                    emissiveIntensity={0.4 + glow * 1.2}
                    metalness={0.58}
                    roughness={0.18}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Upper & Lower Brushed Steel Stator End-Rings */}
          <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.12, 16, 44]} />
            <meshStandardMaterial
              color="#CBD5E1"
              metalness={0.65}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0, -0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.12, 16, 44]} />
            <meshStandardMaterial
              color="#CBD5E1"
              metalness={0.65}
              roughness={0.18}
            />
          </mesh>

          {/* Spinning 3D 4-Pole North/South Magnetic Rotor */}
          <group rotation={[0, rotationY, 0]}>
            <mesh position={[0.5, 0, 0]}>
              <boxGeometry args={[0.92, 0.84, 0.64]} />
              <meshStandardMaterial
                color="#EF4444"
                emissive="#DC2626"
                emissiveIntensity={0.6}
                metalness={0.45}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[-0.5, 0, 0]}>
              <boxGeometry args={[0.92, 0.84, 0.64]} />
              <meshStandardMaterial
                color="#3B82F6"
                emissive="#2563EB"
                emissiveIntensity={0.6}
                metalness={0.45}
                roughness={0.2}
              />
            </mesh>
          </group>

          {electricIntensity > 0.1 && (
            <pointLight
              position={[0, 0, 0]}
              intensity={3.0 * electricIntensity}
              distance={7.5}
              color="#FDE047"
            />
          )}
        </group>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------------
// 6. 3D TRANSFORMER, SUTET TRANSMISSION TOWER & ILLUMINATED HOUSE/CITY
// ----------------------------------------------------------------------------
export const PowerGridAndHouse3D: React.FC<{
  position?: [number, number, number];
  gridProgress?: number; // 0 to 1
  houseLitProgress?: number; // 0 to 1
}> = ({
  position = [0, 0, 0],
  gridProgress = 1,
  houseLitProgress = 1,
}) => {
  return (
    <group position={position}>
      {/* LEFT: 3D STEP-UP TRANSFORMER WITH COOLING RADIATOR FINS & BUSHINGS */}
      <group position={[-2.5, -0.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.45, 1.58, 1.18]} />
          <meshStandardMaterial
            color="#94A3B8"
            metalness={0.55}
            roughness={0.24}
          />
        </mesh>
        {/* Radiator Cooling Fins on Transformer Side */}
        {[-0.45, -0.22, 0, 0.22, 0.45].map((zFin, i) => (
          <mesh key={i} position={[zFin, 0, 0.64]}>
            <boxGeometry args={[0.08, 1.3, 0.16]} />
            <meshStandardMaterial
              color="#64748B"
              metalness={0.65}
              roughness={0.22}
            />
          </mesh>
        ))}
        {/* High-Voltage Porcelain Insulator Bushings */}
        {[-0.42, 0, 0.42].map((xOff, i) => (
          <mesh key={i} position={[xOff, 1.12, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.72, 18]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.7 * gridProgress}
              metalness={0.4}
              roughness={0.18}
            />
          </mesh>
        ))}
      </group>

      {/* CENTER: 3D HIGH-VOLTAGE LATTICE TOWER (Menara SUTET 3D) */}
      <group position={[0, -0.2, -0.3]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.24, 0.76, 3.65, 4]} />
          <meshStandardMaterial
            color="#E2E8F0"
            emissive="#475569"
            emissiveIntensity={0.35}
            metalness={0.55}
            roughness={0.2}
            wireframe
          />
        </mesh>
        <mesh position={[0, 1.52, 0]}>
          <boxGeometry args={[2.2, 0.14, 0.18]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.55}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[2.6, 0.14, 0.18]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.55}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 3D HIGH-VOLTAGE POWER FLOW CABLES */}
      <PipeFlow3D
        points={[
          [-2.5, 0.52, 0],
          [-1.3, 1.32, -0.15],
          [0, 1.52, -0.3],
          [1.4, 0.92, -0.1],
          [2.5, 0.12, 0.1],
        ]}
        radius={0.085}
        pipeColor="#94A3B8"
        fluidColor="#FACC15"
        flowProgress={gridProgress}
        flowSpeed={0.03}
        particleCount={18}
        pipeOpacity={0.55}
      />

      {/* RIGHT: 3D MODERN HOUSE / RESIDENCE WITH GLOWING WINDOWS */}
      <group position={[2.55, -0.75, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.85, 1.42, 1.62]} />
          <meshStandardMaterial
            color="#475569"
            roughness={0.42}
            metalness={0.25}
          />
        </mesh>
        <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.65, 1.0, 4]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.38}
            metalness={0.35}
          />
        </mesh>
        {[-0.44, 0.44].map((xWin, i) => (
          <mesh key={i} position={[xWin, 0.08, 0.83]}>
            <boxGeometry args={[0.48, 0.48, 0.06]} />
            <meshStandardMaterial
              color={houseLitProgress > 0.2 ? "#FEF08A" : "#64748B"}
              emissive="#FACC15"
              emissiveIntensity={2.5 * houseLitProgress}
            />
          </mesh>
        ))}
        {houseLitProgress > 0.2 && (
          <pointLight
            position={[0, 0.3, 1.35]}
            intensity={3.6 * houseLitProgress}
            distance={7.5}
            color="#FDE047"
          />
        )}
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------------
// 7. 3D CYBER SERVER RACK & MECHANICAL KEYBOARD (For Tech/News/Surveillance)
// ----------------------------------------------------------------------------
export const CyberServerAndKeyboard3D: React.FC<{
  position?: [number, number, number];
  activeKeyIndex?: number;
}> = ({ position = [0, 0, 0], activeKeyIndex = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <group position={position}>
      <group position={[-1.8, -0.9, 0.6]} rotation={[0.35, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 0.25, 1.1]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.5}
            roughness={0.25}
          />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const isPressed = (Math.floor(frame / 6) + activeKeyIndex) % 12 === i;
          return (
            <mesh
              key={i}
              position={[
                -0.68 + col * 0.45,
                isPressed ? 0.14 : 0.22,
                -0.28 + row * 0.28,
              ]}
            >
              <boxGeometry args={[0.34, 0.14, 0.22]} />
              <meshStandardMaterial
                color={isPressed ? "#38BDF8" : "#CBD5E1"}
                emissive={isPressed ? "#0284C7" : "#1E293B"}
                emissiveIntensity={isPressed ? 1.2 : 0.15}
                metalness={0.35}
                roughness={0.25}
              />
            </mesh>
          );
        })}
      </group>

      <PipeFlow3D
        points={[
          [-0.7, -0.8, 0.5],
          [0.4, -0.2, 0.2],
          [1.6, 0.3, 0],
        ]}
        radius={0.14}
        fluidColor="#38BDF8"
        flowProgress={1}
        flowSpeed={0.032}
      />

      <group position={[1.8, 0.1, 0]} rotation={[0, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 2.8, 1.3]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.55}
            roughness={0.22}
          />
        </mesh>
        {[-0.9, -0.45, 0, 0.45, 0.9].map((yPos, idx) => {
          const blink = Math.sin(frame * 0.3 + idx * 1.7) > 0;
          return (
            <group key={idx} position={[0, yPos, 0.66]}>
              <mesh>
                <boxGeometry args={[1.28, 0.3, 0.06]} />
                <meshStandardMaterial
                  color="#1E293B"
                  metalness={0.5}
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[-0.45, 0, 0.04]}>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshStandardMaterial
                  color={blink ? "#10B981" : "#38BDF8"}
                  emissive={blink ? "#10B981" : "#38BDF8"}
                  emissiveIntensity={1.6}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------------
// 8. STUDIO 3D TOP-LEFT 2-LINE HOOK HEADER + 6-STAGE PROCESS STEPPER BAR
// ----------------------------------------------------------------------------
export const StudioTopProcessHud: React.FC<{
  titleWhite: string;
  titleGold: string;
  steps: string[];
  activeStepIndex: number; // 0 to steps.length - 1
}> = ({ titleWhite, titleGold, steps, activeStepIndex }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 45,
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top-Left 2-Line Dynamic Headline */}
      <div
        style={{
          position: "absolute",
          left: 68,
          top: 140,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#F8FAFC",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            textShadow: "0 4px 18px rgba(0,0,0,0.65)",
          }}
        >
          {titleWhite}
        </div>
        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            color: "#F59E0B",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            textShadow: "0 4px 18px rgba(0,0,0,0.65)",
          }}
        >
          {titleGold}
        </div>
      </div>

      {/* Horizontal 6-Stage Process Stepper Bar (Green = Done, Yellow = Active, Gray = Pending) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 300,
          backgroundColor: "#F8FAFC",
          borderRadius: 20,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.55)",
        }}
      >
        {steps.map((stepLabel, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          const bg = isDone
            ? "#16A34A"
            : isCurrent
            ? "#FACC15"
            : "#E2E8F0";
          const textColor = isDone
            ? "#FFFFFF"
            : isCurrent
            ? "#0F172A"
            : "#475569";
          const border = isCurrent
            ? "2.5px solid #0F172A"
            : isDone
            ? "2px solid #15803D"
            : "2px solid transparent";

          return (
            <div
              key={stepLabel}
              style={{
                flex: 1,
                backgroundColor: bg,
                color: textColor,
                border,
                borderRadius: 14,
                padding: "12px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                boxShadow: isCurrent
                  ? "0 4px 14px rgba(250, 204, 21, 0.45)"
                  : "none",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {stepLabel}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
export const ElevenByteTopHud = StudioTopProcessHud;

// ----------------------------------------------------------------------------
// 9. ENGINEERING ELBOW-LINE CALLOUT TAG & VISION-OS HUD (IMG_7612.mp4 Style)
// ----------------------------------------------------------------------------
export const UxGlassHudCallout: React.FC<{
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  tag?: string;
  title: string;
  metric?: string;
  accentColor?: string;
  delay?: number;
}> = ({
  x,
  y,
  targetX,
  targetY,
  tag,
  title,
  metric,
  accentColor = "#FACC15",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < delay) return null;

  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // Bent Elbow Leader Line (Horizontal then angled to target point, like IMG_7612.mp4)
  const elbowX =
    typeof targetX === "number" ? x + (targetX - x) * 0.55 : x;
  const elbowY = y;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 42,
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {typeof targetX === "number" && typeof targetY === "number" && (
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <polyline
            points={`${x},${y} ${interpolate(pop, [0, 1], [x, elbowX])},${elbowY} ${interpolate(
              pop,
              [0, 1],
              [x, targetX]
            )},${interpolate(pop, [0, 1], [y, targetY])}`}
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="3.5"
            opacity={0.95 * pop}
          />
          <circle
            cx={targetX}
            cy={targetY}
            r={9 * pop}
            fill={accentColor}
            stroke="#0F172A"
            strokeWidth="3"
          />
          <circle
            cx={targetX}
            cy={targetY}
            r={20 * pop}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            opacity={0.75}
          />
        </svg>
      )}

      {/* High-Contrast Engineering Callout Badge (Yellow/Green/White Pill like IMG_7612.mp4) */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${pop})`,
          backgroundColor: accentColor,
          color: "#0F172A",
          border: "3px solid #0F172A",
          borderRadius: 16,
          padding: "10px 22px",
          boxShadow: "0 14px 32px rgba(0, 0, 0, 0.55)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {tag && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(15, 23, 42, 0.72)",
            }}
          >
            {tag}
          </div>
        )}
        <div
          style={{
            fontSize: 25,
            fontWeight: 900,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#0F172A",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        {metric && (
          <div
            style={{
              marginTop: 2,
              fontSize: 16,
              fontWeight: 800,
              fontFamily: "JetBrains Mono, monospace",
              color: "#F8FAFC",
              backgroundColor: "#0F172A",
              borderRadius: 8,
              padding: "2px 10px",
              alignSelf: "flex-start",
            }}
          >
            {metric}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// 10. KARAOKE YELLOW-BOX ACTIVE WORD SUBTITLE PILL (Bottom of IMG_7612.mp4)
// ----------------------------------------------------------------------------
export const KaraokeYellowSubtitlePill: React.FC<{
  words: string[];
  activeWordIndex: number;
}> = ({ words, activeWordIndex }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 310,
        transform: "translateX(-50%)",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(12px)",
        borderRadius: 22,
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 16px 38px rgba(0, 0, 0, 0.6)",
        border: "1.5px solid rgba(255, 255, 255, 0.12)",
        zIndex: 48,
        whiteSpace: "nowrap",
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {words.map((word, idx) => {
        const isCurrent = idx === activeWordIndex;
        const isPast = idx < activeWordIndex;
        return (
          <span
            key={`${word}-${idx}`}
            style={{
              fontSize: 36,
              fontWeight: 800,
              padding: isCurrent ? "4px 14px" : "4px 4px",
              borderRadius: 12,
              backgroundColor: isCurrent ? "#FACC15" : "transparent",
              color: isCurrent
                ? "#0F172A"
                : isPast
                ? "#F8FAFC"
                : "#94A3B8",
              transition: "all 0.1s ease",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------------
// 11. TRUE 3D SOLAR & LUNAR ECLIPSE ORBITAL SIMULATION (Sun, Moon, Earth, Umbra & Penumbra)
// ----------------------------------------------------------------------------
export const EclipseOrbitalSimulation3D: React.FC<{
  position?: [number, number, number];
  mode?: "solar" | "lunar" | "totality";
  alignmentProgress?: number; // 0 to 1 (1 = exact syzygy alignment)
  showShadowCones?: boolean;
  showOrbitRings?: boolean;
}> = ({
  position = [0, 0, 0],
  mode = "solar",
  alignmentProgress = 1,
  showShadowCones = true,
  showOrbitRings = true,
}) => {
  const frame = useCurrentFrame();

  // Procedural CanvasTextures for Sun Plasma, Earth Continents/Clouds, and Lunar Craters
  const { sunTex, earthTex, moonTex } = useMemo(() => {
    if (typeof document === "undefined") {
      return { sunTex: null, earthTex: null, moonTex: null };
    }

    // 1. Sun Plasma Texture
    const sunCanvas = document.createElement("canvas");
    sunCanvas.width = 512;
    sunCanvas.height = 256;
    const sctx = sunCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, "#FFFBEB");
      grad.addColorStop(0.35, "#FDE047");
      grad.addColorStop(0.7, "#F59E0B");
      grad.addColorStop(1, "#EA580C");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 90; i++) {
        const x = (i * 73) % 512;
        const y = (i * 41) % 256;
        const r = 6 + (i % 18);
        sctx.fillStyle = i % 3 === 0 ? "rgba(254, 249, 195, 0.45)" : "rgba(180, 83, 9, 0.32)";
        sctx.beginPath();
        sctx.arc(x, y, r, 0, Math.PI * 2);
        sctx.fill();
      }
    }
    const sTex = new THREE.CanvasTexture(sunCanvas);

    // 2. Earth Ocean + Continents + Clouds Texture
    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 512;
    earthCanvas.height = 256;
    const ectx = earthCanvas.getContext("2d");
    if (ectx) {
      const oceanGrad = ectx.createLinearGradient(0, 0, 0, 256);
      oceanGrad.addColorStop(0, "#1E3A8A");
      oceanGrad.addColorStop(0.5, "#0284C7");
      oceanGrad.addColorStop(1, "#0F172A");
      ectx.fillStyle = oceanGrad;
      ectx.fillRect(0, 0, 512, 256);

      // Continents
      ectx.fillStyle = "#16A34A";
      const patches = [
        [90, 75, 55, 38],
        [130, 145, 42, 58],
        [250, 70, 70, 44],
        [270, 135, 48, 52],
        [375, 82, 68, 42],
        [415, 165, 38, 28],
      ];
      patches.forEach(([x, y, w, h]) => {
        ectx.beginPath();
        ectx.ellipse(x, y, w, h, 0.3, 0, Math.PI * 2);
        ectx.fill();
      });

      // Cloud bands
      ectx.fillStyle = "rgba(255, 255, 255, 0.38)";
      for (let i = 0; i < 24; i++) {
        ectx.beginPath();
        ectx.ellipse((i * 67) % 512, 25 + ((i * 37) % 205), 36, 7, 0.15, 0, Math.PI * 2);
        ectx.fill();
      }
    }
    const eTex = new THREE.CanvasTexture(earthCanvas);

    // 3. Lunar Craters Texture
    const moonCanvas = document.createElement("canvas");
    moonCanvas.width = 512;
    moonCanvas.height = 256;
    const mctx = moonCanvas.getContext("2d");
    if (mctx) {
      mctx.fillStyle = "#CBD5E1";
      mctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 65; i++) {
        const cx = (i * 83) % 512;
        const cy = (i * 53) % 256;
        const cr = 5 + (i % 22);
        mctx.fillStyle = i % 4 === 0 ? "rgba(71, 85, 105, 0.55)" : "rgba(148, 163, 184, 0.5)";
        mctx.beginPath();
        mctx.arc(cx, cy, cr, 0, Math.PI * 2);
        mctx.fill();
      }
    }
    const mTex = new THREE.CanvasTexture(moonCanvas);

    return { sunTex: sTex, earthTex: eTex, moonTex: mTex };
  }, []);

  if (mode === "totality") {
    // DRAMATIC TOTAL SOLAR ECLIPSE (DIAMOND RING & SOLAR CORONA CLOSE-UP)
    const coronaPulse = 1 + 0.05 * Math.sin(frame * 0.12);
    const moonSlideX = (1 - alignmentProgress) * 1.35;
    return (
      <group position={position}>
        {/* Outer Solar Corona Streamers */}
        <mesh scale={[coronaPulse * 1.45, coronaPulse * 1.15, 1]}>
          <sphereGeometry args={[1.85, 48, 48]} />
          <meshStandardMaterial
            color="#FDE047"
            emissive="#F59E0B"
            emissiveIntensity={1.6}
            transparent
            opacity={0.28}
          />
        </mesh>
        <mesh scale={[coronaPulse * 1.15, coronaPulse * 1.38, 1]}>
          <sphereGeometry args={[1.7, 48, 48]} />
          <meshStandardMaterial
            color="#FFFBEB"
            emissive="#FACC15"
            emissiveIntensity={2.2}
            transparent
            opacity={0.45}
          />
        </mesh>
        {/* Bright Diamond Ring Flare on Limb */}
        <mesh position={[1.32, 0.72, 0.15]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FEF08A"
            emissiveIntensity={4.0}
          />
        </mesh>
        {/* Dark Silhouetted Moon Disc Blocking the Sun */}
        <mesh position={[moonSlideX, 0, 0.25]} rotation={[0, frame * 0.008, 0]}>
          <sphereGeometry args={[1.52, 48, 48]} />
          <meshStandardMaterial
            map={moonTex ?? undefined}
            color="#0F172A"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  // Orbital Positions for Solar vs Lunar Eclipse
  const sunPos: [number, number, number] = [-3.35, 0.2, 0];
  const earthPos: [number, number, number] =
    mode === "solar" ? [2.55, -0.1, 0] : [-0.15, 0, 0];

  // Smooth orbital arc into exact alignment
  const orbitOffsetAngle = (1 - alignmentProgress) * 0.68;
  const moonPos: [number, number, number] =
    mode === "solar"
      ? [
          0.15 + Math.sin(orbitOffsetAngle) * 0.6,
          0.05 + Math.sin(orbitOffsetAngle) * 0.85,
          Math.sin(orbitOffsetAngle) * 1.4,
        ]
      : [
          2.65,
          Math.sin(orbitOffsetAngle) * 0.8,
          Math.sin(orbitOffsetAngle) * 1.2,
        ];

  const isLunarRed = mode === "lunar" && alignmentProgress > 0.65;

  return (
    <group position={position}>
      {/* 1. 3D SUN WITH MULTI-LAYERED CORONA & POINT LIGHT */}
      <group position={sunPos}>
        <mesh rotation={[0, frame * 0.008, 0]}>
          <sphereGeometry args={[1.32, 48, 48]} />
          <meshStandardMaterial
            map={sunTex ?? undefined}
            color="#FDE047"
            emissive="#F59E0B"
            emissiveIntensity={1.85}
            roughness={0.2}
          />
        </mesh>
        {/* Glowing Solar Corona Shell */}
        <mesh scale={[1.18 + 0.03 * Math.sin(frame * 0.15), 1.18 + 0.03 * Math.sin(frame * 0.15), 1.18]}>
          <sphereGeometry args={[1.35, 36, 36]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#F97316"
            emissiveIntensity={1.4}
            transparent
            opacity={0.32}
          />
        </mesh>
        <pointLight intensity={6.5} distance={18} color="#FFFBEB" />
      </group>

      {/* 2. 3D EARTH WITH CONTINENTS, CLOUDS, ATMOSPHERE & UMBRA SPOT */}
      <group position={earthPos}>
        <mesh rotation={[0.25, frame * 0.022, 0]}>
          <sphereGeometry args={[1.05, 48, 48]} />
          <meshStandardMaterial
            map={earthTex ?? undefined}
            color="#38BDF8"
            roughness={0.35}
            metalness={0.12}
          />
        </mesh>
        {/* Atmosphere Fresnel Halo */}
        <mesh scale={[1.08, 1.08, 1.08]}>
          <sphereGeometry args={[1.05, 36, 36]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.75}
            transparent
            opacity={0.22}
          />
        </mesh>
        {/* Dark Umbra Totality Spot Projected on Earth Surface during Solar Eclipse */}
        {mode === "solar" && alignmentProgress > 0.6 && (
          <mesh position={[-0.98, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.14, 28]} />
            <meshStandardMaterial
              color="#020617"
              emissive="#000000"
              roughness={1}
            />
          </mesh>
        )}
      </group>

      {/* 3. 3D MOON WITH CRATERS (Turns Blood-Red in Lunar Eclipse Umbra) */}
      <group position={moonPos}>
        <mesh rotation={[0, frame * 0.015, 0]}>
          <sphereGeometry args={[0.46, 36, 36]} />
          <meshStandardMaterial
            map={moonTex ?? undefined}
            color={isLunarRed ? "#DC2626" : "#E2E8F0"}
            emissive={isLunarRed ? "#991B1B" : "#1E293B"}
            emissiveIntensity={isLunarRed ? 0.95 : 0.15}
            roughness={0.78}
            metalness={0.08}
          />
        </mesh>
      </group>

      {/* 4. INCLINED ORBITAL PATH RING */}
      {showOrbitRings && (
        <group position={earthPos} rotation={[Math.PI / 2 - 0.18, 0, 0.09]}>
          <mesh>
            <torusGeometry args={[2.45, 0.025, 16, 96]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.85}
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      )}

      {/* 5. 3D VOLUMETRIC UMBRA & PENUMBRA SHADOW CONES */}
      {showShadowCones && alignmentProgress > 0.45 && (
        <group
          position={mode === "solar" ? [1.35, -0.02, 0] : [1.32, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          {/* Core Dark Umbra Cone (Bayangan Inti) */}
          <mesh>
            <coneGeometry
              args={[
                mode === "solar" ? 0.44 : 0.85,
                mode === "solar" ? 2.35 : 2.85,
                36,
                1,
                true,
              ]}
            />
            <meshStandardMaterial
              color="#020617"
              emissive="#090D16"
              emissiveIntensity={0.5}
              transparent
              opacity={0.76 * alignmentProgress}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Outer Translucent Penumbra Cone (Bayangan Kabur) */}
          <mesh>
            <coneGeometry
              args={[
                mode === "solar" ? 0.92 : 1.38,
                mode === "solar" ? 2.45 : 2.95,
                36,
                1,
                true,
              ]}
            />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#7C2D12"
              emissiveIntensity={0.35}
              transparent
              opacity={0.26 * alignmentProgress}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* 6. SOLAR LIGHT RAYS FROM SUN TO MOON/EARTH */}
      {[-0.65, 0, 0.65].map((yRay, idx) => (
        <mesh
          key={idx}
          position={[-1.65, 0.1 + yRay * 0.65, -0.25]}
          rotation={[0, 0, Math.PI / 2 + yRay * 0.06]}
        >
          <cylinderGeometry args={[0.02, 0.02, 2.9, 12]} />
          <meshStandardMaterial
            color="#FEF08A"
            emissive="#FACC15"
            emissiveIntensity={1.5}
            transparent
            opacity={0.45}
          />
        </mesh>
      ))}
    </group>
  );
};

// ----------------------------------------------------------------------------
// 12. FULLSCREEN 3D CANVAS WRAPPER FOR REMOTION SCENES
// ----------------------------------------------------------------------------
export const Scene3DCanvas: React.FC<{
  cameraPosition?: [number, number, number];
  cameraLookAt?: [number, number, number];
  fov?: number;
  keyColor?: string;
  rimColor?: string;
  fillColor?: string;
  showFloorGrid?: boolean;
  floorY?: number;
  children: React.ReactNode;
}> = ({
  cameraPosition = [0, 2.2, 8.8],
  cameraLookAt = [0, 0, 0],
  fov = 44,
  keyColor = "#FFFFFF",
  rimColor = "#38BDF8",
  fillColor = "#F59E0B",
  showFloorGrid = true,
  floorY = -3.4,
  children,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas width={width} height={height}>
      <CameraRig3D
        position={cameraPosition}
        lookAt={cameraLookAt}
        fov={fov}
      />
      <StudioLighting3D
        keyColor={keyColor}
        rimColor={rimColor}
        fillColor={fillColor}
        showFloorGrid={showFloorGrid}
        floorY={floorY}
      />
      {children}
    </ThreeCanvas>
  );
};
