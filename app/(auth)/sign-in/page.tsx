"use client";
import React from "react";

import FormLogin from "../components/FormLogin";
import { signIn } from "next-auth/react";
import Image from "next/image";

const page = () => {
  return (
    <>
      <h1 className="text-header font-bold text-center mb-3">Login</h1>
      <FormLogin />

      <div className="flex justify-center items-center relative  w-full h-[1px] bg-gray-300 my-6">
        <div className="absolute bg-white px-4 ">
          <p>ATAU</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signIn("google")}
        className="flex justify-center items-center bg-transparant border border-black h-8 w-full rounded-lg px-4 font-bold "
      >
        <Image
          src={"/google-color-svgrepo.svg"}
          width={24}
          height={24}
          alt="google"
          className="mr-2 "
        ></Image>
        Lanjutkan Dengan Google
      </button>
    </>
  );
};

export default page;
