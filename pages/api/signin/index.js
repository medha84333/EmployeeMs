import connectMongo from "../../../database/cons";
import { signinUser} from  "../../../database/signinController";

export default async function handler(req, res) {
  await connectMongo();
  return signinUser(req, res);
}