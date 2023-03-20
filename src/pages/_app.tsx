import Header from '@/components/layouts/header/header'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Header></Header>
    <Component {...pageProps} />
  </>
}
