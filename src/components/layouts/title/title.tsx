import { logoIcon } from "@/assets/icons/icons";

interface TitleProps {
    children: any;
    className?: string;
}

export default function Title(props: TitleProps) {
    return <>
        <h3 className={`${props.className}`}>
            <span className="mr-2 inline-block mb-[2px]">{logoIcon}</span>
            <span className="text-[1.5rem] uppercase font-semibold font-secondary">{props.children}</span>
        </h3>
    </>
}