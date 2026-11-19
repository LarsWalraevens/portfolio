import ContactSection from '@/components/layouts/sections/contact';
import HomeAboutSection from '@/components/layouts/sections/home-about';
import HomeHeroSection from '@/components/layouts/sections/home-hero';
import HomeProjectsSection from '@/components/layouts/sections/home-projects';
import { handleSeoTags } from '@/components/utils/myMethods';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { animateScroll } from "react-scroll";

export default function Home() {
  // # UTILS
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    if (router.asPath !== router.route) {
      setTimeout(() => {
        const element = document.getElementById(router.asPath.replace("/#", ""));

        if (!element) { return }
        const yOffset = -80; // clear the sticky header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        animateScroll.scrollTo(y, {
          duration: 0
        });

      }, 70);
    }
  }, [router.asPath]);


  return (
    <>
      <Head>
        {handleSeoTags("title", t("seo_title"))}
        {handleSeoTags("description", t("seo_description"))}
      </Head>
      <div className="h-full">
        <main>
          <HomeHeroSection />
          <div>
              <HomeAboutSection />
              <HomeProjectsSection />
              <ContactSection />
          </div>
        </main>
      </div>
    </>
  )
}