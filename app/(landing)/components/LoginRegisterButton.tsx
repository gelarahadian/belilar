"use client";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import React from "react";

const LoginRegisterButton = () => {
  const router = useRouter();
  return (
    <div className="space-x-3">
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
    </div>
  );
};

export default LoginRegisterButton;
