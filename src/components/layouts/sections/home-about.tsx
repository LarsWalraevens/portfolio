import Title from "@/components/layouts/title/title";
import useTranslation from "next-translate/useTranslation";
import { Fragment, useState } from "react";
import SkillsSection from './about-sections/skills-section';
import MotivationSection from "./about-sections/motivation-section";
import OtherSection from "./about-sections/other-section";
import { rightSideEffectIcon } from "@/assets/icons/icons";

export interface AboutSectionProps {
    key: number;
    number: string;
    title: string;
}

export default function HomeAboutSection() {

    // # UTILS
    const { t } = useTranslation('common');
    const optionTitleClass = (number: number) => `font-secondary flex items-center mb-2 cursor-pointer transition ${number === activeSection.key ? "font-semibold text-white-100" : " text-grey-100 ml-4 hover:scale-95 "}`
    const optionsData: Array<AboutSectionProps> = [
        {
            key: 1,
            number: "01",
            title: t("section_about_option_skills")
        },
        {
            key: 2,
            number: "02",
            title: t("section_about_option_motivation")
        },
        {
            key: 3,
            number: "03",
            title: t("section_about_option_others")
        },
    ]

    // # CLIENT STATES
    const [activeSection, setActiveSection] = useState<AboutSectionProps>(optionsData[0]);

    return <>
        <section id="about" className="bg-black-300 py-[80px] pb-[100px] border-y border-y-black-200 relative">
            <div className="container container-sm wrapper mx-auto">
                <span className="absolute right-[15vw] top-[40px]">{rightSideEffectIcon}</span>
                <div className="flex flex-row align-start">
                    <div className="mr-10">
                        <Title className="mb-4">{t("section_about_title")}</Title>
                        <div className="flex flex-col">
                            {
                                optionsData.map((section: AboutSectionProps, i: number) => <Fragment key={i}>
                                    <div onClick={() => setActiveSection(section)} className={optionTitleClass(section.key)}>
                                        <span className="font-secondary text-[22px] mr-2 mt-[-2px]">{section.number}</span>{section.title}
                                    </div>
                                </Fragment>)
                            }
                        </div>
                        <div className="mt-5">
                            <p className="mb-3 text-grey-100">{t("section_about_resume_description")}</p>
                            <a href="" className="btn-special ml-0">{t("main_my_resume")}</a>
                        </div>
                    </div>
                    <div className="my-4 mb-5 relative">
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.23669" y="0.000976562" width="12.2431" height="1.74901" rx="0.874505" transform="rotate(45 1.23669 0.000976562)" fill="white" />
                            <rect width="12.2431" height="1.74901" rx="0.874505" transform="matrix(-0.707107 0.707107 0.707107 0.707107 8.79248 0.000976562)" fill="white" />
                        </svg>
                        <div className="border-r-white-100 border-r-2 h-full flex items-center mt-3 mr-[5px]"></div>
                    </div>
                    <div className="mt-1 ml-7 mr-5 max-w-[800px]">
                        <div>
                            <h4 className="font-secondary font-semibold uppercase flex items-center mb-4">
                                <span className="opacity-50 mr-3 text-[45px] font-secondary font-bold mb-1">{activeSection.number}</span>
                                {activeSection.title}
                            </h4>
                            {
                                activeSection.key === 1 ?
                                    <SkillsSection goNext={() => setActiveSection(optionsData[1])} /> :
                                    activeSection.key === 2 ?
                                        <MotivationSection goNext={() => setActiveSection(optionsData[2])} /> :
                                        activeSection.key === 3 ?
                                            <OtherSection goNext={() => setActiveSection(optionsData[0])} /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}