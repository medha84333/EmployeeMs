// src/pages/api/auth/register.js
import connectMongo from "../../../database/cons";
import { signupUser } from "../../../database/signupController";

export default async function handler(req, res) {
  await connectMongo(); // Connect to MongoDB
  return signupUser(req, res);
}
