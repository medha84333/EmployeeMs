import { promises } from "dns"

// const MONGODB_URI = "mongodb+srv://admin:admin123@nextjscrud.9agq7xj.mongodb.net/?retryWrites=true&w=majority&appName=NextjsCRUD";
// import mongoose from "mongoose";

// const  connectMongo = async () => {
//     try{
//        const {connection} = await mongoose.connect(process.env.MONGODB_URI);

//        if(connection.readyState == 1){
//         console.log("MongoDB is connected");
//        }

//     }catch(error){
//      return Promise.reject(error);
//     }

    
// }

// export default connectMongo;

import mongoose from "mongoose";

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("✅ Mongo already connected");
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw new Error("MongoDB connection failed");
  }
};

export default connectMongo;
