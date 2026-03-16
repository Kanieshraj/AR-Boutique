import React, { useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag } from 'lucide-react';

const showcaseItems = [
    {
        _id: '1',
        name: 'Gold Aviator Glasses',
        brand: 'Luxe',
        description: 'Classic gold aviator sunglasses with polarized lenses. Experience the luxury of real-time 3D rendering.',
        price: 149.99,
        rating: 4.8,
        numReviews: 24,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
        modelUrl: '/models/sunglasses.glb',
        modelScale: 2,
        modelPosition: [0, 0, 0],
        modelRotation: [0, 0, 0]
    },
    {
        _id: '2',
        name: 'Asian Mens Dress',
        brand: 'Heritage',
        description: 'Traditional Asian men\'s dress designed with high-poly details and premium draped fabrics.',
        price: 299.99,
        rating: 4.9,
        numReviews: 12,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
        modelUrl: '/models/muslim_asian_mens_dress_high-poly.glb',
        modelScale: 0.8,
        modelPosition: [0, -2, 0],
        modelRotation: [0, 0, 0]
    },
    {
        _id: '3',
        name: 'Pearl Necklace',
        brand: 'Aura',
        description: 'Elegant multi-layered pearl necklace. The perfect subtle accessory for any low-cut neckline.',
        price: 499.99,
        rating: 4.7,
        numReviews: 35,
        image: 'https://images.unsplash.com/photo-1599643478514-4a110e05bf13?q=80&w=800&auto=format&fit=crop',
        modelUrl: '/models/pearl_necklace.glb',
        modelScale: 2.5,
        modelPosition: [0, -0.5, 0],
        modelRotation: [0, 0, 0]
    },
    {
        _id: '4',
        name: 'V-Neck Sweater',
        brand: 'Urban',
        description: 'Comfortable and stylish v-neck knitted sweater. Perfect for casual business meetings or chilly evenings.',
        price: 89.99,
        rating: 4.6,
        numReviews: 18,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
        modelUrl: '/models/v-neck_sweater.glb',
        modelScale: 1.2,
        modelPosition: [0, -1, 0],
        modelRotation: [0, 0, 0]
    }
];

const DynamicModel = ({ modelInfo }) => {
    const { scene } = useGLTF(modelInfo.modelUrl);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} scale={modelInfo.modelScale} position={modelInfo.modelPosition} rotation={modelInfo.modelRotation} />;
};

const ShowcasePage = () => {
    const [selectedProduct, setSelectedProduct] = useState(showcaseItems[0]);

    return (
        <div className="min-h-screen bg-prime pt-24 md:pt-0 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel - Product Info & List */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-1/3 p-8 z-10 flex flex-col justify-center h-full relative bg-gradient-to-r from-black/80 to-transparent pointer-events-none"
            >
                <div className="pointer-events-auto">
                    <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back to Home
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Virtual Showcase</h1>
                    <p className="text-accent text-lg mb-8 font-light tracking-wide">Experience Luxury in 3D</p>

                    {selectedProduct && (
                        <div className="glass-card p-6 mb-8 border-l-4 border-accent">
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-yellow-400 flex"><Star size={16} fill="currentColor" /> {selectedProduct.rating}</span>
                                <span className="text-gray-400">({selectedProduct.numReviews} reviews)</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-6 line-clamp-3">{selectedProduct.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-serif text-white">₹{selectedProduct.price}</span>
                                <Link to={`/product/${selectedProduct._id}`} className="btn-primary flex items-center gap-2">
                                    <ShoppingBag size={18} /> View Details
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-4">Top Rated Collection</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {showcaseItems.map(item => (
                                <button
                                    key={item._id}
                                    onClick={() => setSelectedProduct(item)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedProduct._id === item._id ? 'border-accent scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel - 3D Canvas */}
            <div className="absolute inset-0 w-full h-full">
                <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                    <Suspense fallback={null}>
                        {/* Manual Lighting replaces buggy Stage bounds */}
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1} castShadow />

                        <DynamicModel
                            key={selectedProduct._id}
                            modelInfo={selectedProduct}
                        />

                        {/* Drop shadow plane */}
                        <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={10} blur={2} far={4} />

                        <Environment preset="city" />
                        <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
                    </Suspense>
                </Canvas>
                <div className="absolute bottom-8 right-8 text-white/30 text-xs text-right hidden md:block pointer-events-none">
                    <p>Drag to rotate</p>
                    <p>Scroll to zoom</p>
                </div>
            </div>
        </div>
    );
};

// Preload models for faster switching
useGLTF.preload('/models/sunglasses.glb');
useGLTF.preload('/models/muslim_asian_mens_dress_high-poly.glb');
useGLTF.preload('/models/pearl_necklace.glb');
useGLTF.preload('/models/v-neck_sweater.glb');

export default ShowcasePage;
