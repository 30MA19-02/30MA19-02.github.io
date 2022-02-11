import { FC, useEffect } from "react";
import "./index.css";
import App from "./App";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Index: FC = (props) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "React App";
    return () => {
      document.title = prevTitle;
    };
  });
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <link rel="icon" href={process.env.PUBLIC_URL + "/favicon.ico"} />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="Web site created using create-react-app"
          />
          <link
            rel="apple-touch-icon"
            href={process.env.PUBLIC_URL + "/logo192.png"}
          />
          <title>React App</title>
        </Helmet>
      </HelmetProvider>
      <App />
    </div>
  );
};

export default Index;
