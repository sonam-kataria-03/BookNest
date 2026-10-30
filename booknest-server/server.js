require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

for (const k of ['MONGO_URI', 'JWT_SECRET']) {
  if (!process.env[k]) { console.error(`Missing ${k} in .env`); process.exit(1); }
}

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, frameguard: false, contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, message: { message: 'Too many attempts. Try again in a few minutes.' } }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`BookNest API on http://localhost:${port}`));
});
