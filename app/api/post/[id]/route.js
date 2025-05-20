import connectMongo from "../../../../util/connectMongo";
import PostModel from "../../../../models/postModel";

export async function GET(req, { params }) {
  try {
    await connectMongo();

    const post = await PostModel.findById(params.id);
    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
