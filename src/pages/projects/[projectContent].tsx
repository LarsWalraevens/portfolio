import projects from '@/assets/data/projects.json';
import ProjectLayout from "@/components/layouts/project/project-layout";
import { ProjectDataItem } from "@/components/utils/types/types";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

const getProject = (code: string): ProjectDataItem | null =>
    (projects as unknown as Array<ProjectDataItem & { disabled?: boolean }>)
        .find((item) => !item.disabled && item.isPublic && item.code === code) || null;

export default function ProjectPage() {
    // # CLIENT STATES
    const [projectData, setProjectData] = useState<false | null | ProjectDataItem>(false);

    // # UTILS
    const router = useRouter();
    const projectCode = router.query.projectContent?.toString();
    const { t } = useTranslation('common');

    // Wait until the router query is available before resolving the project.
    useEffect(() => {
        if (!router.isReady) { return }
        setProjectData(projectCode ? getProject(projectCode) : null);
    }, [router.isReady, projectCode]);

    const projectImages: Array<ReactImageGalleryItem> =
        projectData && projectData.showcase.format === "images" ?
            Array.from({ length: projectData.showcase.amount || 0 }, (_, i) => ({
                original: `/img/${projectData.code}/${i + 1}.png`,
                originalAlt: `${projectData.name} — screenshot ${i + 1} / ${projectData.showcase.amount}`,
            })) :
            [];

    return <ProjectLayout data={projectData}>
        {
            !projectData ? null :
                <main>
                    <section id="project-head" className="shell pt-8 pb-6 lg:pt-14 lg:pb-12">
                        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 lg:gap-y-8">
                            <div data-reveal className="lg:col-span-7">
                                <div className="label text-faint flex items-center gap-3 mb-5">
                                    <span className="diamond" aria-hidden="true" />
                                    {t("nav_projects")}
                                </div>
                                <h1 className="font-display text-[clamp(3rem,7vw,6rem)] text-bone">{projectData.name}</h1>
                                <p className="text-muted mt-5 lg:mt-8 max-w-[68ch]" dangerouslySetInnerHTML={{ __html: t(projectData.description_short) }}></p>
                            </div>
                            <aside data-reveal data-reveal-delay="120" className="lg:col-span-4 lg:col-start-9 flex flex-col gap-5 lg:gap-8 lg:pt-2 self-start bg-surface chamfer [--chamfer:16px] p-5 lg:p-6">
                                <div className="relative h-12 lg:h-16 w-full max-w-[220px]">
                                    <Image
                                        fill
                                        className="object-contain object-left"
                                        sizes="220px"
                                        quality={100}
                                        alt={`${projectData.name} logo`}
                                        src={`/img/${projectData.code}/header.png`}
                                    />
                                </div>
                                <ul className="flex flex-wrap gap-2">
                                    {projectData.tags.map((tag) => <li key={tag} className="label !text-[0.68rem] text-muted bg-raised px-2.5 py-1.5">{tag}</li>)}
                                </ul>
                                {projectData.status.src &&
                                    <div>
                                        <a href={projectData.status.src} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                            {projectData.status.isLive ? t("main_see_live") : t("main_see_more")} <span aria-hidden="true">↗</span>
                                        </a>
                                    </div>
                                }
                            </aside>
                        </div>
                    </section>

                    <section id="project-showcase" className="shell pb-[clamp(64px,9vw,112px)]">
                        <div data-reveal className="lg:pt-6">
                            {
                                projectData.showcase.format === "images" ?
                                    <ImageGallery
                                        items={projectImages}
                                        showPlayButton={false}
                                    /> :
                                    projectData.showcase.format === "video" ?
                                        <iframe
                                            src={projectData.showcase.src}
                                            title={projectData.showcase.alt || projectData.name}
                                            className='w-full aspect-video bg-surface'
                                        /> :
                                        null
                            }
                        </div>
                    </section>
                </main>
        }
    </ProjectLayout>
}
