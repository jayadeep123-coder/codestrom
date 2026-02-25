const mongoose = require('mongoose');
require('dotenv').config();
const FoodListing = require('./models/FoodListing');
const User = require('./models/User');

async function checkProximity() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({ name: 'satya sivani' });
        const listing = await FoodListing.findOne({ foodName: /idly/i });

        if (user) {
            console.log('User Location:', JSON.stringify(user.location));
        } else {
            console.log('User satya sivani not found');
        }

        if (listing) {
            console.log('Listing Location:', JSON.stringify(listing.location));
            console.log('Listing Target:', listing.targetAudience);
            console.log('Listing Status:', listing.status);
            console.log('Listing Expiry:', listing.expiryTime);
        } else {
            console.log('Listing idly not found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkProximity();
