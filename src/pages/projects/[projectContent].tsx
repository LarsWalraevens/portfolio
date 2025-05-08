import projects from '@/assets/data/projects.json';
import { rightSideEffectIcon } from '@/assets/icons/icons';
import ProjectLayout from "@/components/layouts/project/project-layout";
import { ProjectDataItem } from "@/components/utils/types/types";
import produce from 'immer';
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

export default function ProjectPage() {
    // # CLIENT STATES
    const [projectData, setProjectData] = useState<false | null | ProjectDataItem>(false);
    const [projectImages, setProjectImages] = useState<Array<ReactImageGalleryItem>>([])

    // # UTILS
    const router = useRouter();
    const { query } = router
    const projectCode = query.projectContent!.toString()
    const { t } = useTranslation('common');
    const getProject = (name: string) => projects.filter((item, i) => item.code === name && item.isPublic);

    useEffect(() => {
        setProjectData(projectCode ? getProject(projectCode).length === 0 ? null : getProject(projectCode)[0] : null)
    }, [])

    useEffect(() => {
        if (!projectData) { return }
        if (projectData.showcase.format === "images") {
            for (let index = 1; index <= projectData.showcase.amount!; index++) {
                setProjectImages(produce(draft => {
                    draft.push({ original: `/img/${projectData.code}/${index}.png` });
                }))
            }
        }
    }, [projectData])

    return <>
        <ProjectLayout
            data={projectData}
        >
            {
                !projectData ? null :
                    <>
                        <main>
                            <h1 className="hidden">{projectData.name}</h1>
                            <section id="project-head" className="container container-sm wrapper mx-auto mb-10 max-lg:mt-5">
                                <div className="max-h-[400px] mb-7 relative min-w-[120px] min-h-[80px] ">
                                    <Image
                                        layout="fill" objectFit="contain"
                                        sizes='contain'
                                        quality={100}
                                        alt={projectData.code + "-header-image"}
                                        src={`/img/${projectData.code}/header.png`}
                                    />
                                </div>
                                <div className="flex justify-center w-full">
                                    <p className="text-grey-100 text-left mb-3 max-w-[900px]" dangerouslySetInnerHTML={{ __html: t(projectData.description_short) }}></p>
                                </div>
                                <div className="flex items-center justify-center flex-wrap mb-6 gap-3">
                                    {
                                        (projectData.tags).map((tag: string, i: number) => {
                                            return <Fragment key={i}>
                                                <div>
                                                    <span className="text-medium font-semibold mr-[2px]">#</span>
                                                    <span className="text-medium font-secondary">{tag}</span>
                                                </div>
                                            </Fragment>
                                        })
                                    }
                                </div>
                                {
                                    !projectData.status.isLive ?
                                        <div className="flex justify-center">
                                            <a href={projectData.status.src} target="_blank" className="btn inline-block">{t("main_see_more")}</a>
                                        </div>
                                        :
                                        <div className="flex justify-center">
                                            <a href={projectData.status.src} target="_blank" className="btn inline-block">{t("main_see_live")}</a>
                                        </div>
                                }
                            </section>
                            <section id="project-showcase" className='mt-[8vh] mb-[10vh] max-lg:mt-[3vh] max-lg:mb-[10vh] inline-block w-full relative'>
                                {
                                    projectData.showcase.format === "images" && <>
                                        <span className="absolute right-[20vw] top-[5%] ">{rightSideEffectIcon}</span>
                                        <span className="absolute left-[20vw] bottom-[5%] rotate-[-170deg] ">{rightSideEffectIcon}</span>
                                    </>
                                }
                                <div className="container container-sm wrapper mx-auto">
                                    <div className="flex justify-center">
                                        {
                                            projectData.showcase.format === "images" ?
                                                <ImageGallery
                                                    items={projectImages}
                                                    autoPlay={true}
                                                    slideInterval={5000}
                                                /> :
                                                projectData.showcase.format === "video" ?
                                                    <iframe
                                                        src={projectData.showcase.src}
                                                        className='w-full h-full max-w-full aspect-video min-h-[400px] max-lg:h-auto'
                                                    /> :
                                                    null
                                        }
                                    </div>
                                </div>
                            </section>

                        </main>
                    </>
            }
        </ProjectLayout>
    </>
}