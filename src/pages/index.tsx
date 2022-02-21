import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from './home';
import Example from './examples';
import { Navigate } from 'react-router-dom';
const Pages = () => {
  return useRoutes([
    {
      path: '',
      element: <Navigate to="examples" />,
    },
    {
      path: 'examples/*',
      element: <Example />,
    },
    {
      path: 'react',
      element: <Home />,
    },
  ]);
};
export default Pages;
