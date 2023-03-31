import useTranslation from "next-translate/useTranslation";
import { AboutComponentSectionProps } from "./skills-section";
import { Bounce, Fade, Slide } from "react-awesome-reveal";

export default function MotivationSection(props: AboutComponentSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="motivation">
            <div className="mb-6">
                <p className="text-grey-100 mb-3" dangerouslySetInnerHTML={{ __html: t("section_about_motivation_description1") }}></p>
                <p className="text-grey-100">{t("section_about_motivation_description2")}</p>
            </div>
            <div className="btn inline-block" onClick={() => props.goNext()}>{t("main_next")}</div>
        </div>
    </>
}
