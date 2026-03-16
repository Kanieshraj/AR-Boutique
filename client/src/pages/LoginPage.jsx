import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') ? `/${new URLSearchParams(location.search).get('redirect')}` : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, error } = await login(email, password);
        if (success) {
            navigate(redirect);
        } else {
            alert(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-32 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-md"
            >
                <h1 className="text-3xl font-serif text-white mb-6 text-center">Welcome Back</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400">
                    New Customer? <Link to="/register" className="text-accent hover:underline">Create an Account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
