"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { FaHashtag } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import {
  RiExpandLeftLine,
  RiExpandRightLine,
  RiLogoutBoxFill,
} from "react-icons/ri";

interface UserSidebarProps {
  children: React.ReactNode;
}

const UserSidebar: FC<UserSidebarProps> = ({ children }) => {
  const [expandSidebar, setExpandSidebar] = useState(true);

  const navs = [
    {
      name: "Dashboard",
      icon: <MdCategory />,
      url: "/dashboard/user",
    },
    {
      name: "Order",
      icon: <FaHashtag />,
      url: "/dashboard/user/orders",
    },
  ];

  return (
    <div
      className={`relative w-full h-screen transition-all duration-500  ${
        expandSidebar ? "pl-72 ease-in" : "pl-14 ease-out"
      }`}
    >
      <aside
        className={`flex flex-col fixed left-0 h-full  shadow-sidebar p-3 transition-all duration-500 bg-primary  ${
          expandSidebar ? "w-72 ease-in" : "w-14 ease-out"
        }`}
      >
        <header className="flex items-center justify-between relative mb-3 ">
          <section className="flex items-center overflow-hidden">
            <Image
              src={"/logo.png"}
              width={32}
              height={32}
              alt="logo belilar"
              className=" mr-3 flex-shrink-0"
            />
            <h1 className="text-[24px] font-bold text-nowrap">Belilar</h1>
          </section>
          <button
            className={`absolute right-0 transition-all duration-300 delay-300  ${
              expandSidebar
                ? "translate-x-0 ease-out"
                : "translate-x-10 ease-in"
            }`}
            onClick={() => setExpandSidebar(!expandSidebar)}
          >
            {expandSidebar ? <RiExpandLeftLine /> : <RiExpandRightLine />}
          </button>
        </header>

        <nav className="flex-1 flex flex-col justify-between">
          <ul className="space-y-3">
            {navs.map((nav) => (
              <li key={nav.name} className="group">
                <Link
                  href={nav.url}
                  className="flex items-center h-8 px-2 bg-lightGrey group-hover:bg-secondary overflow-hidden group-hover:text-primary rounded transition-all duration-200 ease-in"
                >
                  <div className="text-base mr-4">{nav.icon}</div>
                  <p className="font-medium text-nowrap">{nav.name}</p>
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="flex items-center h-8 px-2 bg-lightGrey w-full rounded overflow-hidden"
            onClick={() => signOut()}
          >
            <div className="text-base mr-4">
              <RiLogoutBoxFill className="" />
            </div>

            <p className={`font-medium text-nowrap`}>Keluar</p>
          </button>
        </nav>
      </aside>
      {children}
    </div>
  );
};

export default UserSidebar;
