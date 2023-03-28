import projects from '@/assets/data/projects.json';
import Title from "@/components/layouts/title/title";
import { ProjectDataItem } from "@/components/utils/types/types";
import useTranslation from "next-translate/useTranslation";
import { Fragment, useEffect, useState } from "react";
import ProjectTeaser from "../project/project-teaser";
import { HomeSectionProps } from './home-hero';

export default function HomeProjectsSection(props: HomeSectionProps) {
    // # CLIENT STATES
    const [allProjects, setAllProjects] = useState<false | Array<ProjectDataItem>>(false)

    // # UTILS
    const { t } = useTranslation('common');

    useEffect(() => {
        setAllProjects(projects);
    }, [projects]);

    return <>
        <section id="projects" className="py-[100px] max-lg:py-20 relative">
            <div className="container container-sm wrapper mx-auto relative">
                <Title className="mb-2">{t("section_projects_title")}</Title>
                <p className="text-grey-100">{t("section_projects_description")}</p>
                <div className="mb-5 mt-7 flex flex-row items-center justify-start flex-wrap max-lg:flex-wrap">
                    {
                        !allProjects ? null :
                            (allProjects.sort((a: ProjectDataItem, b: ProjectDataItem) => a.sort > b.sort ? 1 : -1)).map((project: ProjectDataItem, i: number) => !project.isPublic ? null : <Fragment key={i}>
                                <ProjectTeaser data={project} />
                            </Fragment>)
                    }
                    {/* <div className="w-1/2 max-lg:w-full min-h-[80px] flex items-center justify-center text-xl h-full">MORE SOON...</div> */}
                </div>
                <div className="flex justify-center pt-3">
                    {endIcon}
                </div>
            </div>
        </section>
    </>
}

export const endIcon = <svg width="10" height="95" viewBox="0 0 10 95" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" width="70" height="1.99998" rx="0.999992" transform="rotate(90 6 0)" fill="white" />
    <rect x="9.8938" y="85.2363" width="12.2431" height="1.74901" rx="0.874505" transform="rotate(135 9.8938 85.2363)" fill="white" />
    <rect width="12.2431" height="1.74901" rx="0.874505" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 9.8938 92.792)" fill="white" />
</svg>;