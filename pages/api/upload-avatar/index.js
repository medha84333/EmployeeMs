import connectMongo from "../../../database/cons";
import { uploadAvatar } from "../../../database/profileController";

export default async function handler(req, res) {
  await connectMongo();
  return uploadAvatar(req, res);
}

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};