import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';

const PlaceOrderPage = () => {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 20);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        if (!paymentMethod) {
            navigate('/payment');
        }
    }, [paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await api.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }, config);

            clearCart();
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            alert('Error placing order: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto px-6 pt-32 pb-12">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-serif text-accent mb-8"
            >
                Order Summary
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Shipping</h2>
                        <p className="text-gray-400">
                            <strong className="text-white">Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Payment Method</h2>
                        <p className="text-gray-400">
                            <strong className="text-white">Method: </strong>
                            {paymentMethod}
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Order Items</h2>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-400">Your cart is empty</p>
                        ) : (
                            <ul className="divide-y divide-white/10">
                                {cartItems.map((item, index) => (
                                    <li key={index} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            <Link to={`/product/${item.product}`} className="text-accent hover:underline">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-400">
                                            {item.qty} x ₹{item.price} = <span className="text-white">₹{(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
                        <div className="space-y-2 border-b border-white/10 pb-4 mb-4">
                            <div className="flex justify-between text-gray-400">
                                <span>Items</span>
                                <span>₹{itemsPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>₹{shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax</span>
                                <span>₹{taxPrice}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-white text-lg font-bold mb-6">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <button
                            type="button"
                            className="btn-primary w-full"
                            onClick={placeOrderHandler}
                            disabled={cartItems.length === 0}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
