import { logoIcon } from "@/assets/icons/icons";

interface TitleProps {
    children: any;
    className?: string;
}

export default function Title(props: TitleProps) {
    return <>
        <h3 className={`text-[25px] uppercase font-semibold font-secondary flex items-center ${props.className}`}><span className="mr-2">{logoIcon}</span>{props.children}</h3>
    </>
}