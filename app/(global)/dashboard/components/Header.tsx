"use client";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="flex justify-end items-center px-4 h-14 border-b-2 ">
      <div className="flex items-center space-x-3">
        {/* <p className="text-body">{session?.user.name}</p>
        <Image
          src={session?.user.image || "/user.png"}
          alt={session?.user?.name || ""}
          height={36}
          width={36}
        /> */}
      </div>
    </header>
  );
};

export default Header;
