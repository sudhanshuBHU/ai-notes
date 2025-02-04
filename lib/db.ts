import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    // console.log(mongoUri);
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }
    await mongoose.connect(mongoUri,{
        ssl: true,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    // console.log("error");
    console.log(error);
  }
};

export default connectMongoDB;
