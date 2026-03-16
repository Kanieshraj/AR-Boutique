import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="glass-card group overflow-hidden relative">
            <Link to={`/product/${product._id}`}>
                <div className="h-64 overflow-hidden relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.countInStock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <Link to={`/product/${product._id}`}>
                            <h3 className="text-lg font-medium text-white group-hover:text-accent transition-colors truncate w-40">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center text-accent text-sm mt-1">
                            <Star size={14} fill="currentColor" />
                            <span className="ml-1 text-gray-400">
                                {product.rating} ({product.numReviews})
                            </span>
                        </div>
                    </div>
                    <p className="text-xl font-bold text-white">₹{product.price}</p>
                </div>

                <button
                    disabled={product.countInStock === 0}
                    className="w-full mt-2 py-2 bg-white/10 hover:bg-accent text-white hover:text-black font-medium rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingBag size={18} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
