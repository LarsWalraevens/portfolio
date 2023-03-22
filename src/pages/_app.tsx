import Header from '@/components/layouts/header/header'
import '@/styles/globals.css'
import 'rsuite/dist/rsuite.min.css'; // or 'rsuite/dist/rsuite.min.css'
import type { AppProps } from 'next/app'
import Footer from '@/components/layouts/footer/footer';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Header></Header>
    <Component {...pageProps} />
    <Footer />
  </>
}
