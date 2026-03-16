import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const GlassesModel = ({ customPosition, customScale, customRotation, ...props }) => {
    const { scene } = useGLTF('/models/sunglasses.glb');
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <group {...props}>
            <primitive
                object={clonedScene}
                scale={customScale || 1.5}
                position={customPosition || [0, 0.2, 0]}
                rotation={customRotation || [0, -Math.PI / 2, 0]}
            />
        </group>
    );
};

useGLTF.preload('/models/sunglasses.glb');

export default GlassesModel;
