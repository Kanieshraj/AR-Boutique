import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ShippingPage = () => {
    const { shippingAddress, saveShippingAddress } = useCart();
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate('/payment');
    };

    return (
        <div className="container mx-auto px-6 pt-32 pb-12 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-lg"
            >
                <h1 className="text-3xl font-serif text-white mb-6 text-center">Shipping</h1>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Address</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">City</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Postal Code</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter postal code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Country</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full shadow-lg shadow-accent/20">
                        Continue to Payment
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ShippingPage;
