import useTranslation from "next-translate/useTranslation";
import { codeAboutIcon, designAboutIcon, hobbiesAboutIcon, mediaAboutIcon } from "./icons-about-section";

export interface AboutComponentSectionProps {
    goNext: () => void;
}

export default function SkillsSection(props: AboutComponentSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="skills">
            <p className="text-grey-100 mb-7" dangerouslySetInnerHTML={{ __html: t("section_about_skills_description") }}></p>
            <div className="mt-4 mb-6">
                <SkillItem
                    title={t("main_development")}
                    icon={codeAboutIcon}
                >
                    ReactJS, NextJS, Javascript, Typescript, TailwindCSS, Sass, ...
                </SkillItem>
                <SkillItem
                    title={t("main_designing")}
                    icon={designAboutIcon}
                >
                    Figma, Adobe XD, Photoshop, ...
                </SkillItem>
                <SkillItem
                    title={t("main_media")}
                    icon={mediaAboutIcon}
                >
                    Adobe Premiere, Photoshop, Audition, ...
                </SkillItem>
                <SkillItem
                    title={t("main_hobbies")}
                    icon={hobbiesAboutIcon}
                >
                    {t("section_about_skills_hobbies")}
                </SkillItem>
            </div>
            <div className="btn inline-block" onClick={() => props.goNext()}>{t("main_next")}</div>
        </div>
    </>
}

interface SkillItemProps {
    icon: any;
    title: string;
    children: any;
}

function SkillItem(props: SkillItemProps) {
    return <>
        <div className={'flex items-center mb-2 max-lg:flex-col max-lg:items-start max-lg:justify-start max-lg:mb-3'}>
            <div className="flex items-center mr-4 min-w-[200px] max-lg:mb-2">
                <span className="mr-3 w-[22px]">{props.icon}</span>
                <span className="text-white-100 text-medium font-secondary">{props.title}</span>
            </div>
            <span className="text-grey-100 text-medium font-secondary">{props.children}</span>
        </div>
    </>
}