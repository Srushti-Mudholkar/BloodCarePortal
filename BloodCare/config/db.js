import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`MongoDB Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};
