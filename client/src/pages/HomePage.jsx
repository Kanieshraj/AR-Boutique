import React, { useEffect, useState, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Truck, ShieldCheck, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/api/products/top');
                setFeaturedProducts(data);
            } catch (error) {
                console.error("Error fetching featured products", error);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="overflow-x-hidden">
            {/* Parallax Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop")',
                            filter: 'brightness(0.6)'
                        }}
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-prime/20 to-prime z-10" />

                <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mb-6 inline-block"
                    >
                        <span className="px-4 py-1 border border-accent/50 rounded-full text-accent text-sm uppercase tracking-[0.2em] backdrop-blur-sm">
                            New Season 2026
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight"
                    >
                        Timeless <span className="text-gold-gradient italic">Elegance</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-gray-300 text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Curating the finest fashion for the modern muse. Step into a world where style meets sophistication.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <Link to="/shop" className="btn-primary group relative overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Shop Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link to="/collections" className="btn-outline backdrop-blur-sm">
                            Discover Lookbook
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Marquee Strip */}
            <div className="bg-accent text-prime py-3 overflow-hidden whitespace-nowrap border-y border-accent/20">
                <div className="inline-block animate-float font-serif italic text-lg tracking-wider">
                    Exclusive Designs &nbsp; • &nbsp; Premium Quality &nbsp; • &nbsp; Global Shipping &nbsp; • &nbsp;
                    Exclusive Designs &nbsp; • &nbsp; Premium Quality &nbsp; • &nbsp; Global Shipping &nbsp; • &nbsp;
                    Exclusive Designs &nbsp; • &nbsp; Premium Quality &nbsp; • &nbsp; Global Shipping &nbsp; • &nbsp;
                </div>
            </div>

            {/* Introduction Grid */}
            <section className="py-32 px-6 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl font-serif mb-8 text-white">Redefining <br /> <span className="text-gray-500 italic">Luxury Fashion</span></h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                            Our boutique isn't just a store; it's a curation of artistry.
                            From hand-stitched fabrics to avant-garde silhouettes, every piece
                            tells a story of dedication and passion.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-4xl font-serif text-accent mb-2">500+</h4>
                                <p className="text-sm text-gray-500 uppercase tracking-widest">Global Brands</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-serif text-accent mb-2">24/7</h4>
                                <p className="text-sm text-gray-400 uppercase tracking-widest">Sartorial Support</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
                            alt="Fashion Shoot"
                            className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out rounded-lg shadow-2xl"
                        />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-prime border border-white/10 rounded-full flex items-center justify-center p-4 shadow-xl z-20 backdrop-blur-md">
                            <div className="text-center">
                                <Play size={32} className="text-accent mx-auto mb-2 fill-accent" />
                                <p className="text-xs uppercase tracking-widest text-white">Watch Film</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Collection Horizontal Scroll */}
            <section className="py-24 bg-gradient-to-b from-prime to-sec relative">
                <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-serif text-white mb-4">Curated Selections</h2>
                        <div className="h-1 w-20 bg-accent"></div>
                    </div>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-accent hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
                        View All Items <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Horizontal Scroll Area */}
                <div className="overflow-x-auto pb-12 ml-6 no-scrollbar">
                    <div className="flex gap-8 w-max px-6">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="w-[350px] group"
                            >
                                <div className="relative overflow-hidden mb-6 h-[450px]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 decoration-slate-900"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <Link to={`/product/${product._id}`} className="bg-white text-black px-8 py-3 uppercase tracking-widest font-bold hover:bg-accent transition-colors">
                                            Quick View
                                        </Link>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-accent text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                            Top Rated
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                                    <p className="text-gray-500 font-light mb-2 line-clamp-1">{product.description}</p>
                                    <p className="text-accent text-xl font-medium">${product.price}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
