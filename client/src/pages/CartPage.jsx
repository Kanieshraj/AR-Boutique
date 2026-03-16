import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus, ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (user) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=shipping');
        }
    };

    const updateQty = (item, newQty) => {
        if (newQty > 0 && newQty <= item.countInStock) {
            addToCart(item, newQty);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const tax = subtotal * 0.15; // Example 15% tax
    const total = subtotal + tax; // Shipping is free assumption

    return (
        <div className="container mx-auto px-6 pt-32 pb-12 min-h-screen">
            <h1 className="text-3xl font-serif text-white mb-8 flex items-center gap-4">
                Shopping Cart <span className="text-lg text-gray-500 font-sans">({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)} items)</span>
            </h1>

            {cartItems.length === 0 ? (
                <div className="glass-card p-12 text-center max-w-2xl mx-auto mt-12">
                    <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={48} className="text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                        <ArrowLeft size={20} /> Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <motion.div
                                key={item.product}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-white/20 transition-colors"
                            >
                                {/* Product Image */}
                                <Link to={`/product/${item.product}`} className="w-full sm:w-32 h-32 flex-shrink-0 bg-white/5 rounded-md overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-grow space-y-2">
                                    <Link to={`/product/${item.product}`} className="text-xl font-medium text-white hover:text-accent transition-colors block">
                                        {item.name}
                                    </Link>
                                    <p className="text-sm text-green-400 font-medium">In Stock</p>
                                    <div className="flex items-center text-sm text-gray-400 gap-4">
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors hover:underline"
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Quantity */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                                    <span className="text-2xl font-bold text-white">₹{item.price}</span>

                                    <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-1">
                                        <button
                                            onClick={() => updateQty(item, Number(item.qty) - 1)}
                                            disabled={item.qty <= 1}
                                            className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Minus size={16} className="text-gray-300" />
                                        </button>
                                        <span className="w-10 text-center text-white font-bold">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item, Number(item.qty) + 1)}
                                            disabled={item.qty >= item.countInStock}
                                            className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus size={16} className="text-gray-300" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24 border border-white/10">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (Est. 15%)</span>
                                    <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-white text-2xl font-bold mb-8">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-accent/20 mb-6 bg-gradient-to-r from-accent to-yellow-500 text-black border-none hover:scale-[1.02] transform transition-transform"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="space-y-4 bg-white/5 p-4 rounded-lg">
                                <div className="flex items-center gap-3 text-sm text-gray-300 justify-center">
                                    <ShieldCheck size={18} className="text-green-400" />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex justify-center gap-4 opacity-70">
                                    <CreditCard size={24} />
                                    <span className="text-xs self-center font-mono">ENCRYPTED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
