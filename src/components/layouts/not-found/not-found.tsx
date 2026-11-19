import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
    const { t } = useTranslation('common');
    return <main className="shell py-24">
        <Head>
            <title>{`${t("main_404_title")} — Lars Walraevens`}</title>
        </Head>
        <div className="label text-faint flex items-center gap-3 mb-5">
            <span className="diamond" aria-hidden="true" />
            404
        </div>
        <h1 className="font-display text-[clamp(3rem,7vw,6rem)] text-bone">{t("main_404_title")}</h1>
        <p className="text-muted mt-6 mb-10 max-w-[52ch]">{t("main_404_description")}</p>
        <Link href="/" className="btn btn-primary">{t("main_404_cta")}</Link>
    </main>
}
