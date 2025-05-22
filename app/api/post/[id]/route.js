import connectMongo from "../../../../util/connectMongo";
import PostModel from "../../../../models/postModel";
 
 
export async function GET(request, context) {
  await connectMongo();
 
  const { id } = await context.params; // no await here
 
  const post = await PostModel.findById(id);
 
  if (!post) {
    return new Response(
      JSON.stringify({ message: "Post not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
 
  return new Response(
    JSON.stringify(post),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
 
export async function PUT(request, context) {
  await connectMongo();
 
  const { id } = context.params;
 
  const body = await request.json();
 
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(id, body, {
      new: true,
    });
 
    if (!updatedPost) {
      return new Response(
        JSON.stringify({ message: "Post not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
 
    return new Response(
      JSON.stringify(updatedPost),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "Failed to update post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
 
export async function DELETE(request, context) {
  await connectMongo();
 
  const { id } = context.params;
 
  try {
    const deletedPost = await PostModel.findByIdAndDelete(id);
 
    if (!deletedPost) {
      return new Response(
        JSON.stringify({ message: "Post not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
 
    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "Failed to delete post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
 