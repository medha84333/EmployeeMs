import {Schema,models, model} from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    department: String,
    position: String,
    status: String,
    date: String,
})

const Users = models.user || model('user', userSchema);

export default Users;

