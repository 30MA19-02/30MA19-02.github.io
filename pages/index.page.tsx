import Link from 'next/link';
import type { NextPage } from 'next';

const Post: NextPage = () => {
  return (
    <>
      <h1>Home Page</h1>
      <p>
        Click the link below to navigate to pages.
      </p>
      <ul>
          <li>
            <Link href={`/examples/basic`}>
              <a>Basic example</a>
            </Link>
          </li>
          <li>
            <Link href={`/examples/raytracing`}>
              <a>Not So Basic example</a>
            </Link>
          </li>
      </ul>
    </>
  );
};

export default Post;
