
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Product = require('../api/models/product');

// Get MONGO_URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
const SEED_DATA_FILE = path.join(__dirname, '..', 'seed_data.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function connectDB() {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the .env file. Please check your .env setup.');
        }
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for CLI operations.');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
}

async function disconnectDB() {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

async function seedData() {
    try {
        const data = [
            {
                "title": "Vintage Leather Jacket",
                "description": "A classic, well-preserved leather jacket from the 80s.",
                "category": "Apparel",
                "start_price": 50.00,
                "reserve_price": 80.00,
                "current_price": 50.00,
                "end_time": "2025-06-08T20:00:00Z",
                "seller": "user123",
                "image_urls": ["https://example.com/jacket1.jpg", "https://example.com/jacket2.jpg"],
                "condition": "Used"
            },
            {
                "title": "Vintage Leather Jacket",
                "description": "Discover a timeless piece!! This well-preserved vintage leather jacket from the 80s is now available for a new owner. Perfect for adding a classic touch to any wardrobe.",
                "category": "Apparel",
                "start_price": 100.00,
                "reserve_price": 130.00,
                "current_price": 100.00,
                "end_time": "2025-09-11T20:00:00Z",
                "seller": "vintage_lover",
                "image_urls": ["https://example.com/jacket1.jpg", "https://example.com/jacket2.jpg"],
                "condition": "New"
            },
            {
                "title": "Antique Wooden Chair",
                "description": "Hand-carved chair, perfect for a rustic home decor.",
                "category": "Furniture",
                "start_price": 100.00,
                "reserve_price": 150.00,
                "current_price": 100.00,
                "end_time": "2025-06-10T18:30:00Z",
                "seller": "antique_finder",
                "image_urls": ["https://example.com/chair1.jpg"],
                "condition": "Good"
            },
            {
                "title": "Rare Coin Collection",
                "description": "A small but valuable collection of historical coins.",
                "category": "Collectibles",
                "start_price": 250.00,
                "reserve_price": 300.00,
                "current_price": 250.00,
                "end_time": "2025-06-12T15:00:00Z",
                "seller": "coin_master",
                "image_urls": ["https://example.com/coin1.jpg", "https://example.com/coin2.jpg"],
                "condition": "Excellent"
            },
            {
                "title": "Brand New Smartphone X",
                "description": "Latest model, sealed in box, unlocked.",
                "category": "Electronics",
                "start_price": 700.00,
                "reserve_price": 750.00,
                "current_price": 700.00,
                "end_time": "2025-06-09T22:00:00Z",
                "seller": "tech_deals",
                "image_urls": ["https://example.com/phone1.jpg"],
                "condition": "New"
            },
            {
                "title": "Brand New Smartphone X",
                "description": "Latest model, unopened.",
                "category": "Electronics",
                "start_price": 500.00,
                "reserve_price": 550.00,
                "current_price": 500.00,
                "end_time": "2025-06-13T22:00:00Z",
                "seller": "electronic_guru",
                "image_urls": ["https://example.com/phone1.jpg"],
                "condition": "New"
            },
            {
                "title": "Classic Vinyl Record Player",
                "description": "Fully functional, retro design, great sound.",
                "category": "Electronics",
                "start_price": 80.00,
                "reserve_price": 100.00,
                "current_price": 80.00,
                "end_time": "2025-06-11T17:00:00Z",
                "seller": "music_lover",
                "image_urls": ["https://example.com/turntable1.jpg"],
                "condition": "Used"
            }
        ];

        // Ensure database is connected before operations
        if (mongoose.connection.readyState !== 1) { // 1 means connected
            console.log("Database not connected. Attempting to connect...");
            await connectDB();
        }

        // Clear existing products to avoid duplicates when re-running
        await Product.deleteMany({});
        console.log('Existing products cleared.');

        if (data.length > 0) {
            const result = await Product.insertMany(data);
            console.log(`Seeded ${result.length} documents into 'products' collection.`);
        } else {
            console.log('No data found in seed_data to insert.');
        }
    } catch (err) {
        console.error('Error seeding data:', err.message);
    }
}

async function deleteAllData() {
    rl.question("Are you sure you want to delete ALL data from 'products' collection? (yes/no): ", async (answer) => {
        if (answer.toLowerCase() === 'yes') {
            try {
                if (mongoose.connection.readyState !== 1) {
                    await connectDB();
                }
                const result = await Product.deleteMany({});
                console.log(`Deleted ${result.deletedCount} documents from 'products' collection.`);
            } catch (err) {
                console.error('Error deleting data:', err.message);
            } finally {
                rl.close();
                await disconnectDB();
            }
        } else {
            console.log('Deletion cancelled.');
            rl.close();
            await disconnectDB();
        }
    });
}

function displayHelp() {
    console.log("Usage: node server/cli/seed_tool.js [command]");
    console.log("\nCommands:");
    console.log("   seed      - Seed the database with sample data.");
    console.log("   delete    - Delete all data from the 'products' collection.");
    console.log("   help      - Display this help message.");
    console.log("\nExample:");
    console.log("   node server/cli/seed_tool.js seed");
    console.log("   node server/cli/seed_tool.js delete");
}

// Main execution function
async function runCliTool() {
    const command = process.argv[2];

    // Connect DB first for all commands that interact with it
    await connectDB();

    if (command === 'seed') {
        await seedData();
    } else if (command === 'delete') {
        await deleteAllData();
        return;
    } else if (command === 'help' || !command) {
        displayHelp();
    } else {
        console.log(`Unknown command: '${command}'`);
        displayHelp();
    }

    // Only disconnect if it's not the delete command
    if (command !== 'delete') {
        await disconnectDB();
    }
}

runCliTool();