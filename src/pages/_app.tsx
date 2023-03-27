import Footer from '@/components/layouts/footer/footer';
import Header from '@/components/layouts/header/header';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import "swiper/css";
import 'tippy.js/dist/tippy.css';


export default function App({ Component, pageProps }: AppProps) {
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", (url) => {
      NProgress.done(false);
    });

    Router.events.on("routeChangeError", (url) => {
      NProgress.done(false);
    });

  }, [Router])

  return <>
    <Header></Header>
    <Component {...pageProps} />
    <Footer />
  </>
}
