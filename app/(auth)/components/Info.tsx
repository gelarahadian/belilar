import Image from "next/image";
import React, { FC } from "react";

interface InfoProps {
  children: React.ReactNode;
}

const Info: FC<InfoProps> = ({ children }) => {
  return (
    <main className="flex items-center max-w-[1224px] mx-auto px-12 gap-6 h-screen ">
      <section className="w-7/12">
        <Image
          src={"/logo-large.png"}
          width={240}
          height={240}
          alt=""
          className="mx-auto mb-4"
        />
        <h1 className="text-header font-bold text-center mb-4">Belilar</h1>
        <h1 className="text-header font-bold text-center">
          Tempat Belanja Online No.1 Di Indonesia
        </h1>
      </section>
      <section className="w-5/12 bg-white shadow-form rounded-xl p-6">
        {children}
      </section>
    </main>
  );
};

export default Info;
