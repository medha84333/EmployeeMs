// src/controllers/signupController.js
import UserData from "../model/user_data";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { name, email, password } = req.body;

    const existingUser = await UserData.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

    const user_data = await UserData.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    return res.status(201).json({
      id: user_data._id,
      name: user_data.name,
      email: user_data.email,
      avatar: user_data.avatar,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
