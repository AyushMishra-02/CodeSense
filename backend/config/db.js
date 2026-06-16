const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB at ${process.env.MONGO_URI}`);
    console.log('📦 Starting in-memory MongoDB server...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('   ⚠️ Data will not persist after server restart');
    } catch (memError) {
      console.error(`❌ Failed to start in-memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
