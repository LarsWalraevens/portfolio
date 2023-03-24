import { logoIcon } from "@/assets/icons/icons";
import Image from "next/image";
import { Fragment } from "react";

interface ProjectTeaserProps {
    image: any;
    name: string;
    tags: Array<string>;
}

export default function ProjectTeaser(props: ProjectTeaserProps) {
    return <>
        <div className="relative group w-1/2 max-lg:w-full mx-2 my-2 border-2 border-grey-400 rounded-md cursor-pointer hover:shadow-lg hover:shadow-white-100/20">
            <div className="absolute flex flex-col bottom-4 right-5 bg-black-300 rounded-sm px-3 py-2 border-2 border-grey-600 min-w-[250px] transition">
                <h4 className="text-[18px] font-secondary font-normal flex items-center"> <span className="mr-2">{logoIcon}</span> {props.name}</h4>
                <div className="flex items-center">
                    {
                        props.tags.length === 0 ? null :
                            props.tags.map((tag, i) => <Fragment key={i}>
                                <div className="inline-block mr-2 font-secondary">
                                    <span className="font-semibold inline-block font-secondary">#</span>
                                    {tag}
                                </div>
                            </Fragment>)
                    }
                </div>
            </div>
            <Image src={props.image} alt="autinoom-teaser" className="rounded" />
        </div>
    </>
}