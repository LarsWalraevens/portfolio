import { logoIcon } from "@/assets/icons/icons";
import { ProjectDataItem } from "@/components/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

interface ProjectTeaserProps {
    data: ProjectDataItem;
}

export default function ProjectTeaser(props: ProjectTeaserProps) {

    // # CLIENT STATES
    const [projectData, setProjectData] = useState<false | ProjectDataItem>(false); // fix: nextjs render not equal to dom render - so put in state and use useEffect 

    useEffect(() => {
        setProjectData(props.data)
    }, [props.data])
    return <>
        {
            !projectData ? null :
                <Link href={`/projects/${projectData.code}`} className="relative group w-[49%] max-lg:w-full h-[300px] my-1 mx-1 max-lg:mb-4 border-2 border-white-200 rounded-md  
        hover:border-blue-400 cursor-pointer hover:shadow-white-100/20 
        ">
                    <div className="absolute z-10 flex flex-col bg-black-300 rounded-sm px-3 py-2 border-2 border-grey-600 min-w-[250px] 
             bottom-4 right-5">
                        <h4 className="text-[1.1rem] font-secondary font-normal flex items-center"> <span className="mr-2">{logoIcon}</span> {projectData.name}</h4>
                        <div className="flex items-center">
                            {
                                projectData.tags.length === 0 ? null :
                                    projectData.tags.map((tag, i) => <Fragment key={i}>
                                        <div className="inline-block mr-2 font-secondary text-[0.9rem] text-grey-100">
                                            <span className="font-semibold inline-block font-special mr-[2px]">#</span>
                                            {tag}
                                        </div>
                                    </Fragment>)
                            }
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
                        className="rounded w-full h-full filter grayscale transition
                group-hover:grayscale-0 blur-[1.5px] group-hover:blur-none 
                max-lg:grayscale-0 max-lg:blur-none
                object-cover object-top" />
                </Link>
        }
    </>
}