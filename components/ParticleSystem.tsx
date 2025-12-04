import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, MathUtils, Color, InstancedBufferAttribute } from 'three';
import { AppState, ParticleData } from '../types';
import { CONFIG } from '../constants';

interface Shader {
  uniforms: { [uniform: string]: { value: any } };
  vertexShader: string;
  fragmentShader: string;
}

interface ParticleSystemProps {
  mode: AppState;
  treeColor: string;
  ornamentColorA: string;
  ornamentColorB: string;
}

const tempObject = new Object3D();
const tempPos = new Vector3();
const tempColor = new Color();

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
    mode, 
    treeColor, 
    ornamentColorA, 
    ornamentColorB 
}) => {
  const particleRef = useRef<InstancedMesh>(null);
  const goldRef = useRef<InstancedMesh>(null);
  const redRef = useRef<InstancedMesh>(null);
  
  // Ref to store the shader to update uniform uTime
  const shaderRef = useRef<Shader | null>(null);

  // Generate position data (independent of color)
  const particlesData = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      const yNorm = i / CONFIG.PARTICLE_COUNT; 
      const y = MathUtils.mapLinear(yNorm, 0, 1, CONFIG.TREE_HEIGHT / 2, -CONFIG.TREE_HEIGHT / 2);
      const coneRadiusAtY = MathUtils.mapLinear(y, -CONFIG.TREE_HEIGHT / 2, CONFIG.TREE_HEIGHT / 2, CONFIG.TREE_BASE_RADIUS, 0);
      const rRatio = Math.sqrt(Math.random());
      const r = coneRadiusAtY * rRatio; 
      const angle = i * 2.39996;
      
      const treeX = Math.cos(angle) * r;
      const treeZ = Math.sin(angle) * r;

      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const scatterR = Math.cbrt(Math.random()) * CONFIG.SCATTER_RADIUS;
      const scatterX = scatterR * Math.sin(phi) * Math.cos(theta);
      const scatterY = scatterR * Math.sin(phi) * Math.sin(theta);
      const scatterZ = scatterR * Math.cos(phi);

      data.push({
        id: i,
        treePos: new Vector3(treeX, y, treeZ),
        scatterPos: new Vector3(scatterX, scatterY, scatterZ),
        color: new Color(), // Placeholder, updated in Effect
        scale: Math.random() * 0.5 + 0.5,
        rotationSpeed: Math.random() * 0.02 + 0.01,
        phaseOffset: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, []);

  const generateOrnamentData = (count: number, scaleBase: number) => {
    const data: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
        const y = (Math.random() - 0.5) * CONFIG.TREE_HEIGHT * 0.9;
        const radiusAtY = MathUtils.mapLinear(y, -CONFIG.TREE_HEIGHT / 2, CONFIG.TREE_HEIGHT / 2, CONFIG.TREE_BASE_RADIUS, 0);
        const angle = Math.random() * Math.PI * 2;
        const r = radiusAtY + 0.1;
        
        const treeX = Math.cos(angle) * r;
        const treeZ = Math.sin(angle) * r;

        const scatterX = (Math.random() - 0.5) * CONFIG.SCATTER_RADIUS * 1.5;
        const scatterY = (Math.random() - 0.5) * CONFIG.SCATTER_RADIUS * 1.5;
        const scatterZ = (Math.random() - 0.5) * CONFIG.SCATTER_RADIUS * 1.5;

        data.push({
            id: i,
            treePos: new Vector3(treeX, y, treeZ),
            scatterPos: new Vector3(scatterX, scatterY, scatterZ),
            color: new Color(),
            scale: (Math.random() * 0.4 + 0.6) * scaleBase,
            rotationSpeed: 0,
            phaseOffset: Math.random() * Math.PI * 2
        });
    }
    return data;
  };

  const goldData = useMemo(() => generateOrnamentData(CONFIG.ORNAMENT_COUNT, 1.0), []);
  const redData = useMemo(() => generateOrnamentData(CONFIG.ORNAMENT_RED_COUNT, 0.8), []);

  // Update Colors Dynamically
  useEffect(() => {
    if (!particleRef.current) return;
    
    // Safety check: ensure instanceColor attribute exists
    if (!particleRef.current.instanceColor) {
        particleRef.current.instanceColor = new InstancedBufferAttribute(new Float32Array(CONFIG.PARTICLE_COUNT * 3), 3);
    }

    // Parse the base color
    const baseColor = new Color(treeColor);
    const lighterColor = baseColor.clone().offsetHSL(0, 0, 0.1); // Slightly lighter variant

    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const isDark = (i % 3 === 0) || (i % 7 === 0);
        
        tempColor.copy(isDark ? baseColor : lighterColor);
        
        // Boost brightness for Bloom
        const brightness = Math.sin(i * 0.1) * 0.5 + 2.0; 
        tempColor.multiplyScalar(brightness);

        particleRef.current.setColorAt(i, tempColor);
    }
    particleRef.current.instanceColor!.needsUpdate = true;
  }, [treeColor]);

  useEffect(() => {
    if (!goldRef.current) return;

    if (!goldRef.current.instanceColor) {
        goldRef.current.instanceColor = new InstancedBufferAttribute(new Float32Array(CONFIG.ORNAMENT_COUNT * 3), 3);
    }

    const baseColor = new Color(ornamentColorA);
    
    for (let i = 0; i < CONFIG.ORNAMENT_COUNT; i++) {
        tempColor.copy(baseColor);
        tempColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
        tempColor.multiplyScalar(1.5); // Slight boost
        goldRef.current.setColorAt(i, tempColor);
    }
    goldRef.current.instanceColor!.needsUpdate = true;
  }, [ornamentColorA]);

  useEffect(() => {
    if (!redRef.current) return;

    if (!redRef.current.instanceColor) {
        redRef.current.instanceColor = new InstancedBufferAttribute(new Float32Array(CONFIG.ORNAMENT_RED_COUNT * 3), 3);
    }

    const baseColor = new Color(ornamentColorB);
    
    for (let i = 0; i < CONFIG.ORNAMENT_RED_COUNT; i++) {
        tempColor.copy(baseColor);
        tempColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
        tempColor.multiplyScalar(1.2); // Slight boost
        redRef.current.setColorAt(i, tempColor);
    }
    redRef.current.instanceColor!.needsUpdate = true;
  }, [ornamentColorB]);


  // Animation Loop
  const mixFactor = useRef(0);

  useFrame((state, delta) => {
    const target = mode === AppState.TREE_SHAPE ? 1 : 0;
    mixFactor.current = MathUtils.damp(mixFactor.current, target, CONFIG.TRANSITION_SPEED, delta);
    const t = mixFactor.current;
    
    // Update Shader Uniform
    if (shaderRef.current) {
        shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Animate Tree Particles
    if (particleRef.current) {
      particlesData.forEach((particle, i) => {
        tempPos.lerpVectors(particle.scatterPos, particle.treePos, t);
        
        if (t < 0.95) {
            const floatY = Math.sin(state.clock.elapsedTime + particle.phaseOffset) * 0.8 * (1 - t);
            tempPos.y += floatY;
        }

        tempObject.position.copy(tempPos);
        tempObject.rotation.x = state.clock.elapsedTime * particle.rotationSpeed + particle.phaseOffset;
        tempObject.rotation.y = state.clock.elapsedTime * particle.rotationSpeed * 0.5;
        tempObject.scale.setScalar(particle.scale);
        tempObject.updateMatrix();
        particleRef.current!.setMatrixAt(i, tempObject.matrix);
      });
      particleRef.current.instanceMatrix.needsUpdate = true;
    }

    const animateOrnaments = (ref: React.RefObject<InstancedMesh>, data: ParticleData[]) => {
        if (!ref.current) return;
        data.forEach((particle, i) => {
            tempPos.lerpVectors(particle.scatterPos, particle.treePos, t);
            const floatY = Math.cos(state.clock.elapsedTime * 0.5 + particle.phaseOffset) * 0.8 * (1 - t);
            tempPos.y += floatY;

            tempObject.position.copy(tempPos);
            tempObject.rotation.set(0, 0, 0); 
            tempObject.scale.setScalar(particle.scale);
            tempObject.updateMatrix();
            ref.current!.setMatrixAt(i, tempObject.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
    };

    animateOrnaments(goldRef, goldData);
    animateOrnaments(redRef, redData);
  });

  return (
    <>
      <instancedMesh ref={particleRef} args={[undefined, undefined, CONFIG.PARTICLE_COUNT]}>
        <dodecahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial 
            roughness={0.2} 
            metalness={0.8}
            flatShading={true}
            onBeforeCompile={(shader) => {
                shaderRef.current = shader;
                shader.uniforms.uTime = { value: 0 };
                // Inject varying for world position
                shader.vertexShader = `
                    varying vec3 vWorldPos;
                ` + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <worldpos_vertex>',
                    `
                    #include <worldpos_vertex>
                    vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                    `
                );

                // Inject flicker logic
                shader.fragmentShader = `
                    uniform float uTime;
                    varying vec3 vWorldPos;
                ` + shader.fragmentShader;

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <tonemapping_fragment>',
                    `
                    #include <tonemapping_fragment>
                    // Sparkle math: combine time and position for random blinking
                    float sparkle = sin(uTime * 4.0 + vWorldPos.x * 10.0) * sin(uTime * 2.0 + vWorldPos.y * 10.0) * 0.5 + 0.5;
                    // Boost the brightness when sparkling
                    gl_FragColor.rgb += gl_FragColor.rgb * sparkle * 1.5;
                    `
                );
            }}
        />
      </instancedMesh>

      <instancedMesh ref={goldRef} args={[undefined, undefined, CONFIG.ORNAMENT_COUNT]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
            color={ornamentColorA}
            roughness={0.1}
            metalness={1}
            emissive={ornamentColorA}
            emissiveIntensity={0.5}
        />
      </instancedMesh>

      <instancedMesh ref={redRef} args={[undefined, undefined, CONFIG.ORNAMENT_RED_COUNT]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
            color={ornamentColorB}
            roughness={0.1}
            metalness={0.8}
            emissive={ornamentColorB}
            emissiveIntensity={0.6}
        />
      </instancedMesh>
    </>
  );
};
