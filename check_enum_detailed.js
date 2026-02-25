const User = require('./models/User');
console.log(JSON.stringify(User.schema.path('role').enumValues));
process.exit();
