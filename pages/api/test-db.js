// import { connectToDatabase } from "@/lib/mongodb";

// export default async function handler(req, res) {
//   try {
//     await connectToDatabase();
//     res.status(200).json({ message: "MongoDB connection successful!" });
//   } catch (error) {
//     res.status(500).json({ message: "MongoDB connection failed", error: error.message });
//   }
// }

import connectMongo  from "../../database/cons";

export default  function handler(req, res){
  connectMongo()
  res.status(200).json({name: "Hello from register route"});

}