"use server";

import { signIn } from "./auth";

export const action = async (formData: FormData) => {
  try {
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (err: any) {
    if (typeof window !== "undefined") {
      console.log(`Error: ${err.code}`); // Pastikan ini dijalankan hanya di sisi klien
    }
  }
};
