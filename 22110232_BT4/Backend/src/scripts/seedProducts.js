import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Laptop Dell XPS 13',
    description: 'High-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD',
    price: 25000000,
    category: 'Electronics',
    stock: 15,
    status: 'active',
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, 256GB storage',
    price: 28000000,
    category: 'Electronics',
    stock: 20,
    status: 'active',
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Flagship Android phone with 128GB storage',
    price: 22000000,
    category: 'Electronics',
    stock: 18,
    status: 'active',
  },
  {
    name: 'MacBook Pro 14"',
    description: 'Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD',
    price: 45000000,
    category: 'Electronics',
    stock: 10,
    status: 'active',
  },
  {
    name: 'Wireless Mouse Logitech MX Master 3',
    description: 'Premium wireless mouse with ergonomic design',
    price: 2500000,
    category: 'Electronics',
    stock: 50,
    status: 'active',
  },
  {
    name: 'Mechanical Keyboard Keychron K8',
    description: 'Wireless mechanical keyboard with RGB backlight',
    price: 3500000,
    category: 'Electronics',
    stock: 30,
    status: 'active',
  },
  {
    name: 'Nike Air Max 90',
    description: 'Classic running shoes with air cushioning',
    price: 3500000,
    category: 'Fashion',
    stock: 25,
    status: 'active',
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost technology',
    price: 4500000,
    category: 'Fashion',
    stock: 20,
    status: 'active',
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-fit jeans',
    price: 2500000,
    category: 'Fashion',
    stock: 40,
    status: 'active',
  },
  {
    name: 'Uniqlo Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt, various colors',
    price: 299000,
    category: 'Fashion',
    stock: 100,
    status: 'active',
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic novel by F. Scott Fitzgerald',
    price: 150000,
    category: 'Books',
    stock: 60,
    status: 'active',
  },
  {
    name: '1984 by George Orwell',
    description: 'Dystopian novel, paperback edition',
    price: 180000,
    category: 'Books',
    stock: 45,
    status: 'active',
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Programming book by Robert C. Martin',
    price: 450000,
    category: 'Books',
    stock: 30,
    status: 'active',
  },
  {
    name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    description: 'Classic software engineering book',
    price: 500000,
    category: 'Books',
    stock: 25,
    status: 'active',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 8500000,
    category: 'Electronics',
    stock: 12,
    status: 'active',
  },
  {
    name: 'AirPods Pro 2',
    description: 'Apple wireless earbuds with noise cancellation',
    price: 6500000,
    category: 'Electronics',
    stock: 35,
    status: 'active',
  },
  {
    name: 'Coffee Maker Delonghi',
    description: 'Automatic espresso machine',
    price: 12000000,
    category: 'Home & Kitchen',
    stock: 8,
    status: 'active',
  },
  {
    name: 'Stand Mixer KitchenAid',
    description: 'Professional stand mixer, 5.5 quart',
    price: 15000000,
    category: 'Home & Kitchen',
    stock: 5,
    status: 'active',
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat, 6mm thickness',
    price: 800000,
    category: 'Sports',
    stock: 50,
    status: 'active',
  },
  {
    name: 'Dumbbell Set 20kg',
    description: 'Adjustable dumbbell set with stand',
    price: 3500000,
    category: 'Sports',
    stock: 15,
    status: 'active',
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} products`);

    // Display categories
    const categories = await Product.distinct('category');
    console.log('Categories:', categories);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

