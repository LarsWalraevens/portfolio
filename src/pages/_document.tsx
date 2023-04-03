import useTranslation from 'next-translate/useTranslation';
import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script'

export default function Document() {
  const { t, lang } = useTranslation('common');
  return (
    <Html lang={lang}>
      <Head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S9BFZHKQS0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-S9BFZHKQS0');
        `}
        </Script>
        <Script id="hotjar" strategy="afterInteractive">
          {`          
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3177131,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
        </Script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" type="image/png" href="favicon.png" />
        <link rel="shortcut icon" href="favicon.svg" type="image/x-icon" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="portfolio" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="robots" content="index, follow" />
        <meta key="googlebot" name="googlebot" content="index,follow" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Lars Walraevens" />
        <meta name="keywords" content="lars walraevens, portfolio lars walraevens, portfolio, lars walraevens portfolio, webdeveloper, web developer, Lars Walraevens" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="nl_BE" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:site_name" content="Lars Walraevens - Portfolio" />
        <meta property="og:url" content="https://larswalraevens.be/" />
        <meta property="og:image" content="/og-image.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://larswalraevens.be/" />
        <meta property="twitter:image" content="/og-image.png" />

        {/* THEME STUFF */}
        <meta name="theme-color" content="#131313" />
        <meta name="msapplication-TileColor" content="#131313" />
        <meta name="msapplication-TileImage" content="/favicon.svg" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Titillium+Web:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
