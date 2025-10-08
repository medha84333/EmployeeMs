import connectMongo from "../../../database/cons";
import { resetPassword } from "../../../database/resetPasswordController";

export default async function handler(req, res) {
  await connectMongo();
  return resetPassword(req, res);
}