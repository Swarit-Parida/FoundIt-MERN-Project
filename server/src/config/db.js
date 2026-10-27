import mongoose from 'mongoose';
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing. Copy server/.env.example to server/.env and configure it.');
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
