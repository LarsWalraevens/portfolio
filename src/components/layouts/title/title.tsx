interface TitleProps {
    children: any;
    className?: string;
    id?: string;
}

/** Section header: the oxblood diamond followed by a condensed display title. */
export default function Title(props: TitleProps) {
    return <div className={`flex items-center gap-4 ${props.className || ""}`}>
        <span className="diamond !w-[9px] !h-[9px]" aria-hidden="true" />
        <h2 id={props.id} className="font-display text-[clamp(2.5rem,5vw,4rem)] text-bone">{props.children}</h2>
    </div>
}
