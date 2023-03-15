/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME,
  },
};

module.exports = nextConfig;
