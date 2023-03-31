import ContactSection from '@/components/layouts/sections/contact';
import HomeAboutSection from '@/components/layouts/sections/home-about';
import HomeHeroSection from '@/components/layouts/sections/home-hero';
import HomeProjectsSection from '@/components/layouts/sections/home-projects';
import HomeToolsSection from '@/components/layouts/sections/home-tools';
import { useAppStore } from '@/components/utils/appStore';
import { handleSeoTags } from '@/components/utils/myMethods';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRef } from 'react';
import { Fade, Slide } from 'react-awesome-reveal';

export default function Home() {
  // # STORE
  const appStore = useAppStore();

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
          <div className="max-lg:hidden block">
            <Fade duration={appStore.fadeConditional(300)} delay={appStore.fadeConditional(800)} triggerOnce>
              <div>
                <HomeAboutSection />
                <HomeToolsSection />
                <HomeProjectsSection />
                <ContactSection />
              </div>
            </Fade>
          </div>
          <div className="max-lg:block hidden">
            <HomeAboutSection />
            <HomeToolsSection />
            <HomeProjectsSection />
            <ContactSection />

          </div>
        </main>
      </div>
    </>
  )
}