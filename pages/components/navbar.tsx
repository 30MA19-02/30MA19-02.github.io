import Link from 'next/link';
import type { FC } from 'react';

const navLinks = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Examples',
    path: '/examples',
  },
  {
    name: 'Proof',
    path: '/proof',
  },
  {
    name: 'Documentation',
    path: '/noneuclid',
  },
];

const Scene: FC = (prop) => {
  return (
    <>
      <nav
        style={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {navLinks.map((link, index) => {
          return (
            <Link
              href={link.path}
              key={index}
              style={{
                float: 'left',
                textAlign: 'center',
                padding: '14px 16px',
                textDecoration: 'none',
              }}
              passHref
            >
              <a>{link.name}</a>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
export default Scene;
