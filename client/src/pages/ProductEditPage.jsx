import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProduct();
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
                `/api/products/${id}`,
                {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    description,
                    countInStock,
                },
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
                <h1 className="text-3xl font-serif text-white mb-6">Edit Product</h1>
                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Product Name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Price"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Image URL</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Image URL"
                        />
                        {/* TODO: Add File Upload later if needed */}
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Brand"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Category"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Count In Stock</label>
                        <input
                            type="number"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Stock Count"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-accent outline-none"
                            placeholder="Product Description"
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
                        <Save size={20} /> Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;
