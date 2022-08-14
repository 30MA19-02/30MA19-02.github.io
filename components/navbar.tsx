import Link from 'next/link';
import type { FC } from 'react';
import { Flex, NavLink } from 'theme-ui';

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
    path: '/proof,
  },
  {
    name: 'Documentation',
    path: '/noneuclid',
  },
];

const Scene: FC = (prop) => {
  return (
    <>
      <Flex as="nav">
        {navLinks.map((link, index) => {
          return (
            <Link href={link.path} key={index} passHref>
              <NavLink p={2}>{link.name}</NavLink>
            </Link>
          );
        })}
      </Flex>
    </>
  );
};
export default Scene;
