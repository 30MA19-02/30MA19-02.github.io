import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "theme-ui";
import { deep as theme } from '@theme-ui/presets'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
