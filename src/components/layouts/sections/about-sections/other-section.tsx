import useTranslation from "next-translate/useTranslation";
import { AboutComponentSectionProps } from "./skills-section";

export default function OtherSection(props: AboutComponentSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="other">
            <div className="mb-6">
                <p className="text-grey-100" dangerouslySetInnerHTML={{ __html: t("section_about_other_description1") }}></p>
                <ul className="list-disc ml-4 my-3 text-grey-100">
                    <li>Zustand (state manager)</li>
                    <li>react-query (server state manager)</li>
                    <li>Ant design (UI library)</li>
                    <li>Immer</li>
                </ul>
            </div>
            <div className="btn inline-block" onClick={() => props.goNext()}>{t("main_next")}</div>
        </div>
    </>
}
