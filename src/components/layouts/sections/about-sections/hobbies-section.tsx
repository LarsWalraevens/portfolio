import { heroCodeIcon, heroDroneIcon, heroGamingIcon, heroHeadsetIcon, heroTennisIcon } from "@/assets/icons/icons";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef } from "react";
import { LOGO_PEEK_EVENT } from "@/components/layouts/header/logo-hobbies";

export default function HobbiesSection() {
    // # UTILS
    const { t } = useTranslation('common');
    const tapTimer = useRef(0);
    const peek = (on: boolean) => window.dispatchEvent(new CustomEvent(LOGO_PEEK_EVENT, { detail: on }));
    useEffect(() => () => window.clearTimeout(tapTimer.current), []);
    const hobbies = [
        { icon: heroGamingIcon, text: t("hero_tooltip_gaming") },
        { icon: heroDroneIcon, text: t("hero_tooltip_drone") },
        { icon: heroHeadsetIcon, text: t("hero_tooltip_music") },
        { icon: heroTennisIcon, text: t("hero_tooltip_tennis") },
        { icon: heroCodeIcon, text: t("hero_tooltip_code") },
    ];

    return <div id="hobbies">
        {/* Same scale as the lead lines of the other tabs: the hobbies are the content, not a sidebar list. */}
        <ul className="flex flex-col gap-5">
            {hobbies.map((hobby, i) => <li key={i} className="flex items-center gap-5">
                <span className="shrink-0 inline-flex items-center justify-center w-6 text-accent-hover [&_svg]:w-6 [&_svg]:h-6" aria-hidden="true">{hobby.icon}</span>
                <span className="text-grey-100 text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.35]">{hobby.text}</span>
            </li>)}
        </ul>
        {/* An invisible ::before pads the hit area (16px each side, 12px above and below) without moving the line.
            Plays the header logo's next hobby scene (and brings the header back if it's hidden):
            while hovered with a mouse, or for a few seconds per tap on touch screens. */}
        <button
            type="button"
            className="relative before:content-[''] before:absolute before:-inset-x-4 before:-inset-y-3 flex items-center gap-3 mt-9 label text-muted normal-case tracking-[0.04em] text-[0.8rem] text-left cursor-default w-fit transition-colors hover:text-bone"
            onPointerEnter={(e) => { if (e.pointerType === "mouse") peek(true) }}
            onPointerLeave={(e) => { if (e.pointerType === "mouse") peek(false) }}
            onClick={(e) => {
                if ((e.nativeEvent as PointerEvent).pointerType === "mouse") { return }
                peek(true);
                window.clearTimeout(tapTimer.current);
                tapTimer.current = window.setTimeout(() => peek(false), 3500);
            }}
        >
            <span aria-hidden="true" className="text-accent-hover text-base leading-none">&#8598;</span>
            <span className="[@media(hover:none)]:hidden">{t("section_about_hobbies_psst")}</span>
            <span className="hidden [@media(hover:none)]:inline">{t("section_about_hobbies_psst_tap")}</span>
        </button>
    </div>
}
