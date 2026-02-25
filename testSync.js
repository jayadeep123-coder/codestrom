const mongoose = require('mongoose');
const User = require('./models/User');
const FoodListing = require('./models/FoodListing');
require('dotenv').config();

async function testSync() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodbridge');

    // 1. Create a dummy provider user
    const provider = new User({
        name: 'Test Provider',
        email: 'test@provider.test',
        password: 'password',
        role: 'provider',
        phone: '123456',
        address: 'Old Address, City',
        location: { type: 'Point', coordinates: [0, 0] }
    });
    await provider.save();
    console.log('Provider created with location:', provider.location.coordinates);

    // 2. Create a dummy food listing
    const listing = new FoodListing({
        providerId: provider._id,
        foodName: 'Test Food',
        category: 'cooked',
        quantity: 10,
        unit: 'kg',
        pickupTime: new Date(Date.now() + 86400000), // Tomorrow
        expiryTime: new Date(Date.now() + 86400000 * 2),
        location: provider.location
    });
    await listing.save();
    console.log('Listing created with location:', listing.location.coordinates);

    // 3. Simulate Profile Update (Auth Controller Logic)
    console.log('--- Simulating Profile Update ---');
    provider.address = 'New Address, City';
    provider.location = { type: 'Point', coordinates: [10, 10] }; // Simulated new geocode

    await FoodListing.updateMany(
        { providerId: provider._id, status: 'available', expiryTime: { $gt: new Date() } },
        { $set: { location: provider.location } }
    );
    await provider.save();

    // 4. Verify
    const updatedListing = await FoodListing.findById(listing._id);
    console.log('Provider new location:', provider.location.coordinates);
    console.log('Listing new location:', updatedListing.location.coordinates);

    if (updatedListing.location.coordinates[0] === 10 && updatedListing.location.coordinates[1] === 10) {
        console.log('SUCCESS: Location synced to listing!');
    } else {
        console.log('FAILED: Location not synced!');
    }

    // Cleanup
    await User.findByIdAndDelete(provider._id);
    await FoodListing.findByIdAndDelete(listing._id);
    mongoose.disconnect();
}
testSync().catch(console.error);
