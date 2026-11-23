import { githubIcon, linkedInIcon } from "@/assets/icons/icons";
import portrait from "@/assets/img/portrait.jpg";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Title from "../title/title";

export default function ContactSection() {
    const { t } = useTranslation('common');
    return <section id="contact" className="bg-surface py-[clamp(96px,12vw,168px)] [--btn-fill:var(--surface)]">
        <div className="shell grid md:grid-cols-12 gap-x-8 lg:gap-x-14 gap-y-10 items-center">
            <div data-reveal className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
                {/* Offset outline frame behind the photo, chamfered like the rest of the system. */}
                <div className="group/contact relative w-[clamp(200px,60vw,300px)] md:w-full max-w-[320px] aspect-square">
                    <span aria-hidden="true" className="chamfer [--chamfer:18px] absolute inset-0 translate-x-3 translate-y-3 bg-accent/80 transition-transform duration-300 group-hover/contact:translate-x-4 group-hover/contact:translate-y-4" />
                    <span className="chamfer [--chamfer:18px] absolute inset-0 overflow-hidden bg-ink">
                        <Image src={portrait} alt="Lars Walraevens" fill sizes="(min-width: 768px) 320px, 60vw" quality={90} className="object-cover md:grayscale contrast-[1.05] transition duration-500 group-hover/contact:grayscale-0 group-hover/contact:scale-[1.03]" />
                    </span>
                </div>
            </div>
            <div data-reveal data-reveal-delay="120" className="md:col-span-7 lg:col-span-8">
                <Title>{t("section_contact_title")}</Title>
                <p className="text-muted mt-6 max-w-[52ch] text-[1.15rem] lg:text-[1.25rem]">{t("section_contact_description")}</p>
                <div className="flex flex-wrap items-center gap-3 mt-9">
                    <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="btn btn-primary">{t("section_contact_cta")} <span aria-hidden="true">&rarr;</span></a>
                    <a href={process.env.NEXT_PUBLIC_URL_LINKEDIN} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" title="LinkedIn" className="social-square !w-12 !h-12">{linkedInIcon}</a>
                    <a href={process.env.NEXT_PUBLIC_URL_GITHUB} target="_blank" rel="noreferrer noopener" aria-label="GitHub" title="GitHub" className="social-square !w-12 !h-12">{githubIcon}</a>
                </div>
            </div>
        </div>
    </section>
}
