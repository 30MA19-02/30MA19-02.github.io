/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: '.',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/examples',
        permanent: true,
      },
      {
        source: '/examples',
        destination: '/examples/basic',
        permanent: true,
      },
    ];
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/examples/basic' },
      '/framework': { page: '/next' },
    };
  },
  images: {
    loader: 'imgix',
    path: '',
  },
};

module.exports = nextConfig;
