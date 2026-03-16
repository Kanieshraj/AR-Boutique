const products = [
    {
        name: 'Silk Evening Gown',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
        description: 'Elegant silk evening gown perfect for special occasions. Features a flattering silhouette and premium fabric.',
        brand: 'Luxe',
        category: 'Dresses',
        price: 299.99,
        countInStock: 5,
        rating: 4.8,
        numReviews: 12,
        tags: ['formal', 'evening', 'silk', 'gown']
    },
    {
        name: 'Structured Blazer',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        description: 'Tailored blazer for a sharp, professional look. Made from high-quality wool blend.',
        brand: 'Luxe',
        category: 'Outerwear',
        price: 189.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 8,
        tags: ['work', 'office', 'formal', 'blazer', 'wool']
    },
    {
        name: 'Cashmere Sweater',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
        description: 'Luxuriously soft cashmere sweater. Essential for your winter wardrobe.',
        brand: 'Luxe',
        category: 'Tops',
        price: 129.99,
        countInStock: 0,
        rating: 4.9,
        numReviews: 20,
        tags: ['winter', 'casual', 'warm', 'cashmere']
    },
    {
        name: 'Leather Handbag',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        description: 'Genuine leather handbag with ample storage and stylish design.',
        brand: 'Luxe',
        category: 'Accessories',
        price: 349.99,
        countInStock: 3,
        rating: 4.7,
        numReviews: 15,
        tags: ['accessories', 'leather', 'bag']
    },
    {
        name: 'Summer Floral Dress',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
        description: 'Breezy and beautiful for those warm summer days.',
        brand: 'Luxe',
        category: 'Dresses',
        price: 89.99,
        countInStock: 8,
        rating: 4.6,
        numReviews: 5,
        tags: ['summer', 'beach', 'casual', 'floral']
    },
    {
        name: 'Classic Trench Coat',
        image: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop',
        description: 'Timeless trench coat design for any season.',
        brand: 'Luxe',
        category: 'Outerwear',
        price: 249.99,
        countInStock: 2,
        rating: 4.8,
        numReviews: 18,
        tags: ['outerwear', 'classic', 'coat', 'work']
    },
    {
        name: 'Classic White Sneakers',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
        description: 'Minimalist white sneakers crafted from premium leather.',
        brand: 'UrbanWalk',
        category: 'Shoes',
        price: 119.99,
        countInStock: 15,
        rating: 4.7,
        numReviews: 24,
        tags: ['shoes', 'sneakers', 'casual', 'white']
    },
    {
        name: 'Gold Plated Necklace',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
        description: 'Elegant 18k gold-plated pendant necklace. The perfect subtle accessory.',
        brand: 'Aura',
        category: 'Accessories',
        price: 89.99,
        countInStock: 20,
        rating: 4.9,
        numReviews: 45,
        tags: ['jewelry', 'necklace', 'gold', 'accessories']
    },
    {
        name: 'Aviator Sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
        description: 'Classic aviator sunglasses with polarized lenses and metal frames.',
        brand: 'Shade',
        category: 'Accessories',
        price: 149.99,
        countInStock: 12,
        rating: 4.6,
        numReviews: 32,
        tags: ['sunglasses', 'accessories', 'eyewear', 'summer']
    },
    {
        name: 'Denim Jacket',
        image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop',
        description: 'Vintage wash denim jacket with a relaxed fit. A wardrobe staple.',
        brand: 'DenimCo',
        category: 'Outerwear',
        price: 99.99,
        countInStock: 8,
        rating: 4.5,
        numReviews: 19,
        tags: ['jacket', 'denim', 'casual', 'outerwear']
    },
    {
        name: 'Silk Scarf',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop',
        description: 'Vibrant patterned silk scarf. Can be styled in multiple ways.',
        brand: 'Luxe',
        category: 'Accessories',
        price: 59.99,
        countInStock: 25,
        rating: 4.8,
        numReviews: 11,
        tags: ['scarf', 'silk', 'accessories', 'pattern']
    },
    {
        name: 'Slim Fit Chinos',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
        description: 'Comfortable stretch cotton chinos in a modern slim fit.',
        brand: 'Essentials',
        category: 'Pants',
        price: 79.99,
        countInStock: 18,
        rating: 4.4,
        numReviews: 27,
        tags: ['pants', 'chinos', 'casual', 'work']
    }
];

module.exports = products;
