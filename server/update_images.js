const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel.js');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const updateImages = async () => {
    try {
        console.log('Connecting to MongoDB...');

        await Product.updateOne(
            { name: 'Classic Trench Coat' },
            { $set: { image: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop' } }
        );
        console.log('Updated Classic Trench Coat');

        await Product.updateOne(
            { name: 'Gold Plated Necklace' },
            { $set: { image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop' } }
        );
        console.log('Updated Gold Plated Necklace');

        console.log('Data Updated!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

updateImages();
