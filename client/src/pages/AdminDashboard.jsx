import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Users, Settings, Plus, Trash2, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        sales: 0,
        ordersCount: 0,
        productsCount: 0,
        usersCount: 0
    });
    const [products, setProducts] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (user && user.isAdmin) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const { data: ordersData } = await api.get('/api/orders', config);
                const { data: usersData } = await api.get('/api/users', config);
                const { data: productsData } = await api.get('/api/products');

                setOrders(ordersData);
                setUsersList(usersData);
                setProducts(productsData);

                const totalSales = ordersData.reduce((acc, order) => acc + order.totalPrice, 0);

                setStats({
                    sales: totalSales.toFixed(2),
                    ordersCount: ordersData.length,
                    productsCount: productsData.length,
                    usersCount: usersData.length
                });
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const deleteHandler = async (id, type) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                if (type === 'product') {
                    await api.delete(`/api/products/${id}`, config);
                } else if (type === 'user') {
                    await api.delete(`/api/users/${id}`, config);
                }
                fetchData(); // Refresh data
            } catch (error) {
                alert(error.response?.data?.message || error.message);
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.post('/api/products', {}, config);
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    if (!user || !user.isAdmin) {
        return <div className="min-h-screen pt-24 text-center text-red-500">Access Denied. Admin only.</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Total Sales', value: `$${stats.sales}`, color: 'text-green-400' },
                                { label: 'Total Orders', value: stats.ordersCount, color: 'text-blue-400' },
                                { label: 'Total Products', value: stats.productsCount, color: 'text-purple-400' },
                                { label: 'Total Users', value: stats.usersCount, color: 'text-orange-400' },
                            ].map((stat, index) => (
                                <div key={index} className="glass-card p-6">
                                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-gray-400">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="p-3">ID</th>
                                            <th className="p-3">User</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Total</th>
                                            <th className="p-3">Paid</th>
                                            <th className="p-3">Delivered</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="p-3">{order._id.substring(0, 8)}...</td>
                                                <td className="p-3">{order.user ? order.user.name : 'Deleted User'}</td>
                                                <td className="p-3">{order.createdAt.substring(0, 10)}</td>
                                                <td className="p-3">${order.totalPrice}</td>
                                                <td className="p-3">
                                                    {order.isPaid ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
                                                </td>
                                                <td className="p-3">
                                                    {order.isDelivered ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
                                                </td>
                                                <td className="p-3">
                                                    {!order.isDelivered && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                                                    await api.put(`/api/orders/${order._id}/deliver`, {}, config);
                                                                    fetchData();
                                                                } catch (error) {
                                                                    alert(error.response?.data?.message || error.message);
                                                                }
                                                            }}
                                                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div >
                    </>
                );
            case 'products':
                return (
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Products Management</h2>
                            <button onClick={createProductHandler} className="btn-primary flex items-center gap-2 py-2 px-4">
                                <Plus size={16} /> Add Product
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-400">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Price</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Stock</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-3">{product._id.substring(0, 8)}...</td>
                                            <td className="p-3 text-white">{product.name}</td>
                                            <td className="p-3">${product.price}</td>
                                            <td className="p-3">{product.category}</td>
                                            <td className="p-3">{product.countInStock}</td>
                                            <td className="p-3 flex gap-2">
                                                <Link to={`/admin/product/${product._id}/edit`} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></Link>
                                                <button onClick={() => deleteHandler(product._id, 'product')} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Users Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-400">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Admin</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map(u => (
                                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-3">{u._id.substring(0, 8)}...</td>
                                            <td className="p-3 text-white">{u.name}</td>
                                            <td className="p-3">{u.email}</td>
                                            <td className="p-3">
                                                {u.isAdmin ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                <Link to={`/admin/user/${u._id}/edit`} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></Link>
                                                <button onClick={() => deleteHandler(u._id, 'user')} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen pt-32 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-black/80 backdrop-blur-md border-r border-white/10 hidden md:block fixed h-full z-40">
                <div className="p-6">
                    <h2 className="text-xl font-serif text-accent mb-8">Admin Panel</h2>
                    <nav className="space-y-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-accent' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-white/10 text-accent' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ShoppingBag size={20} /> Products
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white/10 text-accent' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Users size={20} /> Users
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif text-white capitalize">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-white text-sm font-bold">{user.name}</p>
                            <p className="text-gray-400 text-xs">Administrator</p>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center text-white py-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>
                ) : (
                    renderContent()
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
