import { useAppStore } from "@/components/utils/appStore";
import { ProjectDataItem } from "@/components/utils/types/types";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
interface ProjectTeaserProps {
    data: ProjectDataItem;
}

export default function ProjectTeaser(props: ProjectTeaserProps) {
    // # STORE
    const appStore = useAppStore();

    // # CLIENT STATES
    const [projectData, setProjectData] = useState<false | ProjectDataItem>(false); // fix: nextjs render not equal to dom render - so put in state and use useEffect 

    // # UTILS
    const { t } = useTranslation("common")

    useEffect(() => {
        setProjectData(props.data)
    }, [props.data])
    return <>
        {
            !projectData ? null : <Link href={`/projects/${projectData.code}`}
                id={`project-${projectData.code}`}
                onClick={() => appStore.setDisabledFade(true)}
                className="relative project-teaser group 
                w-full max-lg:w-full max-lg:bg-black-300 lg:overflow-hidden flex flex-row max-lg:flex-col gap-x-8 max-lg:border max-md:border-x-[0px] border-white-100/20 items-center justify-center  md:rounded-md cursor-pointer">
               
                <Image
                    quality={100}
                    src={`/img/${projectData.code}/teaser.png`}
                    sizes="fill"
                    width={100}
                    height={100}
                    priority
                    alt={`${projectData.name.trim().toLowerCase()}-image`}
                    // className="w-full h-auto object-cover transition-transform group-hover:duration-[3500ms] group-hover:delay-[700ms] delay-300 duration-[1300ms] 
                    // transform translate-y-0 group-hover:translate-y-[-23%] 
                    // filter grayscale group-hover:grayscale-0 blur-[1.5px] group-hover:blur-none max-lg:grayscale-0 max-lg:blur-none
                    // " 
                    className="w-3/5 max-lg:w-full h-[420px] max-lg:h-[300px] transition rounded object-cover object-top max-lg:rounded-b-none max-md:rounded-none lg:border-4 border-white-200 group-hover:border-blue-400"

                />
                     <div className="w-2/5 max-lg:w-full max-lg:px-4 max-lg:py-5 z-10 flex flex-col py-2 min-w-[250px] rounded max-lg:right-2 max-lg:bottom-2 max-lg:top-[unset] ">
                    <h4 className="font-secondary font-normal flex items-center relative leading-tight mb-0.5">
                        {/* <span className="mr-2">{logoIcon}</span> */}
                        <span className="relative lg:text-3xl text-2xl font-semibold !opacity-1">
                            <span className="absolute bottom-[13%] left-[2%] !skew-x-[45deg] z-[-1] w-0 max-lg:w-full h-2 bg-blue-400/80 transition-all group-hover:w-full !opacity-1" />
                            {projectData.name}
                        </span>
                    </h4>
                    {/* <hr className="my-1 border-grey-600 max-lg:hidden" /> */}
                    <div className="flex items-center flex-wrap gap-2 gap-y-1 mb-3">
                        {
                            projectData.tags.length === 0 ? null :
                                projectData.tags.filter((x: any, i: number) => i <= 3).map((tag, i) => <Fragment key={i}>
                                    <div className="inline-block font-secondary text-base text-grey-100 !opacity-1">
                                        <span className="font-semibold inline-block font-special mr-[2px] !opacity-1">#</span>
                                        {tag}
                                    </div>
                                </Fragment>)
                        }
                    </div>
                    <p className="max-lg:inline-block text-grey-100 text-base mb-3">
                        {t(projectData.description_short).split(" ").length >20 ? t(projectData.description_short).split(" ").slice(0, 20).join(" ") + "..." : t(projectData.description_short)}
                    </p>
                     <div className="underline  inline-block text-grey-100 group-hover:text-white-100 text-base">
                        {t("main_see_more")}
                    </div>
                </div>
            </Link>
        }
    </>
}