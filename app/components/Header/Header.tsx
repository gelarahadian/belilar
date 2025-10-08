"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import ProductSearchForm from "./ProductSearchForm";
import Cart from "./Cart";
import AuthButton from "./AuthButton";

const Header = () => {
  const { data: session, status } = useSession();
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <header className="sticky top-0 z-20 py-4 border-b bg-white ">
      <div className="flex justify-between items-center container space-x-6">
        <div className="flex items-center space-x-3">
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
          <Link href={"/shop"} className="text-[18px] hidden sm:block">
            Belanja
          </Link>
        </div>
        <ProductSearchForm />
        <div className="hidden sm:flex space-x-3 items-center">
          <Cart />
          {status === "authenticated" ? (
            <form action={handleLogout}>
              <button type="submit">signOut</button>
            </form>
          ) : (
            <>
              {status === "loading" ? (
                <div className="">Loading...</div>
              ) : (
                <AuthButton />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
