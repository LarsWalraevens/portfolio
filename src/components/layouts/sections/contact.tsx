import { githubIcon, linkedInIcon, mailIcon } from "@/assets/icons/icons";
import portrait from "@/assets/img/portrait.jpg";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "";
const LINKEDIN = process.env.NEXT_PUBLIC_URL_LINKEDIN || "";
const GITHUB = process.env.NEXT_PUBLIC_URL_GITHUB || "";
/** "github.com/name" from the profile URL, for the card's subline. */
const shortUrl = (url: string) => {
    try { const u = new URL(url); return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}` } catch { return url }
};

/** Lars's local time in Mechelen, updated on the minute. Rendered after mount so server and client agree. */
function LocalTime({ locale }: { locale?: string }) {
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => {
        let timer = 0;
        const tick = () => {
            setNow(new Date());
            timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
        };
        tick();
        return () => window.clearTimeout(timer);
    }, []);
    if (!now) return null;
    return <>{new Intl.DateTimeFormat(locale === "nl" ? "nl-BE" : "en-GB", { timeZone: "Europe/Brussels", hour: "2-digit", minute: "2-digit" }).format(now)}</>;
}

interface ChannelProps {
    href: string;
    icon: ReactNode;
    title: string;
    sub: string;
    external?: boolean;
    action?: ReactNode;
}

/** One way to reach me: a chamfered row with an accent bar that grows in and an arrow that nudges on hover.
    The link is stretched over the whole row (::after), so an extra action (Copy) can sit inside it. */
function Channel(props: ChannelProps) {
    return <div className="group relative flex items-center gap-3.5 sm:gap-5 px-4 py-4 sm:px-6 sm:py-5 chamfer [--chamfer:12px] bg-raised transition-colors duration-200 hover:bg-[#1F1F23]">
        <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-hover origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />
        <span aria-hidden="true" className="shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 chamfer [--chamfer:7px] bg-ink text-muted transition-colors group-hover:text-bone [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6">{props.icon}</span>
        <span className="min-w-0 flex-1">
            <a href={props.href} {...(props.external ? { target: "_blank", rel: "noreferrer noopener" } : {})} className="block text-bone text-[1.05rem] sm:text-[1.15rem] font-medium after:absolute after:inset-0 after:content-['']">{props.title}</a>
            <span className="block text-muted text-[0.9rem] sm:text-[0.95rem] truncate">{props.sub}</span>
        </span>
        {props.action}
        <span aria-hidden="true" className="shrink-0 text-faint text-lg sm:text-xl transition-all duration-200 group-hover:text-bone group-hover:translate-x-1 group-hover:-translate-y-0.5">{props.external ? "\u2197" : "\u2192"}</span>
    </div>
}

export default function ContactSection() {
    const { t } = useTranslation('common');
    const { locale } = useRouter();

    // Copy the address without leaving the page; the label confirms for two seconds.
    const [copied, setCopied] = useState(false);
    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch { window.location.href = `mailto:${EMAIL}` }
    };

    return <section id="contact" className="relative overflow-hidden bg-surface py-[clamp(88px,11vw,152px)] [--btn-fill:var(--surface)]">
        {/* Faint grid fading in from the right, echoing the hero screen. */}
        <span aria-hidden="true" className="contact-grid absolute inset-0 pointer-events-none" />

        <div className="shell relative grid lg:grid-cols-12 gap-x-12 gap-y-10 lg:gap-y-12 items-center">
            <div data-reveal className="lg:col-span-6">
                <div className="flex items-center gap-6 sm:gap-7 mb-10 sm:mb-8">
                    {/* Small portrait with the offset accent frame. */}
                    <span className="group/portrait relative shrink-0 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px]">
                        <span aria-hidden="true" className="chamfer [--chamfer:10px] absolute inset-0 translate-x-1.5 translate-y-1.5 bg-accent" />
                        <span className="chamfer [--chamfer:10px] absolute inset-0 overflow-hidden bg-ink">
                            <Image src={portrait} alt="Lars Walraevens" fill sizes="84px" quality={90} className="object-cover" />
                        </span>
                    </span>
                    <span className="label text-muted leading-relaxed">
                        <span className="block text-bone mb-2">Lars Walraevens</span>
                        {/* Place and local time: stacked on phones (time gets a clock icon), one line with a diamond between from sm up. */}
                        <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                            <span className="inline-flex items-center gap-2">
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-[1.1em] h-[1.1em] shrink-0"><path fill="#E8505B" d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" fill="var(--ink)" /></svg>
                                Mechelen
                            </span>
                            <span aria-hidden="true" className="hidden sm:inline-flex mx-1"><span className="diamond !w-[6px] !h-[6px]" /></span>
                            <span className="inline-flex items-center gap-2">
                                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden w-[1.1em] h-[1.1em] shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                                <span><LocalTime locale={locale} /> {t("section_contact_local")}</span>
                            </span>
                        </span>
                    </span>
                </div>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-bone">{t("section_contact_title")}</h2>
                <p className="text-muted mt-6 max-w-[46ch] text-[1.15rem] lg:text-[1.2rem]">{t("section_contact_description")}</p>
            </div>

            <div data-reveal data-reveal-delay="120" className="lg:col-span-6 flex flex-col gap-3">
                <Channel href={LINKEDIN} external icon={linkedInIcon} title="LinkedIn" sub={t("section_contact_linkedin_sub")} />
                <Channel
                    href={`mailto:${EMAIL}`}
                    icon={mailIcon}
                    title={t("section_contact_email")}
                    sub={EMAIL}
                    action={<button type="button" onClick={copyEmail} aria-live="polite" aria-label={copied ? t("section_contact_copied") : t("section_contact_copy")} className="relative z-[1] label shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-2 chamfer [--chamfer:6px] bg-ink text-muted hover:text-bone transition-colors">
                        {copied
                            ? <span aria-hidden="true">{"\u2713"}</span>
                            : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>}
                        {/* Icon only on phones, to leave the address room. */}
                        <span aria-hidden="true" className="hidden sm:inline">{copied ? t("section_contact_copied") : t("section_contact_copy")}</span>
                    </button>}
                />
                <Channel href={GITHUB} external icon={githubIcon} title="GitHub" sub={shortUrl(GITHUB)} />
            </div>
        </div>
    </section>
}
