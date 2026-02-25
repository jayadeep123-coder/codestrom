const ImpactStats = require('../models/ImpactStats');
const FoodListing = require('../models/FoodListing');
const User = require('../models/User');
const Request = require('../models/Request');

exports.getStats = async (req, res) => {
    try {
        const stats = await ImpactStats.find().sort({ date: -1 }).limit(30);

        // Calculate current live stats
        const totalProviders = await User.countDocuments({ role: 'provider' });
        const totalNGOs = await User.countDocuments({ role: 'ngo' });
        const activeListings = await FoodListing.countDocuments({ status: 'available' });

        // Calculate dynamic impact metrics from Requests
        const impactAggregation = await Request.aggregate([
            { $match: { status: { $in: ['approved', 'completed'] } } },
            { $group: { _id: null, totalQuantity: { $sum: '$requestedQuantity' } } }
        ]);

        const totalFoodSaved = impactAggregation.length > 0 ? impactAggregation[0].totalQuantity : 0;
        const totalMealsServed = Math.floor(totalFoodSaved / 0.5); // Approx 0.5kg per meal
        const co2Avoided = +(totalFoodSaved * 2.5 / 1000).toFixed(2); // Tons

        // Compute 7-day trend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendAggregation = await Request.aggregate([
            {
                $match: {
                    status: { $in: ['approved', 'completed'] },
                    updatedAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    kg: { $sum: '$requestedQuantity' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map aggregated trend to a consistent 7-day array
        const trendMap = {};
        trendAggregation.forEach(day => {
            trendMap[day._id] = day.kg;
        });

        const trend = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = days[d.getDay()];
            trend.push({ name: dayName, kg: trendMap[dateStr] || 0 });
        }

        res.json({
            history: stats,
            trend: trend,
            current: {
                totalProviders,
                totalNGOs,
                activeListings,
                totalFoodSaved,
                totalMealsServed,
                co2Avoided
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Fetching stats failed', error: error.message });
    }
};
