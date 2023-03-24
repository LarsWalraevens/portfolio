import useTranslation from "next-translate/useTranslation";
import { codeAboutIcon, designAboutIcon, hobbiesAboutIcon, mediaAboutIcon } from "./icons-about-section";
import { AboutComponentSectionProps } from "./skills-section";

export default function MotivationSection(props: AboutComponentSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="motivation">
            <div className="mb-5">
                <p className="text-grey-100">{t("section_about_motivation_description1")}</p>
                <p className="text-grey-100">{t("section_about_motivation_description2")}</p>
            </div>
            <div className="btn inline-block" onClick={() => props.goNext()}>{t("main_next")}</div>
        </div>
    </>
}