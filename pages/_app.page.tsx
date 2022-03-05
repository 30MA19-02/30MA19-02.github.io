import '../styles/globals.css';
import theme from '../styles/theme';
import type { AppProps } from 'next/app';
import type { Theme } from 'theme-ui';
import type { ReactNode } from 'react';

export interface Iprops {
  theme: Theme;
  children?: ReactNode | undefined;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  let props: Iprops = { theme, ...pageProps };
  return <Component {...props} />;
}
