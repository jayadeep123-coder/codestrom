console.log('User model path:', require.resolve('./models/User'));
const User = require('./models/User');
console.log('Enum:', JSON.stringify(User.schema.path('role').enumValues));
process.exit();
