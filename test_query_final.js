const mongoose = require('mongoose');
require('dotenv').config();
const FoodListing = require('./models/FoodListing');

async function testQuery() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Exact query from controller with 5000km radius
        const lat = 17.385;
        const lng = 78.4867;
        const radius = 5000000;

        const query = {
            status: 'available',
            targetAudience: { $in: ['student', 'all'] },
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lng, lat] },
                    $maxDistance: radius
                }
            }
        };

        const results = await FoodListing.find(query);
        console.log('Query Results (5000km):', results.length);

        const allResults = await FoodListing.find({
            status: 'available',
            targetAudience: { $in: ['student', 'all'] }
        });
        console.log('All Student/All Listings (No Radius):', allResults.length);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testQuery();
