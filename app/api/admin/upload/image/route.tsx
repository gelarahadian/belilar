import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request, res: Response) {
  const { image } = await req.json();

  try {
    const res = cloudinary.uploader.upload(image);

    const data = await res;

    return Response.json(
      { public_id: data.public_id, secure_url: data.secure_url },
      { status: 200 },
    );
  } catch (e: any) {
    console.error(e);
    return Response.json(e.message, { status: 500 });
  }
}

export async function DELETE(req: Request, res: Response) {
  const { public_id } = await req.json();

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return Response.json({ success: result });
  } catch (err) {
    console.log(err);
  }
}
