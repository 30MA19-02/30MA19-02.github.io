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
    path: '/AMGM-CIC',
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
          display: 'flex'
        }}
      >
        {navLinks.map((link, index) => {
          return (
            <Link href={link.path} key={index} passHref>
              <a>{link.name}</a>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
export default Scene;
