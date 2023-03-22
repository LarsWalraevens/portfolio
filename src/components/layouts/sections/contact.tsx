import useTranslation from "next-translate/useTranslation";
import Title from "../title/title";
import Link from "next/link";
import { githubIcon, linkedInIcon, mailIcon } from "@/assets/icons/icons";

export default function ContactSection() {
    const { t } = useTranslation('common');
    return <>
        <section id="contact" className="bg-black-300 py-[50px] border-y border-y-black-200 relative">
            <div className="container container-sm wrapper mx-auto relative">
                <div className="flex align-start justify-between">
                    <div className="max-w-[700px]">
                        <Title className="mb-2">{t("section_contact_title")}</Title>
                        <p className="text-grey-100 mb-5">{t("section_contact_description")}</p>
                        <Link href="mailto:larswalraevens@live.be" className="btn inline-block">{t("section_contact_cta")}</Link>
                    </div>
                    <div className="flex flex-row items-center justify-end">
                        <Link href="/" className="mx-2 hover:scale-110 cursor-pointer">{mailIcon}</Link>
                        <Link href="/" className="mx-2 hover:scale-110 cursor-pointer">{linkedInIcon}</Link>
                        <Link href="/" className="mx-2 hover:scale-110 cursor-pointer">{githubIcon}</Link>
                    </div>

                </div>
            </div>
        </section>
    </>
}