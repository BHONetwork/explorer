import { useEffect } from "react";
import { Provider } from "react-redux";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";
import { store } from "../store";
import { useNode } from "utils/hooks";

import "nprogress/nprogress.css";
import "styles/globals.css";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on(
  "routeChangeStart",
  (url, { shallow }) => !shallow && NProgress.start()
);
Router.events.on(
  "routeChangeComplete",
  (url, { shallow }) => !shallow && NProgress.done()
);
Router.events.on(
  "routeChangeError",
  (url, { shallow }) => !shallow && NProgress.done()
);

function MyApp({ Component, pageProps }) {
  const node = useNode();
  useEffect(() => {
    if (node) {
      localStorage.setItem("node", node);
    }
  }, [node]);

  return (
    <>
      <Head>
        <title>Bholdus Asset Explorer</title>
        <meta
          name="description"
          content="Bholdus blockchain data and asset explorer"
        />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
