"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingShape({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
        </Float>
    );
}

export default function ThreeDBackground() {
    return (
        <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <FloatingShape position={[-3, 2, 0]} color="#EADDFF" />
                <FloatingShape position={[3, -1, -2]} color="#6750A4" />
                <FloatingShape position={[0, -2, -1]} color="#D0BCFF" />
                <FloatingShape position={[-2, -1, 1]} color="#CCC2DC" />
                <FloatingShape position={[2, 2, -3]} color="#E8DEF8" />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
