"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

async function onRegister(name: string, email: string, password: string) {
  const res = await fetch(`${process.env.API}register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });

  return res;
}

const page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const testSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    setLoading(true);

    const name = data.firstName + " " + data.lastName;

    const res = await onRegister(name, data.email, data.password);
    if (!res.ok) {
      toast.error("Gagal Mendaftar");
      setLoading(false);
      return;
    }

    toast.success("Berhasil Mendaftar");
    router.push("/login");

    setLoading(false);
    return;
  };
  return (
    <>
      <h1 className="text-header font-bold text-center mb-3">Daftar</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-end gap-4">
          <Input
            label="Nama: "
            id="firstName"
            placeholder="Nama Awal"
            required={"Nama Awal Harus Diisi"}
            register={register}
            errors={errors}
          />
          <Input
            id="lastName"
            placeholder="Nama Akhir"
            register={register}
            errors={errors}
          />
        </div>
        <Input
          label="Email"
          id="email"
          placeholder="Contoh: user@gmail.com"
          required="Email Harus Diisi"
          pattern={{
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email Tidak Valid",
          }}
          register={register}
          errors={errors}
        />
        <Input
          label="Password"
          id="password"
          placeholder="Contoh: IniUser123"
          required="Password Harus Diisi"
          pattern={{
            value: /^(?=.*[A-Z]).{8,}$/,
            message:
              "Password harus mengandung setidaknya satu huruf besar dan memiliki panjang minimal 8 karakter",
          }}
          register={register}
          errors={errors}
        />
        <div className="mb-3 flex items-center">
          <input id="remember-me" type="checkbox" className="mr-2 " />
          <label htmlFor="remember-me" className="text-secondaryText">
            Remember Me
          </label>
        </div>

        <Button className="w-full" type="submit">
          Daftar
        </Button>
        <p className="text-center text-secondaryText">
          Sudah Punya Akun?{" "}
          <Link href={"/login"} className="text-secondary underline">
            Login
          </Link>
        </p>
      </form>

      <div className="flex justify-center items-center relative  w-full h-[1px] bg-gray-300 my-6">
        <div className="absolute bg-white px-4 ">
          <p>ATAU</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signIn("google")}
        className="flex justify-center items-center bg-transparant border border-black h-8 w-full rounded-lg px-4  "
      >
        <Image
          src={"/google-color-svgrepo.svg"}
          width={16}
          height={16}
          alt="google"
          className="mr-2 "
        ></Image>
        Lanjutkan Dengan Google
      </button>
    </>
  );
};

export default page;
