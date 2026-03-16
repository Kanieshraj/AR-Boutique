import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ShirtModel = ({ color = "#ffffff" }) => {
    const group = useRef();

    // Subtle breathing/cloth movement effect
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.position.y = Math.sin(t * 2) * 0.05;
        }
    });

    return (
        <group ref={group} dispose={null} scale={3.2}>
            {/* Torso */}
            <mesh position={[0, -0.2, 0]}>
                {/* A stretched cylinder to represent the main body of the shirt */}
                <cylinderGeometry args={[0.4, 0.45, 1.2, 32, 1, false, 0, Math.PI * 2]} />
                <MeshWobbleMaterial
                    color={color}
                    factor={0.1} // very subtle cloth wobble
                    speed={2}
                    roughness={0.8} // matte cloth look
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Left Sleeve */}
            <mesh position={[-0.45, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.15, 0.12, 0.4, 16]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>

            {/* Right Sleeve */}
            <mesh position={[0.45, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.15, 0.12, 0.4, 16]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>

            {/* Neck hole cutout visual (darker inner layer) */}
            <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.25, 32]} />
                <meshBasicMaterial color="#333333" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export default ShirtModel;
