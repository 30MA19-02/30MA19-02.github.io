import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "theme-ui";
import { deep as theme } from '@theme-ui/presets'

function MyApp({ Component, pageProps, router }: AppProps) {
  if (router.pathname === '/next') return <Component {...pageProps} />;
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
