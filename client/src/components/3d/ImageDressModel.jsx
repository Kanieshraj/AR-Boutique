import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const ImageDressModel = () => {
    const texture = useTexture("/red-dress.png");

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uColorKey: { value: new THREE.Color(1.0, 1.0, 1.0) }, // White background
        uTolerance: { value: 0.15 } // Tolerance for anti-aliased edges
    }), [texture]);

    return (
        <group position={[0, 0, 0.5]}>
            {/* Shift down so the top of the dress (shoulder) anchors to the 0,0 neckPosition point */}
            <mesh position={[0, -0.4, 0]}>
                <planeGeometry args={[1, 1]} />
                <shaderMaterial
                    uniforms={uniforms}
                    transparent={true}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    vertexShader={`
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        uniform sampler2D uTexture;
                        uniform vec3 uColorKey;
                        uniform float uTolerance;
                        varying vec2 vUv;

                        void main() {
                            vec4 texColor = texture2D(uTexture, vUv);
                            // Calculate color distance to our key color (white)
                            float diff = distance(texColor.rgb, uColorKey);
                            if (diff < uTolerance) {
                                discard; // Makes the pixel fully transparent
                            }
                            gl_FragColor = texColor;
                        }
                    `}
                />
            </mesh>
        </group>
    );
};

export default ImageDressModel;
