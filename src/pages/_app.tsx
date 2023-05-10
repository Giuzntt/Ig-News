import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.scss";
import { Header } from "./../components/Header/index";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>ig.news</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
