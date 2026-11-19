import projects from '@/assets/data/projects.json';
import { ProjectDataItem } from "@/components/utils/types/types";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import ProjectTeaser from "../project/project-teaser";
import { HomeSectionProps } from './home-hero';

export default function HomeProjectsSection(props: HomeSectionProps) {
    // # CLIENT STATES
    const [allProjects, setAllProjects] = useState<false | Array<ProjectDataItem>>(false)

    // # UTILS
    const { t } = useTranslation('common');

    useEffect(() => {
        setAllProjects(
            (projects as unknown as Array<ProjectDataItem>)
                .filter((x: any) => !x.disabled && x.isPublic)
                .sort((a, b) => a.sort > b.sort ? 1 : -1)
        );
    }, []);

    return <section id="projects" className="py-[clamp(64px,9vw,112px)]">
        <div className="shell">
            {/* Centered, stacked opener: the showcase gets the biggest section title on the page. */}
            <div className="flex flex-col items-center text-center mb-[clamp(48px,7vw,96px)]">
                <span className="diamond !w-[10px] !h-[10px] mr-3 mb-2" aria-hidden="true" />
                <h2 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9] text-bone">{t("section_projects_title")}</h2>
                <p className="text-muted text-[clamp(1.05rem,1.4vw,1.2rem)] max-w-[44ch] mt-6">{t("section_projects_description")}</p>
            </div>
            <div className="flex flex-col">
                {
                    !allProjects ? null :
                        allProjects.map((project, i) => <ProjectTeaser
                            key={project.code}
                            data={project}
                            index={i + 1}
                            total={allProjects.length}
                            flip={i % 2 === 1}
                        />)
                }
            </div>
        </div>
    </section>
}
