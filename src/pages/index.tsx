import { handleSeoTags } from '@/components/utils/myMethods';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

export default function Home() {
  const { t } = useTranslation('common');


  return (
    <>
      <Head>
        {handleSeoTags("title", t("seo_title"))}
        {handleSeoTags("description", t("seo_description"))}
      </Head>
      <div className="container wrapper mx-auto h-full">
        <main>
          lets go!
        </main>

      </div>
    </>
  )
}
