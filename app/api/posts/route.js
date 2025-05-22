import connectMongo from "../../../util/connectMongo";
import PostModel from "../../../models/postModel";
 
export async function GET(req) {
  await connectMongo();
 
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
 
  try {
    let posts;
    if (query) {
      posts = await PostModel.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      posts = await PostModel.find({});
    }
 
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
 


export async function POST(req) {
  console.log(req);
  await connectMongo();
 
  try {
    const body = await req.json();
    const { title, description, isPublic, userId, image } = body;
 
    if (!title || !description || !userId) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
 
    const newPost = await PostModel.create({
      title,
      description,
      isPublic: isPublic ?? true,
      userId,
      image,
    });

    console.log(newPost);
 
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
 