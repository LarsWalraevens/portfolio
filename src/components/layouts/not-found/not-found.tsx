import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function NotFound() {
    const { t } = useTranslation('common');
    return <>
        <div className="px-40 py-20 mb-10 rounded-md">
            <div className="flex flex-col items-center">
                <h1 className="font-bold text-blue-600 text-[4rem]">404</h1>

                <h6 className="mb-2 text-[2.5rem] font-bold text-center text-gray-800">
                    <span className="text-red-500 text-[2.5rem]">Oops!</span> {t("main_404_title")}
                </h6>

                <p className="mb-6 text-center text-gray-500">
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