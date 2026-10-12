const mongoose = require('mongoose');

const cleanUri = (uri) => {
  if (!uri) return '';
  let cleaned = uri.trim();
  // Strip accidental "MONGOURL=" or "MONGO_URI=" if someone copy-pasted it
  if (cleaned.startsWith('MONGOURL=')) {
    cleaned = cleaned.replace(/^MONGOURL=/, '').trim();
  } else if (cleaned.startsWith('MONGO_URI=')) {
    cleaned = cleaned.replace(/^MONGO_URI=/, '').trim();
  }
  // Strip trailing semicolon
  if (cleaned.endsWith(';')) {
    cleaned = cleaned.slice(0, -1).trim();
  }
  return cleaned;
};

const connectDB = async () => {
  const primaryUri = cleanUri(process.env.MONGO_URI);
  const fallbackUri = 'mongodb://127.0.0.1:27017/kaamwale';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (primaryError) {
      console.warn(`⚠️ Failed to connect to primary MongoDB URI (${primaryError.message})`);
      if (primaryUri.includes('127.0.0.1') || primaryUri.includes('localhost')) {
        console.error('❌ Local MongoDB is not reachable. Please ensure MongoDB is running.');
        process.exit(1);
      }
      console.log(`🔄 Attempting fallback to local MongoDB (${fallbackUri})...`);
    }
  }

  try {
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected (Local Fallback): ${conn.connection.host}`);
  } catch (fallbackError) {
    console.error(`❌ Could not connect to local fallback MongoDB: ${fallbackError.message}`);
    console.error('Tip: Make sure MongoDB is running locally (e.g., mongod --dbpath <data_dir>) or whitelist your IP on MongoDB Atlas.');
    process.exit(1);
  }
};

module.exports = connectDB;
