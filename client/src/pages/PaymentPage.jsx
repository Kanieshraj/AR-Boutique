import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const PaymentPage = () => {
    const { shippingAddress, savePaymentMethod } = useCart();
    const navigate = useNavigate();

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('Stripe');

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="container mx-auto px-6 pt-32 pb-12 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-lg"
            >
                <h1 className="text-3xl font-serif text-white mb-6 text-center">Payment Method</h1>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="flex items-center space-x-3 text-gray-300 cursor-pointer p-4 border border-white/10 rounded-lg bg-black/30 hover:bg-white/5 transition-colors">
                            <input
                                type="radio"
                                id="Stripe"
                                name="paymentMethod"
                                value="Stripe"
                                checked
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="text-accent focus:ring-accent bg-transparent"
                            />
                            <span className="text-lg">Stripe / Credit Card</span>
                        </label>
                    </div>

                    <button type="submit" className="btn-primary w-full shadow-lg shadow-accent/20">
                        Continue
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default PaymentPage;
