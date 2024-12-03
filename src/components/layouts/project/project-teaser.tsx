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
                className="relative group 
                w-full max-lg:w-full overflow-hidden h-[430px] max-lg:h-[300px] mb-5 max-lg:mb-4 border-[3px] border-white-200 rounded-md  cursor-pointer hover:border-blue-400">
                <div className="absolute z-10 flex flex-col bg-black-300 px-3 py-2 min-w-[250px] rounded
             top-4 right-4 max-lg:right-2 max-lg:bottom-2 max-lg:top-[unset] opacity-[72%] group-hover:!opacity-90">
                    <h4 className="font-secondary font-normal flex items-center relative">
                        {/* <span className="mr-2">{logoIcon}</span> */}
                        <span className="relative text-[1.2rem] font-semibold !opacity-1">
                            <span className="absolute bottom-[13%] left-[2%] !skew-x-[45deg] z-[-1] w-0 h-2 bg-blue-400/80 transition-all group-hover:w-full !opacity-1" />
                            {projectData.name}
                        </span>
                    </h4>
                    <hr className="my-1 border-grey-600 max-lg:hidden" />
                    <div className="flex items-center">
                        {
                            projectData.tags.length === 0 ? null :
                                projectData.tags.filter((x: any, i: number) => i <= 3).map((tag, i) => <Fragment key={i}>
                                    <div className="inline-block mr-2 font-secondary text-[0.9rem] text-grey-100 !opacity-1">
                                        <span className="font-semibold inline-block font-special mr-[2px] !opacity-1">#</span>
                                        {tag}
                                    </div>
                                </Fragment>)
                        }
                    </div>
                    <hr className="my-1 border-grey-600 max-lg:block hidden" />
                    <div className="underline hidden max-lg:inline-block text-grey-100 text-[14px]">
                        {t("main_see_more")}
                    </div>
                </div>
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
                    className="w-full h-full filter grayscale transition
                group-hover:grayscale-0 blur-[1.5px] group-hover:blur-none 
                max-lg:grayscale-0 max-lg:blur-none
                object-cover object-top"

                />
            </Link>
        }
    </>
}