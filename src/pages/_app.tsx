import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.scss";
import { Header } from "./../components/Header/index";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
