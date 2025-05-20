import connectMongo from "../../../util/connectMongo";
import PostModel from "../../../models/postModel";

await connectMongo();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  try {
    let postData;

    if (query) {
      postData = await PostModel.find({
        $or: [
          { title: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
        ],
      });
    } else {
      postData = await PostModel.find({});
    }

    return Response.json(postData);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, isPublic, userId } = body;

    if (!userId || !title || !description) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newPost = await PostModel.create({
      title,
      description,
      isPublic: isPublic ?? true,
      userId,
    });

    return Response.json(newPost);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
