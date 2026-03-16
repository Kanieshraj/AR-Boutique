import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import api from '../utils/api';



const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const searchParams = new URLSearchParams(location.search);
                const keyword = searchParams.get('keyword');

                let url = '/api/products';
                const params = [];

                if (selectedCategory !== 'All') {
                    params.push(`category=${selectedCategory}`);
                }
                if (keyword) {
                    params.push(`keyword=${keyword}`);
                }

                if (params.length > 0) {
                    url += `?${params.join('&')}`;
                }

                const { data } = await api.get(url);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setError("Failed to load products");
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, location.search]);

    const categories = ['All', 'Dresses', 'Jewelry', 'Footwear', 'Accessories'];

    return (
        <div className="container mx-auto px-6 pt-32 pb-12">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-serif text-accent mb-8"
            >
                Shop Collection
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="md:col-span-1 space-y-8">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4 text-white">Categories</h3>
                        <ul className="space-y-3 text-gray-400">
                            {categories.map(cat => (
                                <li
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`cursor-pointer transition-colors flex items-center justify-between group ${selectedCategory === cat ? 'text-accent font-bold' : 'hover:text-accent'}`}
                                >
                                    <span>{cat}</span>
                                    {selectedCategory === cat && <motion.div layoutId="active-dot" className="w-1.5 h-1.5 bg-accent rounded-full" />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
                            <p className="text-xl mb-4">No products found in this category.</p>
                            <button onClick={() => setSelectedCategory('All')} className="text-accent underline">View all products</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
