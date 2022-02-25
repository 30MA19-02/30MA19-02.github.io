/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === "production"? 'noneuclidjs-docs/' : '',
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/examples/basic', dev: true },
      '/framework': { page: '/next' , dev: true },
    };
  },
  images: {
    loader: 'imgix',
    path: '',
  },
};

module.exports = nextConfig;
