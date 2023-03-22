import HomeAboutSection from '@/components/layouts/sections/home-about';
import HomeHeroSection from '@/components/layouts/sections/home-hero';
import { handleSeoTags } from '@/components/utils/myMethods';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import typescript from '@/../public/img/typescript.png';
import react from '@/../public/img/react.png';
import nextjs from '@/../public/img/nextjs.png';
import tailwind from '@/../public/img/tailwind.png';
import javascript from '@/../public/img/javascript.png';
import jquery from '@/../public/img/jquery.png';
import Image from 'next/image';
import HomeToolsSection from '@/components/layouts/sections/home-tools';
import HomeProjectsSection from '@/components/layouts/sections/home-projects';
import ContactSection from '@/components/layouts/sections/contact';

export default function Home() {
  // # UTILS
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        {handleSeoTags("title", t("seo_title"))}
        {handleSeoTags("description", t("seo_description"))}
      </Head>
      <div className="h-full">
        <main>
          <HomeHeroSection />
          <HomeAboutSection />
          <HomeToolsSection />
          <HomeProjectsSection />
          <ContactSection />
        </main>
      </div>
    </>
  )
}
