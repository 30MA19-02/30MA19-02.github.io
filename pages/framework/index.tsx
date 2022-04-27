import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const framework_list = ['next'];

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Frameworks</title>
        <meta name="description" content="Documentation page for noneuclidjs." />
      </Head>
      <main>
        <ul>
          {framework_list.map((name) => (
            <li key={name}>
              <Link href={`framework/${name}`} prefetch={false}>
                <a>{name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Post;
