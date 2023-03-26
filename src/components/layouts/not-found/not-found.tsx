import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function NotFound() {
    const { t } = useTranslation('common');
    return <>
        <div className="px-40 py-20 rounded-md">
            <div className="flex flex-col items-center">
                <h1 className="font-bold text-blue-600 text-[50px]">404</h1>

                <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                    <span className="text-red-500 text-[30px]">Oops!</span> {t("main_404_title")}
                </h6>

                <p className="mb-8 text-center text-gray-500 md:text-lg">
                    {t("main_404_description")}
                </p>

                <Link
                    href="/"
                    className="btn"
                >{t("main_404_cta")}</Link>
            </div>
        </div>
    </>
}