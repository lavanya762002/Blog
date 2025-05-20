import connectMongo from "../../../util/connectMongo";
import User from "../../../models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();
  await connectMongo();

  const user = await User.findOne({ email });
  if (!user)
    return Response.json({ error: "User not found" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return Response.json({ error: "Invalid password" }, { status: 401 });

  // Return only safe user details
  return Response.json({
    username: user.username,
    email: user.email,
    _id: user._id,
  });
}
