import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, Truck, RefreshCw, ShieldCheck, Zap, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import api from '../utils/api';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);

                // Fetch related products (mock logic: fetch all and take first 4 excluding current)
                // In a real app, you'd have a specific endpoint for this
                const relatedRes = await api.get('/api/products');
                const related = relatedRes.data
                    .filter(p => p._id !== id)
                    .slice(0, 4);
                setRelatedProducts(related);

                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, Number(qty));
        // You might want a toast notification here
        alert('Added to Cart!');
    };

    const handleBuyNow = () => {
        addToCart(product, Number(qty));
        navigate('/shipping');
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-white flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>;
    if (error) return <div className="min-h-screen pt-32 text-center text-red-500">Error: {error}</div>;
    if (!product) return <div className="min-h-screen pt-32 text-center text-white">Product not found</div>;

    return (
        <div className="container mx-auto px-4 pt-32 pb-12">
            {/* Breadcrumb / Back */}
            <nav className="flex items-center text-sm text-gray-400 mb-6">
                <Link to="/" className="hover:text-accent">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/shop" className="hover:text-accent">Shop</Link>
                <span className="mx-2">/</span>
                <span className="text-white truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Image Gallery (lg:col-span-5) */}
                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-4 sticky top-24"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-lg bg-black/20 p-4"
                        />
                        {/* Thumbnails would go here */}
                    </motion.div>
                </div>

                {/* Center Column: Product Details (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-2 mb-4 text-sm">
                            <div className="flex text-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-600"} />
                                ))}
                            </div>
                            <span className="text-blue-400 hover:underline cursor-pointer">{product.numReviews} ratings</span>
                        </div>
                    </div>

                    <div className="border-t border-b border-white/10 py-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-white">₹{product.price}</span>
                            <span className="text-sm text-gray-400">Inclusive of all taxes</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-full"><Zap size={20} className="text-yellow-400" /></div>
                            <span className="text-gray-300">Fast Delivery Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-full"><RefreshCw size={20} className="text-blue-400" /></div>
                            <span className="text-gray-300">10 Days Return Policy</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-full"><ShieldCheck size={20} className="text-green-400" /></div>
                            <span className="text-gray-300">1 Year Warranty</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-white font-bold mb-2">About this item</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {product.description}
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-1 text-gray-400 text-sm">
                            <li>Premium quality material</li>
                            <li>Modern and stylish design</li>
                            <li>Perfect for any occasion</li>
                            {product.brand && <li>Brand: {product.brand}</li>}
                            {product.category && <li>Category: {product.category}</li>}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Buy Box (lg:col-span-3) */}
                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 sticky top-24 border border-white/10 shadow-2xl"
                    >
                        <div className="mb-4">
                            <span className="text-2xl font-bold text-white">₹{product.price}</span>
                        </div>

                        <div className="mb-6">
                            {product.countInStock > 0 ? (
                                <span className="text-green-400 font-medium text-lg">In Stock</span>
                            ) : (
                                <span className="text-red-400 font-medium text-lg">Out of Stock</span>
                            )}
                        </div>

                        {product.countInStock > 0 && (
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm mb-2">Quantity:</label>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white outline-none focus:border-accent"
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className="btn-outline w-full flex justify-center items-center gap-2"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.countInStock === 0}
                                className="btn-primary w-full flex justify-center items-center gap-2"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-center text-gray-400">
                            <div className="flex justify-center gap-4 mb-2">
                                <span className="flex items-center gap-1 cursor-pointer hover:text-white"><ShieldCheck size={14} /> Secure transaction</span>
                            </div>
                            <p>Sold by <span className="text-accent">SHANAA</span></p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Related Products / Reviews Section could go here */}
            {relatedProducts.length > 0 && (
                <div className="mt-20">
                    <h2 className="text-2xl font-serif text-white mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {relatedProducts.map(rp => (
                            <Link key={rp._id} to={`/product/${rp._id}`} className="glass-card p-4 hover:bg-white/5 transition-colors group">
                                <div className="h-48 overflow-hidden rounded mb-4">
                                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="text-white font-medium truncate">{rp.name}</h3>
                                <p className="text-accent">${rp.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;
