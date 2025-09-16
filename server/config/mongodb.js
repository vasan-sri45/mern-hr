// db/connectDB.js
import mongoose from 'mongoose';

let isListenerAttached = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set');
    process.exit(1);
  }

  try {
    // Attach listeners only once
    if (!isListenerAttached) {
      mongoose.connection.on('connected', () => console.log('MongoDB connected'));
      mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err.message));
      mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
      isListenerAttached = true;

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed on app termination (SIGINT)');
        process.exit(0);
      });
      process.on('SIGTERM', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed on app termination (SIGTERM)');
        process.exit(0);
      });
    }

    // Mongoose 6/7/8: no need for deprecated options like useNewUrlParser/useUnifiedTopology
    await mongoose.connect(uri);

    // Optional: await initial connection readiness
    // await mongoose.connection.asPromise();

    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB initial connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
