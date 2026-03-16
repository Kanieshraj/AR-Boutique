import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const ChainModel = ({ customPosition, customScale, customRotation, ...props }) => {
    const { scene } = useGLTF('/models/ch_moosy.glb');
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <group {...props}>
            <primitive
                object={clonedScene}
                scale={customScale || 1.0}
                position={customPosition || [0, 0, 0]}
                rotation={customRotation || [0, 0, 0]}
            />
        </group>
    );
};

export default ChainModel;
