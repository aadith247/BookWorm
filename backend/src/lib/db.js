import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
      throw new Error("MONGO_URI is not set. Add it to backend/.env");
    }

    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MONGO_URI. It must start with mongodb:// or mongodb+srv://");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`Database connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); // exit with failure
  }
};
