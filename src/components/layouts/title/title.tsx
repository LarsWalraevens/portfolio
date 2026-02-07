import { logoIcon } from "@/assets/icons/icons";

interface TitleProps {
    children: any;
    className?: string;
    id?: string;
}

export default function Title(props: TitleProps) {
    return <>
        <h3 id={props.id || ""} className={`${props.className}`}>
            <span className="logo-icon mr-4 inline-block mb-[2px] scale-[140%]">{logoIcon}</span>
            <span className="text-[1.6rem] uppercase font-semibold font-secondary">{props.children}</span>
        </h3>
    </>
}