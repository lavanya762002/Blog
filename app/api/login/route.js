import connectMongo from "../../../util/connectMongo";
import User from "../../../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();
  await connectMongo();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const tokenData = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  // create JWT token
  const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
    expiresIn: "30m",
  });

  // prepare response with cookie
  const response = NextResponse.json(
    { message: "Login Successful", success: true },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/", // cookie available site-wide
    // secure: true, // enable this in production with HTTPS
    maxAge: 30 * 60, // 30 minutes in seconds (optional)
    sameSite: "strict", // protect against CSRF
  });

  return response;
}
