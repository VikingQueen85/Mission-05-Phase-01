
// Load environment variables from .env file in the parent directory
// This MUST be the very first line to ensure process.env variables are available
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline'); // For user input confirmation

// Load the Product model (ensure 'Product' is capitalized as per Product.js file)
const Product = require('../api/models/product');

// Get MONGO_URI and PORT from environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT; // Although PORT isn't used in seed_tool, it's good practice to load it

// Define the path to the seed data file
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
        console.error('MongoDB connection error:', err.message); // Log only the message for clarity
        process.exit(1); // Exit process if cannot connect to DB
    }
}

async function disconnectDB() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
}

async function seedData() {
    // connectDB is called inside run(), no need to call it here again
    try {
        const data = JSON.parse(fs.readFileSync(SEED_DATA_FILE, 'utf8'));

        if (data.length > 0) {
            // Optional: Clear existing data before seeding to prevent duplicates on successive seeds
            // console.log("Clearing existing data before seeding...");
            // await Product.deleteMany({});
            // console.log("Cleared existing data.");

            const result = await Product.insertMany(data);
            console.log(`Seeded ${result.length} documents into 'products' collection.`);
        } else {
            console.log('No data found in seed_data.json to insert.');
        }
    } catch (err) {
        console.error('Error seeding data:', err.message); // Log only the message for clarity
    }
}

async function deleteAllData() {
    // connectDB is called inside run(), no need to call it here again
    rl.question("Are you sure you want to delete ALL data from 'products' collection? (yes/no): ", async (answer) => {
        if (answer.toLowerCase() === 'yes') {
            try {
                const result = await Product.deleteMany({});
                console.log(`Deleted ${result.deletedCount} documents from 'products' collection.`);
            } catch (err) {
                console.error('Error deleting data:', err.message); // Log only the message for clarity
            } finally {
                rl.close();
                await disconnectDB(); // Disconnect here after user interaction
            }
        } else {
            console.log('Deletion cancelled.');
            rl.close();
            await disconnectDB(); // Disconnect here if cancelled
        }
    });
}

function displayHelp() {
    console.log("Usage: node server/cli/seed_tool.js [command]");
    console.log("\nCommands:");
    console.log("  seed      - Seed the database with sample data from seed_data.json.");
    console.log("  delete    - Delete all data from the 'products' collection.");
    console.log("  help      - Display this help message.");
    console.log("\nExample:");
    console.log("  node server/cli/seed_tool.js seed");
    console.log("  node server/cli/seed_tool.js delete");
}

// Main execution function
async function runCliTool() {
    const command = process.argv[2];

    // Connect to DB once at the start of the CLI tool's execution
    await connectDB();

    if (command === 'seed') {
        await seedData();
    } else if (command === 'delete') {
        // For delete, the disconnect is handled within the rl.question callback
        // so we don't disconnect immediately here.
        await deleteAllData();
        return; // Exit after deleteAllData is called
    } else if (command === 'help' || !command) {
        displayHelp();
    } else {
        console.log(`Unknown command: '${command}'`);
        displayHelp();
    }

    // Disconnect from DB if not handled by deleteAllData
    if (command !== 'delete') {
        await disconnectDB();
    }
}

runCliTool(); // Execute the CLI tool