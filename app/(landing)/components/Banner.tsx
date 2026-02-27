"use client";

import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "10M+", label: "Products" },
  { value: "2M+", label: "Customers" },
  { value: "99%", label: "Satisfaction" },
];

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl mt-6 bg-primary-950 min-h-[420px] flex items-center text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/banner.svg"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/40 via-primary-900/40 to-primary-400/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800 via-transparent to-transparent" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-8 right-[30%] w-72 h-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-[10%] w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 py-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-xs font-semibold tracking-widest uppercase">
              Flash Sale Today
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Shopping Online
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary">
                No.1 In The World
              </span>
            </h1>
            <p className="text-primary-300 text-base max-w-md mx-auto lg:mx-0">
              Millions of products, best prices, shipping throughout the
              archipelago.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              href="/product"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-secondary/30 hover:-translate-y-0.5"
            >
              Shop Now
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/product?promo=true"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 backdrop-blur"
            >
              See Promo
            </Link>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex lg:flex-col gap-4 lg:gap-3">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex-1 lg:flex-none bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-6 py-4 text-center lg:text-left min-w-[100px]"
            >
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-primary-400 text-xs font-medium mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
