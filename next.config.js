console.log("✅ next.config.js loaded");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fcapzolnpfillsoiamdb.supabase.co",
        pathname: "/storage/v1/object/public/**",

      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "*.app.github.dev",
        "*.githubpreview.dev",

      ],
    },
  },
};

module.exports = nextConfig;