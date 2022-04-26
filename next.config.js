/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/noneuclidjs-docs' : '',
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/noneuclidjs-docs' : '',
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      ...defaultPathMap,
    };
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  images: {
    loader: 'imgix',
    path: '',
  },
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three$: path.resolve('./utils/three.ts'),
    };
    return config;
  },
};

const withTM = require('next-transpile-modules')(['three']);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(withTM(nextConfig));
