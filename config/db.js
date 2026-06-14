import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedcoholic';
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds to try fallback quickly
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (primaryUri.startsWith('mongodb+srv')) {
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/wedcoholic', {
          serverSelectionTimeoutMS: 3000
        });
        console.log(`Fallback local MongoDB Connected successfully: ${localConn.connection.host}`);
      } catch (localErr) {
        console.error(`Fallback local MongoDB failed: ${localErr.message}`);
        console.warn('========================================================================');
        console.warn('CRITICAL WARNING: Database offline. No active local/cloud MongoDB connection.');
        console.warn('Please ensure a MongoDB service is running locally on port 27017.');
        console.warn('The application is running in mock/offline mode.');
        console.warn('========================================================================');
      }
    }
  }
};

export default connectDB;
