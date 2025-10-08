// src/models/user_data.js
import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

const UserData = mongoose.models.UserData || mongoose.model("UserData", UserDataSchema);

export default UserData;
