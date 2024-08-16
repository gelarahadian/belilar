"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import LoginRegisterButton from "./LoginRegisterButton";
import ProductSearchForm from "./ProductSearchForm";
import CartIcon from "./CartIcon";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session?.user);
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <header className="flex justify-between items-center sticky top-0 z-20 px-4 h-14 bg-primary border-b-2  ">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <section className="flex items-center overflow-hidden">
            <Image
              src={"/logo.png"}
              width={32}
              height={32}
              alt="logo belilar"
              className=" mr-3 flex-shrink-0"
            />
            <h1 className="text-lg font-bold text-nowrap">Belilar</h1>
          </section>
        </Link>
        <Link href={"/shop"} className="text-[18px]">
          Belanja
        </Link>
      </div>
      <ProductSearchForm />
      {status === "authenticated" ? (
        <div className="flex space-x-3">
          <CartIcon />
          <form action={handleLogout}>
            <button type="submit">signOut</button>
          </form>
        </div>
      ) : (
        <>
          {status === "loading" ? (
            <div className="">Loading...</div>
          ) : (
            <LoginRegisterButton />
          )}
        </>
      )}
    </header>
  );
};

export default Header;
