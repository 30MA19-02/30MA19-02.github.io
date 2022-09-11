import type { NextPage } from 'next';
import Link from 'next/link';

const Post: NextPage = () => {
  return (
    <>
      <h1>Examples</h1>
      <p>Click the link below to navigate to pages.</p>
      <ul>
        <li>
          <Link href={`/examples/basic`} passHref>
            <a>Basic example</a>
          </Link>
        </li>
        <li>
          <Link href={`/examples/etc`} passHref>
            <a>ETC</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Post;
