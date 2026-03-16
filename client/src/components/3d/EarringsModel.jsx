import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const EarringsModel = ({ customPosition, customScale, customRotation, ...props }) => {
    const { scene } = useGLTF('/models/earing_jan_twenty_eighth2.glb');
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <group {...props}>
            <primitive
                object={clonedScene}
                scale={customScale || 0.5}
                position={customPosition || [0, 0, 0]}
                rotation={customRotation || [0, 0, 0]}
            />
        </group>
    );
};

export default EarringsModel;
