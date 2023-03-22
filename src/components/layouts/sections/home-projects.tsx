import Title from "@/components/layouts/title/title";
import useTranslation from "next-translate/useTranslation";

export default function HomeProjectsSection() {
    // # UTILS
    const { t } = useTranslation('common');
    const endIcon = <svg width="11" height="55" viewBox="0 0 11 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" width="30" height="1.99999" rx="0.999997" transform="rotate(90 6 0)" fill="white" />
        <rect x="10.0433" y="45.2363" width="12.2431" height="1.74901" rx="0.874505" transform="rotate(135 10.0433 45.2363)" fill="white" />
        <rect width="12.2431" height="1.74901" rx="0.874505" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 10.0433 52.792)" fill="white" />
    </svg>;

    return <>
        <section id="project" className="py-[100px]  relative">
            <div className="container container-sm wrapper mx-auto relative">
                <Title className="mb-2">{t("section_projects_title")}</Title>
                <p className="text-grey-100">{t("section_projects_description")}</p>
                <div className="mb-5">

                </div>
                <div className="flex justify-center">
                    {endIcon}
                </div>
            </div>
        </section>
    </>
}