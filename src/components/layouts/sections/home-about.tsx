import portrait from "@/assets/img/portrait.jpg";
import Title from "@/components/layouts/title/title";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react";
import MotivationSection from "./about-sections/motivation-section";
import HobbiesSection from "./about-sections/hobbies-section";
import OtherSection from "./about-sections/other-section";
import SkillsSection from './about-sections/skills-section';
import { HomeSectionProps } from './home-hero';
import { ToolsGrid } from './home-tools';

export interface AboutSectionProps {
    key: number;
    title: string;
}

export default function HomeAboutSection(props: HomeSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;
    const optionsData: Array<AboutSectionProps> = [
        { key: 1, title: t("section_about_option_skills") },
        { key: 3, title: t("section_about_option_others") },
        { key: 2, title: t("section_about_option_motivation") },
        { key: 4, title: t("section_about_option_hobbies") },
    ];

    // # CLIENT STATES
    const [activeKey, setActiveKey] = useState<number>(1);
    const activeSection = optionsData.find((x) => x.key === activeKey) || optionsData[0];
    const goTo = (key: number) => setActiveKey(key);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const scrollerRef = useRef<HTMLDivElement>(null);

    // Mouse/pen drag-to-scroll for the mobile tab row (touch already swipes natively).
    // A drag longer than a few pixels swallows the click so it doesn't switch tabs.
    const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
    const onDragStart = (e: PointerEvent<HTMLDivElement>) => {
        const el = scrollerRef.current;
        if (!el || e.pointerType === "touch" || el.scrollWidth <= el.clientWidth) { return }
        drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    };
    const onDragMove = (e: PointerEvent<HTMLDivElement>) => {
        const el = scrollerRef.current;
        if (!el || !drag.current.active) { return }
        const dx = e.clientX - drag.current.startX;
        if (!drag.current.moved && Math.abs(dx) > 4) {
            drag.current.moved = true;
            el.setPointerCapture(e.pointerId);
        }
        if (drag.current.moved) { el.scrollLeft = drag.current.startLeft - dx; }
    };
    const onDragEnd = (e: PointerEvent<HTMLDivElement>) => {
        drag.current.active = false;
        scrollerRef.current?.hasPointerCapture(e.pointerId) && scrollerRef.current.releasePointerCapture(e.pointerId);
    };

    // Position of the sliding diamond: just left of the active tab's label, vertically centred.
    const [marker, setMarker] = useState({ left: 0, top: 0, ready: false });
    useEffect(() => {
        const place = () => {
            const index = optionsData.findIndex((x) => x.key === activeKey);
            const el = tabRefs.current[index];
            if (!el) { return }
            setMarker({ left: el.offsetLeft + 4, top: el.offsetTop + el.offsetHeight / 2, ready: true });
            // Mobile row: keep the active tab in view (horizontal only, never scrolls the page).
            const scroller = scrollerRef.current;
            if (scroller && scroller.scrollWidth > scroller.clientWidth) {
                scroller.scrollTo({ left: el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
            }
        };
        place();
        // Fonts change the label metrics once they load.
        document.fonts?.ready.then(place);
        window.addEventListener("resize", place);
        return () => window.removeEventListener("resize", place);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, locale]);

    // Left/right (and up/down) arrows move between tabs, Home/End jump to the ends.
    const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const last = optionsData.length - 1;
        const next =
            e.key === "ArrowRight" || e.key === "ArrowDown" ? (i === last ? 0 : i + 1) :
                e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i === 0 ? last : i - 1) :
                    e.key === "Home" ? 0 :
                        e.key === "End" ? last : null;
        if (next === null) { return }
        e.preventDefault();
        goTo(optionsData[next].key);
        tabRefs.current[next]?.focus();
    };

    // Previous / next controls in the panel header (wrap around).
    const activeIndex = optionsData.findIndex((x) => x.key === activeSection.key);
    const step = (delta: number) => {
        const index = (activeIndex + delta + optionsData.length) % optionsData.length;
        goTo(optionsData[index].key);
    };

    const content = activeSection.key === 1 ?
        <SkillsSection /> :
        activeSection.key === 2 ?
            <MotivationSection /> :
            activeSection.key === 3 ?
                <OtherSection /> :
                <HobbiesSection />;

    const resumeHref = locale === "nl" ? process.env.NEXT_PUBLIC_RESUME_NL : process.env.NEXT_PUBLIC_RESUME_EN;

    return <section id="about" className="bg-surface py-[clamp(72px,10vw,128px)] [--btn-fill:var(--surface)]">
        <div className="shell grid lg:grid-cols-12 gap-x-8 gap-y-10">
            {/* LEFT: title + tab list */}
            <div className="min-w-0 lg:col-span-4 lg:row-start-1">
                <Title>{t("section_about_title")}</Title>

                {/* Mobile: one swipeable row so the panel (the focus) starts right below it. Desktop: vertical list. */}
                <div
                    ref={scrollerRef}
                    onPointerDown={onDragStart}
                    onPointerMove={onDragMove}
                    onPointerUp={onDragEnd}
                    onPointerCancel={onDragEnd}
                    onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } }}
                    onDragStart={(e) => e.preventDefault()}
                    className="tab-scroller mt-6 lg:mt-10 max-lg:-mx-[clamp(20px,4vw,48px)] max-lg:overflow-x-auto max-lg:cursor-grab max-lg:active:cursor-grabbing max-lg:select-none"
                >
                <div role="tablist" aria-label={t("section_about_title")} className="relative flex lg:flex-col lg:gap-2 max-lg:w-max max-lg:gap-x-5 max-lg:px-[clamp(20px,4vw,48px)]">
                    {/* Sliding marker: the oxblood diamond moves to the active tab. */}
                    <span
                        aria-hidden="true"
                        className="diamond !w-[10px] !h-[10px] absolute transition-[left,top] duration-300 ease-out"
                        style={{ left: marker.left, top: marker.top, opacity: marker.ready ? 1 : 0, transform: "translateY(-50%) rotate(45deg)" }}
                    />
                    {optionsData.map((section, i) => {
                        const active = section.key === activeSection.key;
                        return <button
                            key={section.key}
                            ref={(el) => { tabRefs.current[i] = el; }}
                            id={`about-tab-${section.key}`}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-controls="about-panel"
                            tabIndex={active ? 0 : -1}
                            onClick={() => goTo(section.key)}
                            onKeyDown={(e) => onTabKeyDown(e, i)}
                            className={`group relative text-left pl-5 lg:pl-7 py-1.5 max-lg:min-h-[44px] max-lg:flex max-lg:items-center max-lg:whitespace-nowrap font-display tab-word text-[1.35rem] lg:text-[clamp(1.5rem,2.3vw,2.1rem)] transition-[color,transform] duration-300 ease-out
                                ${active ? "text-bone lg:translate-x-1" : "text-faint hover:text-muted"}`}
                        >
                            {section.title}
                        </button>;
                    })}
                </div>
                </div>
            </div>

            {/* RIGHT: active panel, set straight on the section (no card). Each panel opens with a
                large lead line; the step markers and arrows sit underneath as their own row. */}
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 self-start flex flex-col">
                <div role="tabpanel" id="about-panel" aria-labelledby={`about-tab-${activeSection.key}`} tabIndex={0}>
                    <div key={activeSection.key} className="fadeIn">
                        {content}
                    </div>
                </div>
                <div className="max-lg:hidden flex items-center gap-5 mt-10">
                    <div className="flex items-center gap-1 -ml-3">
                        <button type="button" onClick={() => step(-1)} aria-label={t("main_back")} className="flex items-center justify-center w-11 h-11 text-muted hover:text-bone transition-colors">
                            <span aria-hidden="true">&larr;</span>
                        </button>
                        <button type="button" onClick={() => step(1)} aria-label={t("main_next")} className="flex items-center justify-center w-11 h-11 text-muted hover:text-bone transition-colors">
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2.5" aria-hidden="true">
                        {optionsData.map((section) => <span
                            key={section.key}
                            className={`inline-block w-[7px] h-[7px] rotate-45 transition-colors duration-300 ${section.key === activeSection.key ? "bg-accent-hover" : "bg-line2"}`}
                        />)}
                    </div>
                </div>
            </div>

            {/* Resume card: under the tabs on desktop; after the active panel on mobile so a tab tap shows its content right away. */}
            <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2 self-start chamfer [--chamfer:16px] bg-raised p-6 [--btn-fill:var(--raised)]">
                <div className="flex items-center gap-4">
                    <span className="group/portrait chamfer [--chamfer:8px] relative shrink-0 w-16 h-16 overflow-hidden bg-ink">
                        <Image src={portrait} alt="Lars Walraevens" fill sizes="64px" quality={90} className="object-cover lg:grayscale contrast-[1.05] transition duration-300 group-hover/portrait:grayscale-0" />
                    </span>
                    <p className="text-bone text-[1.1rem] font-medium leading-snug">{t("section_about_resume_description")}</p>
                </div>
                <a href={resumeHref} rel='noopener noreferrer' target="_blank" className="btn btn-primary w-full mt-5">
                    {t("main_my_resume")} <span aria-hidden="true">↗</span>
                </a>
            </div>
            {/* Tools: part of "about", closing the section. */}
            <div className="lg:col-span-12 lg:row-start-3 mt-[clamp(32px,6vw,80px)]">
                <h3 className="label text-faint mb-5">{t("section_tools_title")}</h3>
                <ToolsGrid />
            </div>
        </div>
    </section>
}
