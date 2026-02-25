const mongoose = require('mongoose');
const User = require('./models/User');
const FoodListing = require('./models/FoodListing');
const { geocodeAddress } = require('./utils/geocoder');
require('dotenv').config();

async function fixLocations() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodbridge');

    const users = await User.find({
        'location.coordinates.0': 0,
        'location.coordinates.1': 0
    });

    console.log(`Found ${users.length} users with [0,0] location.`);

    for (const user of users) {
        if (user.address) {
            console.log(`Geocoding for user ${user.name}: ${user.address}`);
            const coords = await geocodeAddress(user.address);
            if (coords) {
                user.location.coordinates = coords;
                await user.save();
                console.log(`Updated user ${user.name} to coords: ${coords}`);

                // Update listings
                await FoodListing.updateMany(
                    { providerId: user._id, status: 'available', expiryTime: { $gt: new Date() } },
                    { $set: { location: user.location } }
                );
                console.log(`Updated listings for ${user.name}`);
            } else {
                console.log(`Failed to geocode for ${user.name}`);
            }
        }
    }

    mongoose.disconnect();
}

fixLocations().catch(console.error);
