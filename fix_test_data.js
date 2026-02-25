const mongoose = require('mongoose');
require('dotenv').config();
const FoodListing = require('./models/FoodListing');
const User = require('./models/User');

async function fixData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({ name: 'satya sivani' });
        if (user && user.location) {
            const res = await FoodListing.updateMany(
                { targetAudience: { $in: ['student', 'all'] } },
                { $set: { location: user.location } }
            );
            console.log('Updated listings location to match user:', res.modifiedCount);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixData();
