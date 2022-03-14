import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ThemeProvider } from 'theme-ui';
import theme from '../../styles/theme';
import { example_list } from './index';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Examples</title>
        <meta name="description" content="Documentation page for noneuclidjs." />
      </Head>
      <ThemeProvider theme={theme}>
        <main>
          <ul>
            {example_list.map((name) => (
              <li key={name}>
                <Link href={`examples/${name}`}>
                  <a>{name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Post;
