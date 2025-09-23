"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEventHandler, FC, useState } from "react";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";

interface FormLoginProps {}

const FormLogin: FC<FormLoginProps> = () => {
  const [loading, setLoading] = useState(false);
  const [typePassword, setTypePassword] = useState("password");

  const router = useRouter();

  const handleAction = async (formData: FormData) => {
    flushSync(() => setLoading(true));
    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    console.log(res);
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        toast.error("Email atau Password Salah");
        setLoading(false);
      }
      return;
    }
    toast.success("Login Success");
    router.push("/");
    setLoading(false);
  };

  const handleShowPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("is checked ====> ", e.target.checked);
    if (e.target.checked === true) {
      setTypePassword("text");
    } else {
      setTypePassword("password");
    }
  };

  return (
    <form action={handleAction}>
      <Input label="Email" id="email" placeholder="Contoh: user@gmail.com" />
      <Input
        label="Password"
        id="password"
        placeholder="Contoh: IniUser123"
        type={typePassword}
      />
      <input type="checkbox" id="show-password" onChange={handleShowPassword} />
      <label htmlFor="show-password" className="text-secondaryText ml-2">
        Show Password
      </label>
      <div className="flex justify-between items-center mb-3">
        <div className="mb-4 flex items-center">
          <input id="remember-me" type="checkbox" className="mr-2 " />
          <label htmlFor="remember-me" className="text-secondaryText">
            Remember Me
          </label>
        </div>
        <Link
          href={"/forgot-password"}
          className="text-secondary text-secondaryText"
        >
          Forgot Password?
        </Link>
      </div>

      <Button className="w-full" type="submit">
        {loading ? "Loading..." : "Masuk"}
      </Button>
      <p className="text-center text-secondaryText">
        Belum Punya Akun?{" "}
        <Link href={"/sign-up"} className="text-secondary underline">
          Daftar
        </Link>
      </p>
    </form>
  );
};

export default FormLogin;