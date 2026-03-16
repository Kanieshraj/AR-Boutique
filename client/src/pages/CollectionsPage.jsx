import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const collections = [
    {
        id: 1,
        title: 'Summer Breeze',
        description: 'Light, airy fabrics for the perfect summer look.',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
        link: '/shop?category=summer'
    },
    {
        id: 2,
        title: 'Urban Chic',
        description: 'Modern sophisticated styles for city life.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        link: '/shop?category=urban'
    },
    {
        id: 3,
        title: 'Evening Elegance',
        description: 'Stand out at every event with our premium evening wear.',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1924&auto=format&fit=crop',
        link: '/shop?category=evening'
    }
];

const CollectionsPage = () => {
    return (
        <div className="container mx-auto px-6 pt-24 pb-12">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-serif text-accent mb-12 text-center"
            >
                Our Collections
            </motion.h1>

            <div className="space-y-16">
                {collections.map((collection, index) => (
                    <motion.div
                        key={collection.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="w-full md:w-1/2 h-[400px] overflow-hidden rounded-xl relative group">
                            <img
                                src={collection.image}
                                alt={collection.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        <div className="w-full md:w-1/2 text-center md:text-left space-y-4 p-4">
                            <h2 className="text-3xl font-serif text-white">{collection.title}</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {collection.description}
                            </p>
                            <Link to={collection.link} className="btn-outline inline-block mt-4">
                                Explore Collection
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CollectionsPage;
