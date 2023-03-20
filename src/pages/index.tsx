import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React from 'react';
import { Router } from 'next/router';

export default function Home() {
  const { t, lang } = useTranslation('common');

  const router = useRouter();
  const { locale } = router;

  const changeLang = (newLang: "nl" | "en") => {
    router.push(router.asPath, router.asPath, { locale: newLang });
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <header className='container mx-auto wrapper h-[65px] flex items-center justify-between'>
        <Link href="/" className='flex items-center hover:opacity-70'>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="12.8571" height="12.8571" rx="6.42857" fill="white" />
            <path d="M5.75403 16.7773C5.87489 16.5356 6.1041 16.3663 6.37067 16.3219L10.5035 15.6331C13.4995 15.1337 15.7811 12.6755 16.056 9.65075L16.3512 6.40444C16.3771 6.11953 16.5485 5.86829 16.8044 5.74035C17.3537 5.46571 18 5.86513 18 6.47924V13.0887C18 15.801 15.8012 17.9997 13.089 17.9997H6.50953C5.88162 17.9997 5.47322 17.3389 5.75403 16.7773Z" fill="white" />
          </svg>
          <span className='ml-3 text-xl'>Lars Walraevens</span>
        </Link>
        <div className='flex items-center'>
          <nav>
            <Link href="/#about">{t("nav_about")}</Link>
            <Link href="/#about">{t("nav_projects")}</Link>
            <Link href="/#about">{t("nav_contact")}</Link>
            <Link href="/#about" id="nav-resume">{t("nav_resume")}</Link>
          </nav>
          <div className='flex items-center ml-4'>
            <span className={`${lang.toUpperCase() === "EN" ? "font-semibold" : ""} cursor-pointer`} onClick={(e) => changeLang('en')}>EN</span>
            <span className='mx-2 lang-stripe relative'>
              <span id="stripe" className={`absolute ${lang.toUpperCase() === "EN" ? "" : "right-0"}`}>
                <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="16" height="4" rx="2" fill="white" />
                </svg>
              </span>
              <svg width="31" height="4" viewBox="0 0 31 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="31" height="3.99999" rx="2" fill="#393939" />
              </svg>
            </span>
            <span className={`${lang.toUpperCase() === "NL" ? "font-semibold" : ""} cursor-pointer`} onClick={(e) => changeLang('nl')} >NL</span>
          </div>
        </div>
      </header>
      <div className="container wrapper mx-auto h-full">
        <main>
          lets go!
        </main>

      </div>
    </>
  )
}
