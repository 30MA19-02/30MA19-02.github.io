import { Link } from 'theme-ui';
import type { NextPage } from 'next';

const Post: NextPage = () => {
  return (
    <>
      <h1>Examples</h1>
      <p>Click the link below to navigate to pages.</p>
      <ul>
        <li>
          <Link href={`/examples/basic`}>
            Basic example
          </Link>
        </li>
        <li>
          <Link href={`/examples/raytracing`}>
            Not So Basic example
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Post;
