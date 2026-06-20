/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    qualities: [100, 75],
    remotePatterns: [
      // imgur
      new URL("https://i.imgur.com"),
      // instagram, through TBA
      new URL("https://www.thebluealliance.com"),
    ],
  },
  env: {
    PROD: process.env.PROD || "false",
  },
};

module.exports = nextConfig;
