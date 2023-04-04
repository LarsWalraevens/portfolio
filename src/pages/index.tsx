import ContactSection from '@/components/layouts/sections/contact';
import HomeAboutSection from '@/components/layouts/sections/home-about';
import HomeHeroSection from '@/components/layouts/sections/home-hero';
import HomeProjectsSection from '@/components/layouts/sections/home-projects';
import HomeToolsSection from '@/components/layouts/sections/home-tools';
import { useAppStore } from '@/components/utils/appStore';
import { handleSeoTags } from '@/components/utils/myMethods';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useRouter } from "next/router";
import { animateScroll } from "react-scroll";

export default function Home() {
  // # STORE
  const appStore = useAppStore();

  // # UTILS
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    if (router.asPath !== router.route) {
      setTimeout(() => {
        const element = document.getElementById(router.asPath.replace("/#", ""));

        if (!element) { return }
        const yOffset = -10;
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
          <Fade duration={appStore.fadeConditional(300)} delay={appStore.fadeConditional(300)} triggerOnce>
            <div>
              <HomeAboutSection />
              <HomeToolsSection />
              <HomeProjectsSection />
              <ContactSection />
            </div>
          </Fade>
        </main>
      </div>
    </>
  )
}