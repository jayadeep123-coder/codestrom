const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.get('http://localhost:5000/api/listings', {
            params: { targetAudience: 'student' }
        });
        console.log('API Results Count:', res.data.length);
        res.data.forEach(l => {
            console.log(`- ${l.foodName} | Target: ${l.targetAudience} | Price: ${l.price}`);
        });
    } catch (err) {
        console.error('API Error:', err.message);
    }
}

testApi();
