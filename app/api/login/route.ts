import { signIn } from "@/auth";

export async function POST(req: Request, res: Response) {
  const { email, password } = await req.json();

  try {
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  } catch (err) {
    console.log(err);
  }

  return Response.json({ email, password });
}
