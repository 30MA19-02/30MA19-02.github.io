import type { FC } from 'react';
import { Flex, NavLink } from 'theme-ui';

const navLinks = [
  {
    name: "Home", 
    path: "/" 
  },
  {
    name: "Examples",
    path: "/examples",
  },
  {
    name: "Framework",
    path: "/framework",
  },
];

const Scene: FC = (prop) => {
  return (
    <>
    <Flex
      as="nav"
    >
      {
        navLinks.map((link, index) => {
          return (
            <NavLink href={link.path} key={index} p={2}>
              {link.name}
            </NavLink>
          );
        })
      }
    </Flex>
    </>
  );
};
export default Scene;
