"use client";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import React from "react";

const AuthButton = () => {
  const router = useRouter();
  return (
    <>
      <Button
        variant="border"
        onClick={() => router.push("/sign-up")}
        className="border-secondary text-secondary hover:bg-secondary "
      >
        Daftar
      </Button>
      <Button type="button" onClick={() => router.push("/sign-in")}>
        Masuk
      </Button>
    </>
  );
};

export default AuthButton;
