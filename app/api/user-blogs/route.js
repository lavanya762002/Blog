import connectMongo from "@/util/connectMongo";
import postModel from "../../../models/postModel";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  await connectMongo();
  const blogs = await postModel.find({ userId });
  return Response.json(blogs);
}
