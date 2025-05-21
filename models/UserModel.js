import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  is_Admin:{type: Boolean, default: false},
  role:{type: String, default: "user"}
});

export default mongoose.models.User || mongoose.model("User", userSchema);
