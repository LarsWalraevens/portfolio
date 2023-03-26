import ContactSection from '@/components/layouts/sections/contact';
import HomeAboutSection from '@/components/layouts/sections/home-about';
import HomeHeroSection from '@/components/layouts/sections/home-hero';
import HomeProjectsSection from '@/components/layouts/sections/home-projects';
import HomeToolsSection from '@/components/layouts/sections/home-tools';
import { handleSeoTags } from '@/components/utils/myMethods';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

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
