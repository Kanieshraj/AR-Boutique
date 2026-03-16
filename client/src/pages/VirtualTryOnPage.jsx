import React, { useState, useRef, Suspense, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import GlassesModel from '../components/3d/GlassesModel';
import ImageDressModel from '../components/3d/ImageDressModel';
import EarringsModel from '../components/3d/EarringsModel';
import ChainModel from '../components/3d/ChainModel';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// MediaPipe imports
import { FilesetResolver, FaceLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';

const VirtualTryOnPage = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // UI State
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [facingMode, setFacingMode] = useState("user");
    const [modelLoading, setModelLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('glasses');
    const [showDebug, setShowDebug] = useState(false); // Debug UI toggle

    // AR Calibration Offsets (for tuning GLB models)
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0.2);
    const [offsetZ, setOffsetZ] = useState(0);
    const [offsetScale, setOffsetScale] = useState(1.5);
    const [rotX, setRotX] = useState(0);
    const [rotY, setRotY] = useState(-Math.PI / 2);
    const [rotZ, setRotZ] = useState(0);

    // Reset calibration defaults when product changes
    useEffect(() => {
        if (selectedProduct === 'glasses') {
            setOffsetX(0); setOffsetY(0.2); setOffsetZ(0); setOffsetScale(1.5); setRotX(0); setRotY(-Math.PI / 2); setRotZ(0);
        } else if (selectedProduct === 'earrings') {
            // Add a negative Y offset so they hang down from the earlobe point
            setOffsetX(0); setOffsetY(-0.1); setOffsetZ(0); setOffsetScale(0.15); setRotX(0); setRotY(0); setRotZ(0);
        } else if (selectedProduct === 'chain') {
            // Massive base scale for the tiny GLB
            // Positive Y offset pushes it DOWN from the chin towards the neck/chest in this coordinate setup
            // rotX = Math.PI to flip upside down, rotY = Math.PI to spin the clasp to the back
            setOffsetX(0); setOffsetY(2.5); setOffsetZ(0.5); setOffsetScale(40.0); setRotX(Math.PI); setRotY(Math.PI); setRotZ(0);
        }
    }, [selectedProduct]);

    // Tracking State
    const faceLandmarkerRef = useRef(null);
    const poseLandmarkerRef = useRef(null);
    const requestRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

    const [facePosition, setFacePosition] = useState([0, 0, 0]);
    const [leftEarPosition, setLeftEarPosition] = useState([0, 0, 0]);
    const [rightEarPosition, setRightEarPosition] = useState([0, 0, 0]);
    const [faceScale, setFaceScale] = useState([1, 1, 1]);
    const [faceRotation, setFaceRotation] = useState([0, 0, 0]);

    const [neckPosition, setNeckPosition] = useState([0, 0, 0]);
    const [neckScale, setNeckScale] = useState([1, 1, 1]);
    const [neckRotation, setNeckRotation] = useState([0, 0, 0]);

    // 1. Initialize MediaPipe
    useEffect(() => {
        const initAI = async () => {
            if (!cameraEnabled) return;
            setModelLoading(true);
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );

                // Initialize FaceLandmarker for Glasses
                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: false,
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                // Initialize PoseLandmarker for Necklace
                poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1
                });

                console.log("MediaPipe Models Loaded successfully");
            } catch (err) {
                console.error("Failed to load AI model", err);
                setCameraError("Failed to initialize AI tracking. Please try refreshing.");
            } finally {
                setModelLoading(false);
            }
        };
        initAI();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
            if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
        };
    }, [cameraEnabled]);

    // 2. Tracking Loop
    const detect = async () => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4 &&
            faceLandmarkerRef.current &&
            poseLandmarkerRef.current
        ) {
            const video = webcamRef.current.video;

            // Limit processing to actual new frames
            if (video.currentTime !== lastVideoTimeRef.current) {
                lastVideoTimeRef.current = video.currentTime;

                const startTimeMs = performance.now();

                // ---------- FACE TRACKING (GLASSES, EARRINGS, CHAIN) ----------
                if (selectedProduct === 'glasses' || selectedProduct === 'earrings' || selectedProduct === 'chain') {
                    const faceResults = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);

                    if (faceResults.faceLandmarks.length > 0) {
                        const landmarks = faceResults.faceLandmarks[0];
                        // MediaPipe Face points: 33 (left eye outer), 263 (right eye outer), 168 (bridge of nose), 10 (top head), 152 (chin)
                        const leftEye = landmarks[33];
                        const rightEye = landmarks[263];
                        const bridge = landmarks[168];

                        const topHead = landmarks[10];
                        const chin = landmarks[152];

                        const leftEar = landmarks[132]; // Bottom of left earlobe
                        const rightEar = landmarks[361]; // Bottom of right earlobe

                        // Exact 3D Canvas Projection Math
                        const fov = 50 * (Math.PI / 180);
                        const cameraZ = 5;
                        const viewportHeight = 2 * Math.tan(fov / 2) * cameraZ;
                        // Use the CSS size of the video to match the Canvas aspect ratio perfectly
                        const aspect = video.clientWidth / video.clientHeight || 16 / 9;
                        const viewportWidth = viewportHeight * aspect;

                        // World Coordinates
                        let lx = (leftEye.x - 0.5) * viewportWidth;
                        let ly = -(leftEye.y - 0.5) * viewportHeight;
                        let lz = leftEye.z * viewportWidth;

                        let rx = (rightEye.x - 0.5) * viewportWidth;
                        let ry = -(rightEye.y - 0.5) * viewportHeight;
                        let rz = rightEye.z * viewportWidth;

                        // Bridge of nose where glasses sit
                        let nx = (bridge.x - 0.5) * viewportWidth;
                        let ny = -(bridge.y - 0.5) * viewportHeight;

                        let tx = (topHead.x - 0.5) * viewportWidth;
                        let ty = -(topHead.y - 0.5) * viewportHeight;
                        let tz = topHead.z * viewportWidth;

                        let cx = (chin.x - 0.5) * viewportWidth;
                        let cy = -(chin.y - 0.5) * viewportHeight;
                        let cz = chin.z * viewportWidth;

                        let leX = (leftEar.x - 0.5) * viewportWidth;
                        let leY = -(leftEar.y - 0.5) * viewportHeight;

                        let reX = (rightEar.x - 0.5) * viewportWidth;
                        let reY = -(rightEar.y - 0.5) * viewportHeight;

                        // Mirror coordinates if user-facing
                        if (facingMode === "user") {
                            lx = -lx; rx = -rx; nx = -nx; tx = -tx; cx = -cx;
                            leX = -leX; reX = -reX;
                        }

                        // Set exact position to the bridge of the nose
                        setFacePosition([nx, ny, 0]);
                        setLeftEarPosition([leX, leY, 0]);
                        setRightEarPosition([reX, reY, 0]);

                        const dx = rx - lx;
                        const dy = ry - ly;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // Glasses width matches the distance between outer eyes * scaling factor
                        const scaleFactor = dist / 1.6;
                        setFaceScale([scaleFactor, scaleFactor, scaleFactor]);

                        // Calculate precise 3D Rotation (Roll, Pitch, Yaw)
                        let roll = Math.atan2(dy, dx);

                        // Yaw (turn head left to right)
                        const dz = rz - lz;
                        let yaw = Math.atan2(dz, dx);

                        // Pitch (tilt head up and down)
                        const dyPitch = cy - ty;
                        const dzPitch = cz - tz;
                        let pitch = -Math.atan2(dzPitch, dyPitch) * 0.8;

                        setFaceRotation([pitch, yaw, roll]);

                        // Anchor the chain specifically to the chin so it tracks with the head
                        setNeckPosition([cx, cy, 0]);
                        setNeckScale(faceScale);
                        // Necklace should inherit head yaw (turning left/right) and pitch, but not roll (tilting shoulder-to-shoulder), gravity keeps chains straight down
                        setNeckRotation([pitch, yaw, 0]);
                    }
                }

                // ---------- POSE TRACKING (2D IMAGE DRESS) ----------
                if (selectedProduct === 'image_dress') {
                    const poseResults = poseLandmarkerRef.current.detectForVideo(video, startTimeMs);

                    if (poseResults.landmarks.length > 0) {
                        const landmarks = poseResults.landmarks[0];
                        // MediaPipe Pose points: 11 (left shoulder), 12 (right shoulder), 23 (left hip), 24 (right hip)
                        const leftShoulder = landmarks[11];
                        const rightShoulder = landmarks[12];
                        const leftHip = landmarks[23];
                        const rightHip = landmarks[24];

                        const fov = 50 * (Math.PI / 180);
                        const cameraZ = 5;
                        const viewportHeight = 2 * Math.tan(fov / 2) * cameraZ;
                        const aspect = video.clientWidth / video.clientHeight || 16 / 9;
                        const viewportWidth = viewportHeight * aspect;

                        // Map shoulders
                        let lsX = (leftShoulder.x - 0.5) * viewportWidth;
                        let lsY = -(leftShoulder.y - 0.5) * viewportHeight;
                        let rsX = (rightShoulder.x - 0.5) * viewportWidth;
                        let rsY = -(rightShoulder.y - 0.5) * viewportHeight;

                        // Safe Hip Mapping (Fallback to a static offset if hips aren't clearly visible)
                        let lhX = lsX;
                        let lhY = lsY - 2;
                        let rhX = rsX;
                        let rhY = rsY - 2;

                        if (leftHip && rightHip && leftHip.visibility > 0.5 && rightHip.visibility > 0.5) {
                            lhX = (leftHip.x - 0.5) * viewportWidth;
                            lhY = -(leftHip.y - 0.5) * viewportHeight;
                            rhX = (rightHip.x - 0.5) * viewportWidth;
                            rhY = -(rightHip.y - 0.5) * viewportHeight;
                        }

                        if (facingMode === "user") {
                            lsX = -lsX; rsX = -rsX; lhX = -lhX; rhX = -rhX;
                        }

                        const midShoulderX = (lsX + rsX) / 2;
                        const midShoulderY = (lsY + rsY) / 2;

                        const midHipX = (lhX + rhX) / 2;
                        const midHipY = (lhY + rhY) / 2;

                        // Width & Height
                        const shoulderDx = rsX - lsX;
                        const shoulderDy = rsY - lsY;
                        let shoulderWidth = Math.sqrt(shoulderDx * shoulderDx + shoulderDy * shoulderDy);
                        if (isNaN(shoulderWidth) || shoulderWidth < 0.1) shoulderWidth = 1.0;

                        const torsoDx = midHipX - midShoulderX;
                        const torsoDy = midHipY - midShoulderY;
                        let torsoHeight = Math.sqrt(torsoDx * torsoDx + torsoDy * torsoDy);
                        if (isNaN(torsoHeight) || torsoHeight < 0.1) torsoHeight = 2.0;

                        // Dynamic Scaling and Positioning
                        if (selectedProduct === 'image_dress') {
                            const widthScale = shoulderWidth * 2.0; // Dress is wider than shoulders
                            const heightScale = torsoHeight * 2.5; // Dress goes down to knees
                            setNeckScale([widthScale, heightScale, 1]);
                            setNeckPosition([midShoulderX, midShoulderY, 0]);
                        }

                        let roll = Math.atan2(shoulderDy, shoulderDx);
                        setNeckRotation([0, 0, isNaN(roll) ? 0 : roll]);
                    }
                }
            }
        }
        requestRef.current = requestAnimationFrame(detect);
    };

    // Start loop when video is ready
    const handleVideoLoaded = () => {
        console.log("Video started, beginning AI tracking loop");
        requestRef.current = requestAnimationFrame(detect);
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    const handleCameraError = (error) => {
        console.error("Camera Error:", error);
        setCameraError("Could not access camera. Please ensure you have allowed camera permissions.");
        setCameraEnabled(false);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
            {/* Overlay UI */}
            <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-start pointer-events-none">
                <Link to="/" className="inline-flex items-center text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/70 transition-colors pointer-events-auto">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Link>

                <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full text-white text-center pointer-events-auto">
                    <h1 className="text-xl font-serif text-accent">High-Fidelity VTON</h1>
                    <p className="text-xs text-gray-300">Powered by WebAR</p>
                </div>
            </div>

            {/* AI Loading State */}
            {cameraEnabled && modelLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white text-lg font-serif tracking-widest uppercase">Booting MediaPipe...</p>
                    </div>
                </div>
            )}

            {/* Start Screen */}
            {!cameraEnabled && (
                <div className="z-10 text-center p-8 absolute">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-prime p-8 rounded-2xl border border-white/10 max-w-md mx-auto shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                    >
                        <Camera size={48} className="mx-auto text-accent mb-4" />
                        <h2 className="text-2xl font-serif text-white mb-4">Precision AR Tracker</h2>
                        <p className="text-gray-400 mb-8">
                            Experience 468-point 3D face meshing and sub-millimeter pose locking. Processing happens locally on your device.
                        </p>
                        {cameraError && (
                            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-sm">
                                {cameraError}
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setCameraError(null);
                                setCameraEnabled(true);
                            }}
                            className="btn-primary w-full py-3 text-lg"
                        >
                            Enable Camera
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Camera Frame Container (Intrinsic Aspect Ratio) */}
            {cameraEnabled && (
                <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

                    {/* 1. Webcam Layer (Bottom) */}
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode }}
                        className="w-full h-auto block"
                        mirrored={facingMode === "user"}
                        onUserMedia={handleVideoLoaded}
                        onUserMediaError={handleCameraError}
                    />

                    {/* 2. Three.js Overlay (Top) */}
                    <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-full" ref={canvasRef}>
                            <Suspense fallback={null}>
                                <ambientLight intensity={0.7} />
                                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
                                <Environment preset="city" />

                                {/* Conditionally Render AI Tracked Products */}
                                {selectedProduct === 'glasses' && (
                                    <group
                                        position={facePosition}
                                        scale={faceScale}
                                        rotation={faceRotation}
                                    >
                                        <GlassesModel
                                            customPosition={[offsetX, offsetY, offsetZ]}
                                            customScale={offsetScale}
                                            customRotation={[rotX, rotY, rotZ]}
                                        />
                                    </group>
                                )}

                                {selectedProduct === 'earrings' && (
                                    <>
                                        {/* Left Earring */}
                                        <group position={leftEarPosition} scale={faceScale} rotation={faceRotation}>
                                            <EarringsModel
                                                customPosition={[offsetX, offsetY, offsetZ]}
                                                customScale={offsetScale}
                                                customRotation={[rotX, rotY, rotZ]}
                                            />
                                        </group>
                                        {/* Right Earring */}
                                        <group position={rightEarPosition} scale={faceScale} rotation={faceRotation}>
                                            <EarringsModel
                                                customPosition={[-offsetX, offsetY, offsetZ]}
                                                customScale={offsetScale}
                                                customRotation={[-rotX, -rotY, rotZ]}
                                            />
                                        </group>
                                    </>
                                )}

                                {selectedProduct === 'chain' && (
                                    <group position={neckPosition} scale={neckScale} rotation={neckRotation}>
                                        <ChainModel
                                            customPosition={[offsetX, offsetY, offsetZ]}
                                            customScale={offsetScale}
                                            customRotation={[rotX, rotY, rotZ]}
                                        />
                                    </group>
                                )}

                                {selectedProduct === 'image_dress' && (
                                    <group
                                        position={neckPosition}
                                        scale={neckScale}
                                        rotation={neckRotation}
                                    >
                                        <ImageDressModel />
                                    </group>
                                )}

                            </Suspense>
                        </Canvas>
                    </div>
                </div>
            )}

            {cameraEnabled && (
                <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-6 z-20 pointer-events-auto">

                    {/* Calibration UI */}
                    {showDebug && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-accent/30 text-white w-96 max-w-[90vw] grid grid-cols-2 gap-4 text-xs"
                        >
                            <h3 className="col-span-2 text-center text-accent font-bold mb-2">AR Model Calibration</h3>

                            <label className="flex flex-col gap-1">
                                X Position: {offsetX.toFixed(2)}
                                <input type="range" min="-1" max="1" step="0.05" value={offsetX} onChange={e => setOffsetX(parseFloat(e.target.value))} className="accent-accent" />
                            </label>

                            <label className="flex flex-col gap-1">
                                Y Position: {offsetY.toFixed(2)}
                                <input type="range" min="-1" max="1" step="0.05" value={offsetY} onChange={e => setOffsetY(parseFloat(e.target.value))} className="accent-accent" />
                            </label>

                            <label className="flex flex-col gap-1">
                                Z Position: {offsetZ.toFixed(2)}
                                <input type="range" min="-2" max="2" step="0.05" value={offsetZ} onChange={e => setOffsetZ(parseFloat(e.target.value))} className="accent-accent" />
                            </label>

                            <label className="flex flex-col gap-1">
                                Base Scale: {offsetScale.toFixed(2)}
                                <input type="range" min="0.5" max="4" step="0.1" value={offsetScale} onChange={e => setOffsetScale(parseFloat(e.target.value))} className="accent-accent" />
                            </label>

                            <label className="flex flex-col gap-1">
                                Tilt (RotX): {rotX.toFixed(2)}
                                <input type="range" min="-3" max="3" step="0.1" value={rotX} onChange={e => setRotX(parseFloat(e.target.value))} className="accent-accent" />
                            </label>

                            <label className="flex flex-col gap-1">
                                Rotate (RotY): {rotY.toFixed(2)}
                                <input type="range" min="-3" max="3" step="0.1" value={rotY} onChange={e => setRotY(parseFloat(e.target.value))} className="accent-accent" />
                            </label>

                            <button onClick={() => setShowDebug(false)} className="col-span-2 mt-2 bg-white/10 hover:bg-white/20 p-2 rounded">
                                Close Calibration
                            </button>
                        </motion.div>
                    )}

                    {/* Product Selector */}
                    <div className="flex gap-4 p-2 overflow-x-auto max-w-[90vw] bg-black/40 backdrop-blur-md rounded-full border border-white/10 scrollbar-hide">
                        <button
                            onClick={() => setSelectedProduct('glasses')}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-serif tracking-widest uppercase text-xs transition-all duration-300 ${selectedProduct === 'glasses'
                                ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-white hover:text-accent hover:bg-white/5'
                                }`}
                        >
                            Gold Glasses
                        </button>
                        <button
                            onClick={() => setSelectedProduct('earrings')}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-serif tracking-widest uppercase text-xs transition-all duration-300 ${selectedProduct === 'earrings'
                                ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-white hover:text-accent hover:bg-white/5'
                                }`}
                        >
                            Earrings
                        </button>
                        <button
                            onClick={() => setSelectedProduct('chain')}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-serif tracking-widest uppercase text-xs transition-all duration-300 ${selectedProduct === 'chain'
                                ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-white hover:text-accent hover:bg-white/5'
                                }`}
                        >
                            Necklace Chain
                        </button>
                        <button
                            onClick={() => setSelectedProduct('image_dress')}
                            className={`whitespace-nowrap px-6 py-3 rounded-full font-serif tracking-widest uppercase text-xs transition-all duration-300 ${selectedProduct === 'image_dress'
                                ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                : 'text-white hover:text-accent hover:bg-white/5'
                                }`}
                        >
                            Red Dress (Image)
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={toggleCamera}
                            className="bg-black/60 backdrop-blur-md p-3 rounded-full text-white hover:bg-accent hover:text-black transition-all border border-white/20"
                            title="Flip Camera"
                        >
                            <RefreshCw size={20} />
                        </button>

                        {/* Hidden button to show debug UI */}
                        {!showDebug && (
                            <button
                                onClick={() => setShowDebug(true)}
                                className="bg-black/60 backdrop-blur-md p-3 rounded-full text-white/50 hover:text-white transition-all border border-white/20"
                                title="Calibrate Fit"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualTryOnPage;
