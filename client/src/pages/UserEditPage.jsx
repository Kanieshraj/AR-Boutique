import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const UserEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await api.get(`/api/users/${id}`, config);
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await api.put(
                `/api/users/${id}`,
                { name, email, isAdmin },
                config
            );
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <div className="text-white text-center pt-24">Loading...</div>;

    return (
        <div className="container mx-auto px-6 pt-24 pb-12">
            <Link to="/admin" className="btn-primary inline-flex items-center gap-2 mb-6">
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>

            <div className="glass-card p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-serif text-white mb-6">Edit User</h1>
                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Email"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="w-5 h-5 accent-accent"
                        />
                        <label className="text-gray-300">Is Admin?</label>
                    </div>

                    <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
                        <Save size={20} /> Update User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserEditPage;
