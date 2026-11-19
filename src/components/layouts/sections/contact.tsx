import { githubIcon, linkedInIcon } from "@/assets/icons/icons";
import useTranslation from "next-translate/useTranslation";
import Title from "../title/title";

export default function ContactSection() {
    const { t } = useTranslation('common');
    return <section id="contact" className="bg-surface py-[clamp(72px,9vw,120px)] [--btn-fill:var(--surface)]">
        <div className="shell grid lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
            <div className="lg:col-span-7">
                <Title>{t("section_contact_title")}</Title>
                <p className="text-muted mt-6 max-w-[52ch]">{t("section_contact_description")}</p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
                <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="btn btn-primary">{t("section_contact_cta")} <span aria-hidden="true">&rarr;</span></a>
                <a href={process.env.NEXT_PUBLIC_URL_LINKEDIN} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" title="LinkedIn" className="social-square !w-12 !h-12">{linkedInIcon}</a>
                <a href={process.env.NEXT_PUBLIC_URL_GITHUB} target="_blank" rel="noreferrer noopener" aria-label="GitHub" title="GitHub" className="social-square !w-12 !h-12">{githubIcon}</a>
            </div>
        </div>
    </section>
}
