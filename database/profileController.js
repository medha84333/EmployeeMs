import UserData from "../model/user_data";
import formidable from "formidable";
import path from "path";
import fs from "fs";

export const updateProfile = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, name, email, avatar } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user exists
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await UserData.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update user profile
    const updatedUser = await UserData.findByIdAndUpdate(
      id,
      {
        name,
        email,
        avatar: avatar || user.avatar,
      },
      { new: true }
    );

    return res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Configure formidable
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: function ({ name, originalFilename, mimetype }) {
        // Only allow image files
        return mimetype && mimetype.includes("image");
      },
    });

    const [fields, files] = await form.parse(req);
    
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;

    console.log('Upload avatar - received userId:', userId);
    console.log('Upload avatar - received file:', avatarFile?.originalFilename);

    if (!userId) {
      console.error('No userId provided');
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!avatarFile) {
      console.error('No avatar file provided');
      return res.status(400).json({ message: "No image file provided" });
    }

    // Check if user exists
    console.log('Looking for user with ID:', userId);
    const user = await UserData.findById(userId);
    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User found:', user.name);

    // Generate unique filename
    const fileExtension = path.extname(avatarFile.originalFilename || "");
    const fileName = `avatar_${userId}_${Date.now()}${fileExtension}`;
    const finalPath = path.join(uploadsDir, fileName);

    console.log('Moving file from:', avatarFile.filepath);
    console.log('Moving file to:', finalPath);

    // Move file to final location
    fs.renameSync(avatarFile.filepath, finalPath);

    // Create public URL
    const avatarUrl = `/uploads/avatars/${fileName}`;
    console.log('Generated avatar URL:', avatarUrl);

    // Update user's avatar in database
    const updatedUser = await UserData.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
    console.log('Updated user avatar in DB:', updatedUser.avatar);

    // Delete old avatar file if it exists and is not a URL
    if (user.avatar && user.avatar.startsWith("/uploads/")) {
      const oldAvatarPath = path.join(process.cwd(), "public", user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    return res.status(200).json({
      avatarUrl,
      message: "Avatar uploaded successfully",
    });

  } catch (error) {
    console.error("Avatar upload error:", error);
    return res.status(500).json({ 
      message: error.message || "Failed to upload avatar" 
    });
  }
};

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};