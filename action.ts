"use server";

import { signIn } from "./auth";

export const login = async (formData: FormData) => {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (err: any) {
    // if (typeof window !== "undefined") {
    console.log(`Error: ${err.code}`);
    return err.code;
    // }
  }
};
