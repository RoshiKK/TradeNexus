const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://TradeNexus:TradeNexus%40123@tradenexus.mxtddgf.mongodb.net/products";

const products = [
  {
    title: "Quantum Pro Laptop",
    description: "Next-gen M3 chip with 32GB RAM and 1TB SSD. The ultimate machine for creators and engineers.",
    price: 2499,
    stock: 15,
    imageUrl: "/images/laptop.png"
  },
  {
    title: "Nexus Glass VR",
    description: "Immersive 8K spatial computing headset. Experience reality in a whole new dimension.",
    price: 3499,
    stock: 10,
    imageUrl: "/images/vr.png"
  },
  {
    title: "Aura Smart Watch",
    description: "Premium titanium finish with advanced health tracking and 5-day battery life.",
    price: 399,
    stock: 50,
    imageUrl: "/images/watch.png"
  },
  {
    title: "Volt Wireless Buds",
    description: "Active noise cancellation with high-fidelity spatial audio and 30h total playtime.",
    price: 199,
    stock: 120,
    imageUrl: "/images/buds.png"
  },
  {
    title: "Zenith Gaming Mouse",
    description: "Ultra-lightweight 54g design with 30K DPI optical sensor for precision gaming.",
    price: 129,
    stock: 45,
    imageUrl: "/images/mouse.png"
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to: ${mongoose.connection.host}`);
    console.log(`Database Name: ${mongoose.connection.name}`);

    const Product = mongoose.model('Product', new mongoose.Schema({
      title: String,
      description: String,
      price: Number,
      stock: Number,
      imageUrl: String
    }));

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log(`Inserting ${products.length} amazing products with images...`);
    await Product.insertMany(products);

    console.log('✅ Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
