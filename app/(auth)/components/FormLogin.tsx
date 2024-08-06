import { action } from "@/action";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import React, { FC } from "react";

interface FormLoginProps {}

const FormLogin: FC<FormLoginProps> = async () => {
  // const [state, formAction] = useActionState(action, null);
  const session = await auth();

  return (
    <form action={action}>
      <Input label="Email" id="email" placeholder="Contoh: user@gmail.com" />
      <Input
        label="Password"
        id="password"
        placeholder="Contoh: IniUser123"
        type="password"
      />
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
        Masuk
      </Button>
      <p className="text-center text-secondaryText">
        Belum Punya Akun?{" "}
        <Link href={"/register"} className="text-secondary underline">
          Daftar
        </Link>
      </p>
      <pre>{JSON.stringify(session, null, 4)}</pre>
    </form>
  );
};

export default FormLogin;
