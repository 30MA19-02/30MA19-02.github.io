/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  basePath: '/',
  reactStrictMode: true,
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      ...defaultPathMap,
    };
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  images: {
    loader: 'imgix',
    path: '',
  },
};

const withTM = require('next-transpile-modules')(['three']);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(withTM(nextConfig));
