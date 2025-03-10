/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/hack00-8f393.firebasestorage.app/posts/**',
      },
    ],
  },
};

module.exports = nextConfig;