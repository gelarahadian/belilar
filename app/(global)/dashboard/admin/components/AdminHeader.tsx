"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center px-6 h-14 bg-white border-b border-gray-100 flex-shrink-0">
      <div />
      <div className="flex items-center gap-2.5">
        <div className="text-right">
          <p className="text-xs font-bold text-gray-900">
            {session?.user?.name}
          </p>
          <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
            Admin
          </p>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <Image
            src={session?.user?.image ?? "/user.png"}
            alt={session?.user?.name ?? "Admin"}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </header>
  );
}
