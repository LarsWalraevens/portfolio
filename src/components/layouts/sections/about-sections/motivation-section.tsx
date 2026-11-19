import useTranslation from "next-translate/useTranslation";

export default function MotivationSection() {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="motivation">
            <p className="lead text-grey-100 text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.45] max-w-[40ch] lg:max-w-none" dangerouslySetInnerHTML={{ __html: t("section_about_motivation_description1") }}></p>
            <p className="text-muted mt-8 max-w-[62ch]">{t("section_about_motivation_description2")}</p>
        </div>
    </>
}
