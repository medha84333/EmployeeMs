import connectMongo from "../../../database/cons";
import { updateProfile } from "../../../database/profileController";

export default async function handler(req, res) {
  await connectMongo();
  return updateProfile(req, res);
}