import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Check, AlertTriangle, CreditCard, Loader } from 'lucide-react';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const location = useLocation();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                };
                const { data } = await api.get(`/api/orders/${id}`, config);
                setOrder(data);

                // Check for Stripe success redirect
                const query = new URLSearchParams(location.search);
                if (query.get('success') && !data.isPaid) {
                    await confirmPaymentSuccess();
                }

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user, location.search]);

    const confirmPaymentSuccess = async () => {
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${user.token}` }
            };
            // Simulate Stripe Webhook Result (Mark as paid)
            const paymentResult = {
                id: `STRIPE-${Date.now()}`,
                status: 'COMPLETED',
                update_time: String(Date.now()),
                email_address: user.email,
            };
            await api.put(`/api/orders/${id}/pay`, paymentResult, config);

            // Refresh order
            const { data } = await api.get(`/api/orders/${id}`, config);
            setOrder(data);
            alert('Payment Successful!');
        } catch (err) {
            console.error('Failed to confirm payment status', err);
        }
    };

    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${user.token}` }
            };

            const { data } = await api.post(`/api/orders/${id}/create-checkout-session`, {}, config);

            // Redirect to Stripe
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            alert('Failed to initialize payment: ' + (err.response?.data?.message || err.message));
            setPaymentLoading(false);
        }
    };

    if (loading) return <div className="pt-32 text-center text-white">Loading order details...</div>;
    if (error) return <div className="pt-32 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-6 pt-32 pb-12">
            <h1 className="text-3xl font-serif text-white mb-8">Order <span className="text-accent">#{order._id}</span></h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Shipping Info */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Shipping</h2>
                        <p className="text-gray-400 mb-2">
                            <strong className="text-white">Name: </strong> {order.user.name}
                        </p>
                        <p className="text-gray-400 mb-2">
                            <strong className="text-white">Email: </strong> <a href={`mailto:${order.user.email}`} className="hover:text-accent">{order.user.email}</a>
                        </p>
                        <p className="text-gray-400 mb-4">
                            <strong className="text-white">Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-500/10 text-green-500 p-3 rounded flex items-center gap-2">
                                <Check size={20} /> Delivered on {order.deliveredAt.substring(0, 10)}
                            </div>
                        ) : (
                            <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded flex items-center gap-2">
                                <AlertTriangle size={20} /> Not Delivered
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Payment Method</h2>
                        <p className="text-gray-400 mb-4">
                            <strong className="text-white">Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <div className="bg-green-500/10 text-green-500 p-3 rounded flex items-center gap-2">
                                <Check size={20} /> Paid on {order.paidAt.substring(0, 10)}
                            </div>
                        ) : (
                            <div className="bg-red-500/10 text-red-500 p-3 rounded flex items-center gap-2">
                                <AlertTriangle size={20} /> Not Paid
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <p className="text-gray-400">Order is empty</p>
                        ) : (
                            <ul className="divide-y divide-white/10">
                                {order.orderItems.map((item, index) => (
                                    <li key={index} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Note: In a real app, populate item details or store more in orderItems */}
                                            <div className="text-white">
                                                <Link to={`/product/${item.product}`} className="hover:text-accent font-medium">
                                                    Item Name (View Product)
                                                </Link>
                                            </div>
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

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
                        <div className="space-y-2 border-b border-white/10 pb-4 mb-4">
                            <div className="flex justify-between text-gray-400">
                                <span>Items</span>
                                <span>₹{order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax</span>
                                <span>₹{order.taxPrice}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-white text-lg font-bold mb-6">
                            <span>Total</span>
                            <span>₹{order.totalPrice}</span>
                        </div>
                        {!order.isPaid && (
                            <button
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                            >
                                {paymentLoading ? <Loader className="animate-spin" /> : <CreditCard />}
                                Pay with Stripe
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
