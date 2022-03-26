import { ThemeProvider } from 'theme-ui';
import theme from '../styles/theme';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps, router }: AppProps) {
  if (router.asPath.split('/', 2)[1] == 'framework') return <Component {...pageProps} />;
  return (
    <>
      <ThemeProvider theme={theme}>
        <main>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  );
}
