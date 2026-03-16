import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, User, Settings, Award, ChevronRight, Gift, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Profile Edit State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/api/orders/myorders', config);
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.put('/api/users/profile', { name, email, password }, config);
            setMessage('Profile Updated Successfully');
            setUpdateSuccess(true);
            setTimeout(() => {
                setMessage(null);
                setUpdateSuccess(false);
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Update failed');
        }
    };

    // Loyalty Logic
    const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const getTier = (spent) => {
        if (spent >= 1000) return { name: 'Platinum', color: 'bg-gradient-to-r from-slate-300 via-white to-slate-300 text-black', icon: Shield, next: null, limit: 1000 };
        if (spent >= 500) return { name: 'Gold', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black', icon: Award, next: 'Platinum', limit: 1000 };
        return { name: 'Silver', color: 'bg-gray-400 text-white', icon: User, next: 'Gold', limit: 500 };
    };

    const currentTier = getTier(totalSpent);
    const progress = currentTier.next ? (totalSpent / currentTier.limit) * 100 : 100;

    if (!user) return <div className="text-center pt-32 text-white">Please log in.</div>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="container mx-auto px-6 pt-32 pb-12 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-1/4">
                    <div className="glass-card p-6 sticky top-28">
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${currentTier.color}`}>
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-white font-serif font-bold">{user.name}</h2>
                                <p className="text-xs text-accent uppercase tracking-widest">{currentTier.name} Member</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                        ? 'bg-accent text-prime font-bold shadow-lg shadow-accent/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-4"
                            >
                                <Shield size={18} />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Loyalty Card */}
                                    <div className="glass-card p-8 border-t-4 border-accent relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-1">Current Tier</h3>
                                                    <h2 className={`text-4xl font-serif ${currentTier.name === 'Platinum' ? 'text-white' : 'text-accent'}`}>
                                                        {currentTier.name}
                                                    </h2>
                                                </div>
                                                <div className={`p-3 rounded-full ${currentTier.color.split(' ')[0]}`}>
                                                    <currentTier.icon size={32} className="text-prime" />
                                                </div>
                                            </div>

                                            <div className="mb-2 flex justify-between text-sm">
                                                <span className="text-white font-bold">${totalSpent} <span className="text-gray-400 font-normal">spent</span></span>
                                                {currentTier.next && (
                                                    <span className="text-gray-400">
                                                        <span className="text-accent font-bold">${currentTier.limit - totalSpent}</span> to {currentTier.next}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                                                <div
                                                    className="bg-accent h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-3">
                                                    <Gift className="text-accent" />
                                                    <div>
                                                        <p className="text-white text-sm font-bold">Free Shipping</p>
                                                        <p className="text-xs text-gray-500">On all orders</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-3">
                                                    <Award className="text-accent" />
                                                    <div>
                                                        <p className="text-white text-sm font-bold">Early Access</p>
                                                        <p className="text-xs text-gray-500">To new drops</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg flex items-center gap-3">
                                                    <Shield className="text-accent" />
                                                    <div>
                                                        <p className="text-white text-sm font-bold">Priority Support</p>
                                                        <p className="text-xs text-gray-500">24/7 Access</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Orders Preview */}
                                    <div className="glass-card p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                                            <button onClick={() => setActiveTab('orders')} className="text-accent text-sm hover:underline">View All</button>
                                        </div>
                                        {orders.slice(0, 3).map(order => (
                                            <div key={order._id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
                                                <div>
                                                    <p className="text-white font-bold">Order #{order._id.substring(0, 8)}</p>
                                                    <p className="text-xs text-gray-500">{order.createdAt.substring(0, 10)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-accent font-bold">${order.totalPrice}</p>
                                                    <span className={`text-[10px] uppercase tracking-wider ${order.isDelivered ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {order.isDelivered ? 'Delivered' : 'Processing'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ORDERS TAB */}
                            {activeTab === 'orders' && (
                                <div className="glass-card p-6">
                                    <h2 className="text-2xl font-serif text-white mb-6">Order History</h2>
                                    {loading ? (
                                        <p className="text-gray-400">Loading...</p>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package size={48} className="mx-auto text-gray-600 mb-4" />
                                            <p className="text-gray-400">No orders yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order._id} className="border border-white/10 rounded-xl p-5 bg-black/20 hover:border-accent/30 transition-all">
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-white font-bold text-lg">Order #{order._id}</span>
                                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-400 mt-1">Placed on {order.createdAt.substring(0, 10)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-serif text-accent">${order.totalPrice}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                                            <span className="text-sm text-gray-300">{order.isDelivered ? `Delivered at ${order.deliveredAt?.substring(0, 10)}` : 'Processing / In Transit'}</span>
                                                        </div>
                                                        <ChevronRight className="text-gray-500" size={16} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SETTINGS TAB */}
                            {activeTab === 'settings' && (
                                <div className="glass-card p-8">
                                    <h2 className="text-2xl font-serif text-white mb-6">Account Settings</h2>
                                    {message && (
                                        <div className={`p-4 rounded mb-6 ${updateSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">New Password (leave blank to keep current)</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-field"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="input-field"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary w-full">
                                            Update Profile
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
