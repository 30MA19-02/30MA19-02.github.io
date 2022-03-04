/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/examples/basic', dev: true },
      '/framework': { page: '/next', dev: true },
      ...defaultPathMap
    };
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'page.mdx', 'page.md'],
  images: {
    loader: 'imgix',
    path: '',
  },
};

const withTM = require('next-transpile-modules')(['three']);
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // remarkPlugins: ['remark-math'].map((plugin)=>import(plugin)),
    // rehypePlugins: ['rehype-mathjax'].map((plugin)=>import(plugin)),
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
module.exports = withMDX(withTM(nextConfig));
