const axios = require('axios');

/**
 * Geocode an address using OpenStreetMap's Nominatim API.
 * @param {string} address - The physical address to geocode.
 * @returns {Promise<number[]|null>} - A promise that resolves to [longitude, latitude] or null if not found.
 */
const geocodeAddress = async (address) => {
    try {
        if (!address) return null;

        const performGeocode = async (queryStr) => {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: queryStr,
                    format: 'json',
                    limit: 1
                },
                headers: {
                    'User-Agent': 'FoodBridge-App (contact@foodbridge.example.com)'
                }
            });

            if (response.data && response.data.length > 0) {
                const { lon, lat } = response.data[0];
                return [parseFloat(lon), parseFloat(lat)];
            }
            return null;
        };

        // Try full address first
        let coords = await performGeocode(address);
        if (coords) return coords;

        // If full address fails, try falling back by progressively removing the most specific parts
        // Split by commas and trim
        const parts = address.split(',').map(p => p.trim()).filter(Boolean);

        while (parts.length > 1) {
            parts.shift(); // Remove the first (most specific) part
            const fallbackAddress = parts.join(', ');
            coords = await performGeocode(fallbackAddress);
            if (coords) return coords;
            // Add a small delay to respect Nominatim rate limits (absolute max 1 req/sec)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null;
    }
};

module.exports = { geocodeAddress };
