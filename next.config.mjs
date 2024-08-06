/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  env: {
    API: process.env.API,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    // AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_TAX_RATE: process.env.STRIPE_TAX_RATE,
    DOMAIN: process.env.DOMAIN,
    STRIPE_SHIPPING_RATE: process.env.STRIPE_SHIPPING_RATE,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
  webpack: (config) => {
    config.externals = [...config.externals, "bcrypt"];
    return config;
  },
};

export default nextConfig;
