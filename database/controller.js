/**controllers **/

import Users from "../model/user";

//get http://localhost:3000/api/users
export async function getUsers(req, res){
    try{
        const users = await Users.find({});
        if(!users) return res.status(404).json({error: "Data not found"});
        res.status(200).json(users);
        // res.status(200).json({user: "Get users"});

    }catch(error){
        res.status(404).json({error: "Error while fetching Data"});
    }
}

//get http://localhost:3000/api/users/1
export async function getUser(req, res){
    try{
        const {userId}  = req.query;
        const user = await Users.findById(userId);
        if(user){
            return res.status(200).json(user);
        }
        res.status(404).json({error: "User not selected .....!"});

    }catch(error){
        res.status(404).json({error: "Cannot get User........"});
    }
}

//post http://localhost:3000/api/users
export async function postUser(req, res) {
  try {
    const formData = req.body;

    if (!formData) {
      return res.status(404).json({ error: "Form data not provided" });
    }

    const user = await Users.create(formData);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
}

//put http://localhost:3000/api/users/1

export async function putUser(req, res){

    try{
      const {userId}   =  req.query;
      const formData = req.body;

      if(userId && formData){
        const user =await Users.findByIdAndUpdate(userId, formData);
        res.status(200).json(user);
      }

      res.status(404).json({error: "User not selected .....!"});

    }catch(error){

        res.status(404).json({error: "Error while updating Data ....!"});

    }
}

//delete  http://localhost:3000/api/users/1

export async function deleteUser(req, res){

    try{
        const {userId}  = req.query;

        if(userId){
            const user = await Users.findByIdAndDelete(userId);
            res.status(200).json(user);
            // res.status(200).json({"Deleted User": userId});
        }
        res.status(404).json({error: "User not selected .....!"});

    }catch(error){
        res.status(404).json({error: "Error while deleting user Data ....!"});

    }
}
