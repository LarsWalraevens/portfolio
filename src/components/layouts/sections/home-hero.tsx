import { LW_PATH, LW_VIEWBOX } from '@/assets/icons/icons.jsx';
import useTranslation from 'next-translate/useTranslation';
import Link from "next/link";

export interface HomeSectionProps {
}

/** The "lw" mark as a faint fill with an oxblood line that traces its outline on a loop. */
const LogoTrace = (p: { className?: string }) => <svg viewBox={LW_VIEWBOX} fill="none" aria-hidden="true" className={`logo-trace block h-full w-auto ${p.className || ""}`}>
    <path d={LW_PATH} fillRule="evenodd" className="logo-trace-fill" />
    <path d={LW_PATH} pathLength={1} className="logo-trace-line" />
</svg>;

export default function HomeHeroSection(props: HomeSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');

    return <section id="hero" className="relative overflow-hidden">
        <div className="shell relative">
            <div className="relative grid lg:grid-cols-12 gap-x-8 max-lg:min-h-[max(520px,calc(88svh-72px))] lg:h-[min(780px,calc(100svh-72px))] lg:min-h-[640px]">

                {/* Brand panel (desktop): wide plate with a deep cut corner; the full "lw" mark is the visual
                    (nudged right of the headline overlap), so the looping trace always draws the complete logo. */}
                <div className="hidden lg:block lg:col-start-6 lg:col-span-7 lg:row-start-1 self-end h-[84%] mb-12 relative">
                    <div className="enter enter-delay chamfer [--chamfer:28px] absolute inset-0 bg-raised overflow-hidden">
                        <span
                            aria-hidden="true"
                            className="absolute inset-[6%]"
                            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(163, 32, 42, 0.26) 0%, rgba(163, 32, 42, 0) 100%)" }}
                        />
                        <span aria-hidden="true" className="absolute left-[56%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[78%]">
                            <LogoTrace />
                        </span>
                    </div>
                </div>

                {/* Type column overlaps onto the panel. */}
                <div className="lg:col-start-1 lg:col-span-8 lg:row-start-1 relative z-10 flex flex-col justify-center pt-10 pb-28 lg:py-0 pointer-events-none">
                    {/* Mobile watermark */}
                    <span aria-hidden="true" className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[440px] opacity-40">
                        <LogoTrace className="!w-full !h-auto" />
                    </span>

                    <div className="label text-faint mb-7 relative">
                        Lars Walraevens <span className="mx-2 text-line2" aria-hidden="true">/</span> <span className="text-bone">{t("hero_location_city")}</span>, {t("hero_location_country")}
                    </div>

                    <h1 className="font-display text-bone relative pointer-events-auto">
                        <span className="sr-only">Lars Walraevens. {t("hero_lars_is")} </span>
                        <span className="block overflow-hidden pb-[0.04em]">
                            <span className="rise block text-[clamp(3.1rem,8.6vw,8.2rem)] leading-[0.86]">Software</span>
                        </span>
                        {" "}
                        <span className="block overflow-hidden pb-[0.06em] -mt-[0.02em]">
                            <span className="rise rise-2 block text-[clamp(4rem,11vw,10.5rem)] leading-[0.86] whitespace-nowrap">
                                Developer
                            </span>
                        </span>
                    </h1>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 mt-10 relative pointer-events-auto">
                        <Link href="/#projects" className="btn btn-primary">{t("nav_projects")} <span aria-hidden="true">&rarr;</span></Link>
                        <Link href="/#about" className="btn">{t("nav_about")}</Link>
                    </div>

                </div>
            </div>
        </div>

    </section>
}
