import type { NextPage } from 'next';
import Link from 'next/link';
import { Link as TLink } from 'theme-ui';

const Post: NextPage = () => {
  return (
    <>
      <h1>Examples</h1>
      <p>Click the link below to navigate to pages.</p>
      <ul>
        <li>
          <Link href={`/examples/basic`} passHref>
            <TLink>Basic example</TLink>
          </Link>
        </li>
        <li>
          <Link href={`/examples/etc`} passHref>
            <TLink>ETC</TLink>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Post;
