const mongoose = require('mongoose');
require('dotenv').config();
const FoodListing = require('./models/FoodListing');

async function checkListings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const listings = await FoodListing.find({});
        console.log('Total Listings:', listings.length);
        listings.forEach(l => {
            console.log(`- ${l.foodName} | Target: ${l.targetAudience} | Status: ${l.status} | Expiry: ${l.expiryTime}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkListings();
