const mongoose = require('mongoose');
require('dotenv').config();
const FoodListing = require('./models/FoodListing');

async function finalCheck() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const l = await FoodListing.findOne({ foodName: /idly/i });
        if (l) {
            console.log('IDLY DETAILS:');
            console.log('Target:', l.targetAudience);
            console.log('Status:', l.status);
            console.log('Price:', l.price);
            console.log('IsDiscounted:', l.isDiscounted);
            console.log('Location:', JSON.stringify(l.location));
        } else {
            console.log('IDLY NOT FOUND');
        }
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
finalCheck();
