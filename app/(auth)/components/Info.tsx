import Image from "next/image";
import React, { FC } from "react";

interface InfoProps {
  children: React.ReactNode;
}

const FEATURES = [
  { icon: "🛡️", label: "Secure & Trusted Transactions" },
  { icon: "🚀", label: "Fast Delivery Throughout Indonesia" },
  { icon: "💚", label: "More Than 10 Million Products" },
];

const Info: FC<InfoProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-700/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-secondary-400/10 blur-2xl" />
      </div>

      <main className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left: Branding */}
        <section className="flex-1 text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center ring-1 ring-white/20">
              <Image
                src="/logo-large.png"
                width={40}
                height={40}
                alt="Belilar Logo"
              />
            </div>
            <span className="text-3xl font-black tracking-tight ">Belilar</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-extrabold  leading-tight">
              Online Shopping
              <br />
              <span className="text-secondary-400">No.1</span> In The World
            </h1>
            <p className="text-primary-200 text-lg">
              Millions of products, best prices, shipping throughout the
              archipelago.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-primary-100"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Right: Auth Card */}
        <section className="w-full max-w-sm lg:w-96 bg-white rounded-2xl shadow-2xl p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Info;