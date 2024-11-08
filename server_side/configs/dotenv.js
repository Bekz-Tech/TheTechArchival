const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  FIREBASE_ADMIN_SDK_PRIVAT_KEY: process.env.FIREBASE_ADMIN_SDK_PRIVAT_KEY,
  FIREBASE_ADMIN_SDK_PRIVAT_KEY_ID: process.env.FIREBASE_ADMIN_SDK_PRIVAT_KEY_ID,
  JWT_REFRESH_SECRET: process.env.WT_REFRESH_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET
};

