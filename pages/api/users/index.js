import connectMongo from "../../../database/cons";
import { getUsers, postUser, putUser, deleteUser} from  "../../../database/controller";

export default async function handler(req, res){
   connectMongo().catch(()=> res.status(405).json({error: "Error in the connection"}));

  // type of request
  // GET, POST, PUT, DELETE
  const { method } = req;
  switch (method) {
    case "GET":
    //    res.status(200).json({method,name: "Hello from get users"});
       getUsers(req, res);
       break;
    case "POST":
    //    res.status(200).json({method,name: "Hello from post users"});
         postUser(req, res);
       break;
    case "PUT":
    //    res.status(200).json({method,name: "Hello from put users"});
        putUser(req, res);
       break;
    case "DELETE":
    //    res.status(200).json({method,name: "Hello from delete users"});
       deleteUser(req, res);
       break;
    default: res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);  
        res.status(405).end(`Method ${method} Not Allowed`); 
        break;
  }

}