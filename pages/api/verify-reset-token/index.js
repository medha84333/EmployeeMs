import connectMongo from "../../../database/cons";
import { verifyResetToken } from "../../../database/resetPasswordController";

export default async function handler(req, res) {
  await connectMongo();
  return verifyResetToken(req, res);
}