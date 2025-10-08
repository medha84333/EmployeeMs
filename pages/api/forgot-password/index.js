import connectMongo from "../../../database/cons";
import { forgotPassword } from "../../../database/forgotPasswordController";

export default async function handler(req, res) {
  await connectMongo();
  return forgotPassword(req, res);
}