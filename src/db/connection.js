import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Database connection established`);
  } catch (error) {
    console.error(`Error occured while connecting`, error.message);
  }
};

export default connectDB;
