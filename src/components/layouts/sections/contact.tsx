import { githubIcon, linkedInIcon, mailIcon } from "@/assets/icons/icons";
import useTranslation from "next-translate/useTranslation";
import Title from "../title/title";
import { HomeSectionProps } from "./home-hero";

export default function ContactSection(props: HomeSectionProps) {
    const { t } = useTranslation('common');
    return <>
        <section id="contact" className="bg-black-300 py-[50px] border-t border-t-black-200 relative max-lg:!bg-none max-lg:py-10">
            <div className="container container-sm wrapper mx-auto relative">
                <div className="flex align-start justify-between max-lg:flex-col">
                    <div className="max-w-[700px]">
                        <Title className="mb-2">{t("section_contact_title")} 💬</Title>
                        <p className="text-grey-100 mb-5">{t("section_contact_description")}</p>
                        <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="btn inline-block">{t("section_contact_cta")}</a>
                    </div>
                    <div className="flex flex-row items-center justify-end max-lg:justify-start max-lg:mt-5">
                        <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="mx-2 hover:scale-110 cursor-pointer">{mailIcon}</a>
                        <a href={process.env.NEXT_PUBLIC_URL_LINKEDIN} target="_blank" rel="noreferrer noopener" title="linkedIn" className="mx-2 hover:scale-110 cursor-pointer">{linkedInIcon}</a>
                        <a href={process.env.NEXT_PUBLIC_URL_GITHUB} target="_blank" rel="noreferrer noopener" title="GitHub" className="mx-2 hover:scale-110 cursor-pointer">{githubIcon}</a>
                    </div>

                </div>
            </div>
        </section>
    </>
}