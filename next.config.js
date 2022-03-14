/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/noneuclidjs-docs' : '',
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/noneuclidjs-docs' : '',
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/framework': { page: '/next', dev: true },
      ...defaultPathMap,
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
  extension: /\.(md|mdx)?$/,
  options: {
    remarkPlugins: [import('remark-math'), import('remark-code-import').then((module) => module.codeImport), import('remark-mdx-frontmatter').then((module)=>module.remarkMdxFrontmatter)],
    rehypePlugins: [import('rehype-mathjax'), import('rehype-highlight')],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
});
module.exports = withMDX(withTM(nextConfig));
