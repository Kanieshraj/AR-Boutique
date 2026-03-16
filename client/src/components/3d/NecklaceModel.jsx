import React, { useRef } from 'react';

const NecklaceModel = (props) => {
    const group = useRef();

    return (
        <group ref={group} {...props}>
            {/* Simple Gold Chain - Squeezed horizontally to look like a hanging chain */ }
            <mesh rotation={[Math.PI / 2.2, 0, 0]} scale={[0.6, 1.2, 0.8]} position={[0, -0.6, 0]}>
                <torusGeometry args={[0.8, 0.03, 16, 100]} />
                <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
            </mesh>
            
            {/* Pendant */ }
            <mesh position={[0, -1.4, 0.4]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
            </mesh>
        </group>
    );
};

export default NecklaceModel;
