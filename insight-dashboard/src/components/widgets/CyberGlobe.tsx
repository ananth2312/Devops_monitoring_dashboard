import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleRing = ({ count = 200, radius = 2.5 }) => {
   const groupRef = useRef<THREE.Group>(null);
   
   useFrame((state) => {
      if (groupRef.current) {
         groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      }
   });

   return (
      <group ref={groupRef}>
         {Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
            const y = (Math.random() - 0.5) * 2;
            
            return (
               <mesh key={i} position={[x, y, z]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial color={i % 2 === 0 ? "#00ffff" : "#ff00ff"} />
               </mesh>
            );
         })}
      </group>
   );
};

export const CyberGlobe = () => {
   const earthRef = useRef<THREE.Mesh>(null);

   useFrame((state) => {
      if (earthRef.current) {
         earthRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      }
   });

   return (
      <group>
         {/* Volumetric / Core glow */}
         <Sphere ref={earthRef} args={[2, 64, 64]}>
            <MeshDistortMaterial 
               color="#0A192F" 
               emissive="#112240" 
               wireframe 
               distort={0.1} 
               speed={1} 
               roughness={0.2}
            />
         </Sphere>
         <ParticleRing count={300} radius={2.6} />
         <ParticleRing count={200} radius={3.2} />
      </group>
   );
};
