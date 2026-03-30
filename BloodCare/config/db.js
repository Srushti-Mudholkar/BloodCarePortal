import mongoose from "mongoose";

export const connctDB = async () => {
  try {
   await mongoose.connect(process.env.MONGO_URL)
   console.log(`Connected to Mongodb Database ${mongoose.connection.host}`);
  } catch (e) {
    console.log(`Mongodb database Error ${e} `);
  }
}



