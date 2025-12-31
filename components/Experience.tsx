
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Cloud, PerspectiveCamera, Environment, Text, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { AppScene, TravelMode } from '../types';

// Stylized Vehicle Components
const Vehicle = ({ mode, isCinematic }: { mode: TravelMode, isCinematic: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const internalRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (isCinematic && groupRef.current) {
      const tl = gsap.timeline();
      gsap.set(groupRef.current.position, { x: -20, z: 0 });
      tl.to(groupRef.current.position, { x: 0, duration: 2, ease: "power2.out" });
      tl.to(groupRef.current.position, { x: 20, duration: 1.5, delay: 2, ease: "power2.in" });
    } else if (!isCinematic && groupRef.current) {
      gsap.set(groupRef.current.position, { x: 0, z: 0 });
    }
  }, [isCinematic]);

  useFrame((state) => {
    if (internalRef.current) {
      internalRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
      internalRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.03;
      internalRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    }
  });

  const renderVehicleBody = () => {
    switch (mode) {
      case 'plane':
        return (
          <group>
            <mesh><capsuleGeometry args={[0.4, 2, 4, 16]} /><meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} /></mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}><boxGeometry args={[3, 0.05, 0.6]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
            <mesh position={[0, 0.3, 1]} rotation={[0.4, 0, 0]}><boxGeometry args={[0.05, 0.6, 0.4]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
          </group>
        );
      case 'bike':
        return (
          <group rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0, -0.4, 0.6]}><torusGeometry args={[0.35, 0.08, 16, 32]} /><meshStandardMaterial color="#1e293b" /></mesh>
            <mesh position={[0, -0.4, -0.6]}><torusGeometry args={[0.35, 0.08, 16, 32]} /><meshStandardMaterial color="#1e293b" /></mesh>
            <mesh position={[0, 0, 0]}><boxGeometry args={[0.2, 0.5, 1.4]} /><meshStandardMaterial color="#ef4444" /></mesh>
          </group>
        );
      case 'car':
        return (
          <group rotation={[0, Math.PI / 2, 0]}>
            <mesh><boxGeometry args={[2.2, 0.6, 1.1]} /><meshStandardMaterial color="#3b82f6" /></mesh>
            <mesh position={[0, 0.5, 0]}><boxGeometry args={[1.2, 0.5, 0.9]} /><meshStandardMaterial color="#93c5fd" transparent opacity={0.6} /></mesh>
          </group>
        );
      case 'train':
        return (
          <group rotation={[0, Math.PI / 2, 0]}>
            {[0, 1.3, 2.6].map((z) => (
              <mesh key={z} position={[0, 0, z - 1.3]}><boxGeometry args={[1, 0.9, 1.2]} /><meshStandardMaterial color="#1e293b" /></mesh>
            ))}
          </group>
        );
      default: return null;
    }
  };

  return (
    <group ref={groupRef}>
      <group ref={internalRef}>
        {renderVehicleBody()}
        <pointLight intensity={2} distance={8} color="#fbbf24" position={[0, 1, 0]} />
      </group>
    </group>
  );
};

const TreasureChest = ({ currentScene }: { currentScene: AppScene }) => {
  const lidRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (currentScene === AppScene.TREASURE_BOX && lidRef.current) {
      gsap.to(lidRef.current.rotation, { x: -Math.PI / 1.5, duration: 2, delay: 1, ease: "back.out(1.7)" });
    }
  }, [currentScene]);

  return (
    <group position={[0, -1, 0]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1.5, 2]} />
        <meshStandardMaterial color="#451a03" roughness={0.5} />
      </mesh>
      {/* Lid */}
      <group ref={lidRef} position={[0, 1.25, -1]}>
        <mesh position={[0, 0.25, 1]}>
          <boxGeometry args={[3, 0.5, 2]} />
          <meshStandardMaterial color="#5d2a06" />
        </mesh>
      </group>
      <pointLight position={[0, 1, 0]} intensity={2} color="#fbbf24" />
      <Sparkles count={50} scale={4} size={4} speed={0.4} color="#fbbf24" />
    </group>
  );
};

const WishStars = () => {
  return (
    <group>
      {[-4, 0, 4].map((x, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={[x, 1, 0]}>
          <mesh>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={2} />
          </mesh>
          <pointLight intensity={1} distance={5} color="#fcd34d" />
        </Float>
      ))}
    </group>
  );
};

const KathmanduScene = () => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <group ref={group}>
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 0.5) * (6 + Math.random() * 3), Math.random() * 5, Math.sin(i * 0.5) * (6 + Math.random() * 3)]}>
          <boxGeometry args={[0.5, Math.random() * 4 + 1, 0.5]} />
          <meshStandardMaterial color="#1e293b" emissive="#0f172a" />
        </mesh>
      ))}
    </group>
  );
};

const SkyTravelScene = ({ mode, isCinematic }: { mode: TravelMode, isCinematic: boolean }) => {
  const cloudGroup = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (cloudGroup.current) {
      const speed = isCinematic ? 0.4 : 0.1;
      cloudGroup.current.position.z += speed;
      if (cloudGroup.current.position.z > 30) cloudGroup.current.position.z = -30;
    }
  });

  return (
    <group>
      <Vehicle mode={mode} isCinematic={isCinematic} />
      <group ref={cloudGroup}>
        {Array.from({ length: 25 }).map((_, i) => (
          <Cloud key={i} opacity={0.25} speed={1} width={10} depth={2} segments={10} position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 60]} />
        ))}
      </group>
    </group>
  );
};

const LahoreScene = () => (
  <group>
    <Center position={[0, 0, 0]}>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[2.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#451a03" emissive="#2d0a01" />
      </mesh>
      {[[-5, -3], [5, -3], [-5, 3], [5, 3]].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], 1.2, pos[1]]}>
          <cylinderGeometry args={[0.5, 0.5, 10, 16]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}
    </Center>
    <pointLight position={[0, 8, 0]} intensity={4} color="#fcd34d" />
  </group>
);

const CameraController = ({ currentScene }: { currentScene: AppScene }) => {
  const { camera } = useThree();
  useEffect(() => {
    let targetPos = new THREE.Vector3(0, 5, 15);
    switch (currentScene) {
      case AppScene.START: targetPos.set(15, 12, 22); break;
      case AppScene.SKY_TRAVEL: targetPos.set(0, 4, 15); break;
      case AppScene.ARRIVAL_LAHORE: targetPos.set(0, 5, 18); break;
      case AppScene.MOON_GARDEN: targetPos.set(0, 4, 14); break;
      case AppScene.SAME_CITY: targetPos.set(-10, 6, 15); break;
      case AppScene.LETTER: targetPos.set(0, 2, 8); break;
      case AppScene.THREE_WISHES: targetPos.set(0, 3, 12); break;
      case AppScene.TIME_BRIDGE: targetPos.set(0, 10, 25); break;
      case AppScene.TREASURE_BOX: targetPos.set(0, 2, 10); break;
      case AppScene.CREDITS: targetPos.set(0, 20, 5); break;
      default: targetPos.set(0, 5, 15);
    }
    gsap.to(camera.position, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 4, ease: "power2.inOut" });
  }, [currentScene, camera]);
  return null;
};

const Experience: React.FC<ExperienceProps> = ({ currentScene, travelMode }) => {
  return (
    <div className="fixed inset-0 bg-slate-950 z-0">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={50} />
        <CameraController currentScene={currentScene} />
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 5, 50]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 25, 15]} intensity={2} color="#cbd5e1" />
        
        {currentScene === AppScene.START && <KathmanduScene />}
        {(currentScene === AppScene.CHOOSE_TRAVEL || currentScene === AppScene.SKY_TRAVEL) && <SkyTravelScene mode={travelMode} isCinematic={currentScene === AppScene.SKY_TRAVEL} />}
        {(currentScene >= AppScene.ARRIVAL_LAHORE && currentScene <= AppScene.SAME_CITY) && <LahoreScene />}
        {currentScene === AppScene.THREE_WISHES && <WishStars />}
        {currentScene === AppScene.TREASURE_BOX && <TreasureChest currentScene={currentScene} />}
        
        <Stars radius={120} depth={60} count={5000} factor={4} saturation={0} fade speed={2} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default Experience;
interface ExperienceProps { currentScene: AppScene; travelMode: TravelMode; }
