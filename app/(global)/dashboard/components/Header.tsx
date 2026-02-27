"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-end items-center px-6 h-14 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold text-gray-700">
          {session?.user?.name}
        </span>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <Image
            src={session?.user?.image ?? "/user.png"}
            alt={session?.user?.name ?? "User"}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </header>
  );
}
