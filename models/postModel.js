// models/postModel.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  isPublic: { type: Boolean, default: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
