
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = (process.env.ADMIN_EMAIL || 'admin@booknest.com').toLowerCase();
  if (!(await User.exists({ email }))) {
    await User.create({ name: process.env.ADMIN_NAME || 'Admin', email, password: process.env.ADMIN_PASSWORD || 'admin123', role: 'admin' });
    console.log('Admin created:', email);
  } else console.log('Admin already exists:', email);
  for (const name of ['Fiction', 'Education', 'Technology', 'Science', 'Romance', 'Biography', 'Self-Help']) {
    await Category.updateOne({ name }, { $setOnInsert: { name, description: `${name} books` } }, { upsert: true });
  }
  console.log('Categories ready');
  await mongoose.disconnect();
})();
