import Basic from "./basic";
import { Navigate, useRoutes } from "react-router-dom";
import { FC } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Pages: FC = (prop) => {
  return useRoutes([
    {
      path: "",
      element: <Navigate to="basic" />,
    },
    {
      path: "basic/*",
      element: <div>
        <HelmetProvider>
          <Helmet>
            <title>Basic Example | Noneuclidjs</title>
          </Helmet>
        </HelmetProvider>
      <Basic />
      </div>,
    },
  ]);
};

export default Pages;
