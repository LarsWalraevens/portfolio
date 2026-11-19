import useTranslation from "next-translate/useTranslation";
import { frontendAboutIcon, backendAboutIcon } from "./icons-about-section";

export default function SkillsSection() {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="skills">
            <p className="lead text-grey-100 text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.45] max-w-[40ch] lg:max-w-none" dangerouslySetInnerHTML={{ __html: t("section_about_skills_description") }}></p>
            <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-8 max-w-[560px]">
                <SkillItem
                    title={t("section_about_skills_web")}
                    icon={frontendAboutIcon}
                >
                    React, Next.js, TypeScript, Vite, Tailwind CSS, Playwright, ...
                </SkillItem>
                <SkillItem
                    title={t("section_about_skills_api")}
                    icon={backendAboutIcon}
                >
                    C#, .NET, Azure Functions, SQL Server, Azure OpenAI, Azure DevOps, ...
                </SkillItem>
            </div>
        </div>
    </>
}

interface SkillItemProps {
    icon: any;
    title: string;
    children: any;
}

function SkillItem(props: SkillItemProps) {
    return <div>
        <span className="block w-6 h-6 text-accent-hover [&_svg]:w-6 [&_svg]:h-6 mb-4">{props.icon}</span>
        <div className="label text-faint mb-2">{props.title}</div>
        <p className="text-muted text-[1rem] leading-relaxed">{props.children}</p>
    </div>
}
