import Footer from '@/components/layouts/footer/footer';
import Header from '@/components/layouts/header/header';
import { useAppStore } from '@/components/utils/appStore';
import '@/styles/globals.css';
import $ from 'jquery';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import "swiper/css";
import 'tippy.js/dist/tippy.css';


export default function App({ Component, pageProps }: AppProps) {
  // # STORE
  const appStore = useAppStore();

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

  }, [Router]);


  useEffect(() => {
    if (appStore.disabledFade === false) {
      setTimeout(() => {
        $("#load-overlay").hide();
      }, 70);

    } else {
      $("#load-overlay").hide();
    }
  }, [])


  return <>
    <div id="load-overlay" className="fixed bg-black-400 w-full h-full top-0" style={{ zIndex: 10000 }} />
    <Header></Header>
    <Component {...pageProps} />
    <Footer />
  </>
}
