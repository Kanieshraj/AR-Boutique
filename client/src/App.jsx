import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CollectionsPage from './pages/CollectionsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import OrderDetailsPage from './pages/OrderDetailsPage';
import ProductEditPage from './pages/ProductEditPage';
import UserEditPage from './pages/UserEditPage';
import ShowcasePage from './pages/ShowcasePage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';

function App() {
    const location = useLocation();
    const isFullScreenPage = ['/', '/showcase', '/tryon'].includes(location.pathname);

    return (
        <AuthProvider>
            <CartProvider>
                <div className="flex flex-col min-h-screen bg-prime text-light font-sans selection:bg-accent selection:text-prime">
                    <Header />
                    <main className={`flex-grow ${!isFullScreenPage ? 'pt-24 pb-12' : ''}`}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/showcase" element={<ShowcasePage />} />
                            <Route path="/tryon" element={<VirtualTryOnPage />} />
                            <Route path="/collections" element={<CollectionsPage />} />
                            <Route path="/product/:id" element={<ProductDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/profile" element={<UserDashboard />} />
                            <Route path="/shipping" element={<ShippingPage />} />
                            <Route path="/payment" element={<PaymentPage />} />
                            <Route path="/placeorder" element={<PlaceOrderPage />} />
                            <Route path="/order/:id" element={<OrderDetailsPage />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
                            <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
                        </Routes>
                    </main>
                    <footer className="bg-black py-10 border-t border-white/10 text-center text-gray-500">
                        <p>&copy; 2024 SHANAA. All rights reserved.</p>
                    </footer>
                </div>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
