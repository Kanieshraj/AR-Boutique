import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Header = () => {
    const { cartItems } = useCart();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [keyword, setKeyword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/shop?keyword=${keyword}`);
        } else {
            navigate('/shop');
        }
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Collections', path: '/collections' },
        { name: '3D Showcase', path: '/showcase' },
        { name: 'AR Mirror', path: '/tryon' },
    ];

    const isHome = location.pathname === '/';

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-prime/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src={logo}
                        alt="SHANAA"
                        className="h-20 w-auto object-contain invert transition-opacity group-hover:opacity-80"
                    />
                    <span className="text-2xl font-serif text-white tracking-widest font-bold mt-2">
                        SHANAA
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-light uppercase tracking-widest text-white/80 hover:text-accent transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <form onSubmit={submitHandler} className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="bg-transparent border-b border-white/30 text-white text-sm focus:outline-none focus:border-accent w-32 focus:w-48 transition-all px-2 py-1 placeholder-gray-500"
                        />
                        <button type="submit" className="text-white hover:text-accent transition-colors ml-2">
                            <Search size={20} />
                        </button>
                    </form>
                    {user ? (
                        <div className="relative group">
                            <Link to={user.isAdmin ? '/admin' : '/profile'} className="flex items-center gap-2 text-white hover:text-accent transition-colors">
                                <User size={20} />
                                <span className="text-xs uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                            </Link>
                            <div className="absolute right-0 mt-2 w-48 bg-prime border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="py-2">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">Profile</Link>
                                    {user.isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">Dashboard</Link>}
                                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5">Logout</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="text-white hover:text-accent transition-colors">
                            <User size={20} />
                        </Link>
                    )}

                    <Link to="/cart" className="relative text-white hover:text-accent transition-colors">
                        <ShoppingBag size={20} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-prime text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-prime/95 backdrop-blur-xl border-t border-white/10"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-serif text-white hover:text-accent transition-colors border-b border-white/5 pb-2 cursor-pointer"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex gap-4 pt-4">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 btn-outline text-center py-2">
                                    Login
                                </Link>
                                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex-1 btn-primary text-center py-2">
                                    Cart ({cartItems.length})
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
