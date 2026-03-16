import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshDistortMaterial, Sphere, Cone, Cylinder } from '@react-three/drei';

const DressModel = ({ color = "#D4AF37" }) => {
    const group = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = t * 0.2; // Slow rotation
        group.current.position.y = Math.sin(t / 1.5) / 10; // Gentle floating
    });

    return (
        <group ref={group} dispose={null} scale={2.5}>
            {/* Dress Bodice (Top) */}
            <Cylinder args={[0.3, 0.4, 0.6, 32]} position={[0, 0.8, 0]} castShadow>
                <meshStandardMaterial color={hovered ? "#FFD700" : color} metalness={0.6} roughness={0.2} />
            </Cylinder>

            {/* Dress Skirt */}
            <Cone args={[0.8, 2.5, 32]} position={[0, -0.75, 0]} castShadow>
                <meshStandardMaterial color={hovered ? "#FFD700" : color} metalness={0.5} roughness={0.3} />
            </Cone>

            {/* Accent / Belt */}
            <Cylinder args={[0.41, 0.41, 0.1, 32]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
            </Cylinder>

            {/* Interactive Area */}
            <mesh
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                visible={false}
            >
                <cylinderGeometry args={[1, 1, 4, 8]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
};

export default DressModel;
