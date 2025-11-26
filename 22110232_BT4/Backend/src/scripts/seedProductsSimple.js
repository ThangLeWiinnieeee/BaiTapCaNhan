import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';

dotenv.config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_db';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Laptop Dell XPS 13',
    description: 'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD',
    price: 25000000,
    category: 'Electronics',
    stock: 15,
    status: 'active',
    discount: 15,
    views: 2450,
    rating: 4.5,
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, 256GB storage',
    price: 28000000,
    category: 'Electronics',
    stock: 20,
    status: 'active',
    discount: 10,
    views: 3820,
    rating: 4.8,
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Flagship Android phone with 128GB storage',
    price: 22000000,
    category: 'Electronics',
    stock: 18,
    status: 'active',
    discount: 20,
    views: 2950,
    rating: 4.6,
  },
  {
    name: 'MacBook Pro 14"',
    description: 'Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD',
    price: 45000000,
    category: 'Electronics',
    stock: 10,
    status: 'active',
    discount: 5,
    views: 1850,
    rating: 4.9,
  },
  {
    name: 'Wireless Mouse Logitech MX Master 3',
    description: 'Premium wireless mouse with ergonomic design',
    price: 2500000,
    category: 'Electronics',
    stock: 50,
    status: 'active',
    discount: 25,
    views: 1520,
    rating: 4.4,
  },
  {
    name: 'Mechanical Keyboard Keychron K8',
    description: 'Wireless mechanical keyboard with RGB backlight',
    price: 3500000,
    category: 'Electronics',
    stock: 30,
    status: 'active',
    discount: 30,
    views: 1890,
    rating: 4.3,
  },
  {
    name: 'Nike Air Max 90',
    description: 'Classic running shoes with air cushioning',
    price: 3500000,
    category: 'Fashion',
    stock: 25,
    status: 'active',
    discount: 20,
    views: 2340,
    rating: 4.2,
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost technology',
    price: 4500000,
    category: 'Fashion',
    stock: 20,
    status: 'active',
    discount: 15,
    views: 1980,
    rating: 4.5,
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-fit jeans',
    price: 2500000,
    category: 'Fashion',
    stock: 40,
    status: 'active',
    discount: 35,
    views: 3250,
    rating: 4.1,
  },
  {
    name: 'Uniqlo Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt, various colors',
    price: 299000,
    category: 'Fashion',
    stock: 100,
    status: 'active',
    discount: 40,
    views: 5420,
    rating: 4.0,
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic novel by F. Scott Fitzgerald',
    price: 150000,
    category: 'Books',
    stock: 60,
    status: 'active',
    discount: 10,
    views: 890,
    rating: 4.7,
  },
  {
    name: '1984 by George Orwell',
    description: 'Dystopian novel, paperback edition',
    price: 180000,
    category: 'Books',
    stock: 45,
    status: 'active',
    discount: 5,
    views: 1120,
    rating: 4.8,
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Programming book by Robert C. Martin',
    price: 450000,
    category: 'Books',
    stock: 30,
    status: 'active',
    discount: 15,
    views: 2340,
    rating: 4.9,
  },
  {
    name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    description: 'Classic software engineering book',
    price: 500000,
    category: 'Books',
    stock: 25,
    status: 'active',
    discount: 10,
    views: 1890,
    rating: 4.8,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 8500000,
    category: 'Electronics',
    stock: 12,
    status: 'active',
    discount: 12,
    views: 2780,
    rating: 4.7,
  },
  {
    name: 'AirPods Pro 2',
    description: 'Apple wireless earbuds with noise cancellation',
    price: 6500000,
    category: 'Electronics',
    stock: 35,
    status: 'active',
    discount: 8,
    views: 3450,
    rating: 4.6,
  },
  {
    name: 'Coffee Maker Delonghi',
    description: 'Automatic espresso machine',
    price: 12000000,
    category: 'Home & Kitchen',
    stock: 8,
    status: 'active',
    discount: 20,
    views: 1240,
    rating: 4.4,
  },
  {
    name: 'Stand Mixer KitchenAid',
    description: 'Professional stand mixer, 5.5 quart',
    price: 15000000,
    category: 'Home & Kitchen',
    stock: 5,
    status: 'active',
    discount: 25,
    views: 980,
    rating: 4.5,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat, 6mm thickness',
    price: 800000,
    category: 'Sports',
    stock: 50,
    status: 'active',
    discount: 30,
    views: 1650,
    rating: 4.2,
  },
  {
    name: 'Dumbbell Set 20kg',
    description: 'Adjustable dumbbell set with stand',
    price: 3500000,
    category: 'Sports',
    stock: 15,
    status: 'active',
    discount: 15,
    views: 1320,
    rating: 4.3,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Starting to seed products...');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${createdProducts.length} products`);

    // Display categories
    const categories = await Product.distinct('category');
    console.log('📁 Categories:', categories);

    // Display some stats
    const totalProducts = await Product.countDocuments();
    const avgPrice = await Product.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    console.log(`📊 Total products: ${totalProducts}`);
    console.log(`💰 Average price: ${avgPrice[0]?.avgPrice.toFixed(0)} VND`);

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
