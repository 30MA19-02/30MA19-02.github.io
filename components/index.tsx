import dynamic from 'next/dynamic';
import type { MDXComponents } from 'mdx/types';
import type { ComponentType } from 'react';

const components: {
  [key: string]: ComponentType;
} = {
  BasicExample: dynamic(() => import('./examples/basic')),
};

export default components as MDXComponents;
