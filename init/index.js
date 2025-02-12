const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config();

// Using the same database name as in .env
main()
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/roomtara";
    
    await mongoose.connect(MONGODB_URI);
}

const initDB = async () => {
    try {
        console.log("Deleting existing data..."); // Added logging
        await Listing.deleteMany({});
        console.log("Inserting sample data...");   // Added logging
        await Listing.insertMany(initData);
        console.log("Successfully added sample data to database");
    } catch (err) {
        console.log("Error in database initialization:");
        console.log(err);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed."); // Added logging
    }
};

initDB();