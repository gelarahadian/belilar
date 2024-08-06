import { signIn } from "@/auth";
import React from "react";

const page = async () => {
  const handleAction = async () => {
    "use server";
    await signIn("credentials", {
      email: "andi@gmail.com",
      password: "IniAndiGunawan",
    });
  };

  return (
    <div>
      <form action={handleAction}>
        <button type="submit">signIn</button>
      </form>
    </div>
  );
};

export default page;
