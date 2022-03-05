import { ThemeProvider } from "theme-ui";
import Content, { meta } from './index.mdx';
import type { Iprops } from '../../_app.page';
import type { NextPage } from "next";
import Head from "next/head";

const Post:NextPage<Iprops> = (props) => {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description}/>
      </Head>
      <ThemeProvider theme={props.theme}>
        <main {...props}>
          <Content/>
        </main>
      </ThemeProvider>
    </>
  )
}
export default Post;