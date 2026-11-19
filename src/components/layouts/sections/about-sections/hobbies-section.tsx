import { heroCodeIcon, heroDroneIcon, heroGamingIcon, heroHeadsetIcon, heroTennisIcon } from "@/assets/icons/icons";
import useTranslation from "next-translate/useTranslation";

export default function HobbiesSection() {
    // # UTILS
    const { t } = useTranslation('common');
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
    </div>
}
