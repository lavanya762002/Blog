// /app/api/register/route.js
import connectMongo from "../../../util/connectMongo";
import User from "../../../models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { username, email, password } = await req.json();
  await connectMongo();

  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return Response.json({ message: "User registered" });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}

