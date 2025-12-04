import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Group, Shape, Vector3 } from 'three';
import { ParticleSystem } from './ParticleSystem';
import { AppState } from '../types';
import { CONFIG } from '../constants';

interface SceneProps {
  mode: AppState;
  treeColor: string;
  ornamentColorA: string;
  ornamentColorB: string;
}

const StarTopper = () => {
    const starRef = useRef<Group>(null);
    const shape = useMemo(() => {
        const s = new Shape();
        const points = 5;
        const outerRadius = 0.8;
        const innerRadius = 0.35;
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const a = (i / (points * 2)) * Math.PI * 2;
            const x = Math.cos(a + Math.PI / 2) * r;
            const y = Math.sin(a + Math.PI / 2) * r;
            if (i === 0) s.moveTo(x, y);
            else s.lineTo(x, y);
        }
        s.closePath();
        return s;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 4
    }), []);

    useFrame((state) => {
        if(starRef.current) {
            starRef.current.rotation.y = state.clock.elapsedTime * 0.5;
            // Gentle floating
            starRef.current.position.y = CONFIG.TREE_HEIGHT / 2 + 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    return (
        <group ref={starRef} position={[0, CONFIG.TREE_HEIGHT / 2 + 0.5, 0]}>
            <mesh>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial 
                    color={CONFIG.COLORS.GOLD_METALLIC} 
                    emissive={CONFIG.COLORS.GOLD_METALLIC}
                    emissiveIntensity={2.5}
                    roughness={0.1}
                    metalness={1.0}
                />
            </mesh>
            {/* The actual light source for the star */}
            <pointLight 
                intensity={40} 
                distance={15} 
                color={CONFIG.COLORS.GOLD_METALLIC} 
                decay={2} 
            />
        </group>
    );
}

const GiftBox = ({ position, rotation, scale, color }: { position: [number, number, number], rotation: number, scale: number, color: string }) => {
    return (
        <group position={position} rotation={[0, rotation, 0]} scale={scale}>
            {/* Box */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Ribbon Vertical */}
            <mesh position={[0, 0.5, 0]} scale={[1.02, 1, 0.2]}>
                <boxGeometry args={[1, 1.02, 1]} />
                <meshStandardMaterial color="#FFF" roughness={0.8} />
            </mesh>
             {/* Ribbon Horizontal */}
             <mesh position={[0, 0.5, 0]} scale={[0.2, 1, 1.02]}>
                <boxGeometry args={[1, 1.02, 1]} />
                <meshStandardMaterial color="#FFF" roughness={0.8} />
            </mesh>
        </group>
    );
};

const Gifts = () => {
    const giftData = useMemo(() => {
        const items = [];
        const count = 16;
        const colors = ['#8B0000', '#004225', '#D4AF37', '#1a1a1a'];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            const radius = CONFIG.TREE_BASE_RADIUS + 1.5 + Math.random() * 2.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const s = 0.5 + Math.random() * 0.5;
            items.push({
                pos: [x, -CONFIG.TREE_HEIGHT/2, z] as [number, number, number],
                rot: Math.random() * Math.PI,
                scale: s,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        return items;
    }, []);

    return (
        <group>
            {giftData.map((g, i) => (
                <GiftBox key={i} position={g.pos} rotation={g.rot} scale={g.scale} color={g.color} />
            ))}
        </group>
    );
}


export const Scene: React.FC<SceneProps> = ({ mode, treeColor, ornamentColorA, ornamentColorB }) => {
  const groupRef = useRef<Group>(null);

  // Slowly rotate the entire tree group for cinematic feel
  useFrame((state) => {
    if (groupRef.current && mode === AppState.TREE_SHAPE) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        maxDistance={40} 
        minDistance={5} 
        autoRotate={mode === AppState.SCATTERED}
        autoRotateSpeed={0.5}
      />

      {/* Lighting System */}
      <ambientLight intensity={0.4} />
      
      {/* Main warm light */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.4} 
        penumbra={1} 
        intensity={300} 
        castShadow 
        color="#fffaed"
      />
      
      {/* Rim light for drama */}
      <spotLight 
        position={[-15, 5, -10]} 
        intensity={200} 
        color="#ffffff"
      />
      
      {/* Gold fill light from bottom */}
      <pointLight position={[0, -5, 5]} intensity={80} color={CONFIG.COLORS.GOLD_METALLIC} distance={25} />

      {/* 3D Content */}
      <group ref={groupRef}>
        <ParticleSystem 
            mode={mode} 
            treeColor={treeColor}
            ornamentColorA={ornamentColorA}
            ornamentColorB={ornamentColorB}
        />
        
        {/* Animated Star Topper */}
        <group scale={mode === AppState.TREE_SHAPE ? 1 : 0} >
             <StarTopper />
        </group>
        
        {/* Gifts at the base */}
        <group visible={mode === AppState.TREE_SHAPE}>
            <Gifts />
        </group>
      </group>

      {/* Environment Atmospherics */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={300} scale={25} size={3} speed={0.4} opacity={0.4} color="#ffd700" />

      {/* Cinematic Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={0.6} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.7}
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
      </EffectComposer>
    </>
  );
};