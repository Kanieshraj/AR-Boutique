import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    // Initial state is empty, updated via useEffect when user changes
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('Stripe');

    // Helper to get user-specific storage keys
    const getKeys = (currentUser) => {
        const suffix = currentUser ? `_${currentUser._id}` : '_guest';
        return {
            cart: `cartItems${suffix}`,
            address: `shippingAddress${suffix}`,
            payment: `paymentMethod${suffix}`
        };
    };

    // Load data when user changes
    useEffect(() => {
        const keys = getKeys(user);

        const loadedCart = localStorage.getItem(keys.cart)
            ? JSON.parse(localStorage.getItem(keys.cart))
            : [];
        setCartItems(loadedCart);

        const loadedAddress = localStorage.getItem(keys.address)
            ? JSON.parse(localStorage.getItem(keys.address))
            : {};
        setShippingAddress(loadedAddress);

        const loadedPayment = localStorage.getItem(keys.payment)
            ? JSON.parse(localStorage.getItem(keys.payment))
            : 'Stripe';
        setPaymentMethod(loadedPayment);

    }, [user]);

    const addToCart = (product, qty) => {
        const productId = product._id || product.product;

        const item = {
            product: productId,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty
        };

        const existItem = cartItems.find((x) => x.product === item.product);

        let newCartItems;
        if (existItem) {
            newCartItems = cartItems.map((x) => x.product === existItem.product ? item : x);
        } else {
            newCartItems = [...cartItems, item];
        }

        setCartItems(newCartItems);
        const keys = getKeys(user);
        localStorage.setItem(keys.cart, JSON.stringify(newCartItems));
    };

    const removeFromCart = (id) => {
        const newCartItems = cartItems.filter((x) => x.product !== id);
        setCartItems(newCartItems);
        const keys = getKeys(user);
        localStorage.setItem(keys.cart, JSON.stringify(newCartItems));
    };

    const clearCart = () => {
        setCartItems([]);
        const keys = getKeys(user);
        localStorage.removeItem(keys.cart);
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        const keys = getKeys(user);
        localStorage.setItem(keys.address, JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        const keys = getKeys(user);
        localStorage.setItem(keys.payment, JSON.stringify(data));
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            shippingAddress,
            paymentMethod,
            addToCart,
            removeFromCart,
            clearCart,
            saveShippingAddress,
            savePaymentMethod
        }}>
            {children}
        </CartContext.Provider>
    );
};
