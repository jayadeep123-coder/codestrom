const mongoose = require('mongoose');
require('dotenv').config();
const FoodListing = require('./models/FoodListing');
const User = require('./models/User');

async function createStudentDeal() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const provider = await User.findOne({ role: 'provider' });
        const student = await User.findOne({ name: 'satya sivani' });

        if (!provider) {
            console.log('No provider found to create listing');
            process.exit(1);
        }

        const now = new Date();
        const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        const listing = new FoodListing({
            providerId: provider._id,
            foodName: "Hot Samosas (Fresh Batch)",
            category: "cooked",
            quantity: 10,
            unit: "portions",
            pickupTime: now,
            expiryTime: expiry,
            targetAudience: "student",
            price: 20,
            originalPrice: 50,
            isDiscounted: true,
            status: "available",
            description: "Freshly made crispy samosas for students!",
            location: student ? student.location : provider.location
        });

        await listing.save();
        console.log('Created Student Deal:', listing.foodName);
        console.log('Target:', listing.targetAudience);
        console.log('Status:', listing.status);
        console.log('Location:', JSON.stringify(listing.location));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createStudentDeal();
