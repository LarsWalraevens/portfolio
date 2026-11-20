import { useAppStore } from "@/components/utils/appStore";
import { ProjectDataItem } from "@/components/utils/types/types";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";

interface ProjectTeaserProps {
    data: ProjectDataItem;
    index: number;
    total: number;
    /** Put the image on the right (alternating rows). */
    flip?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function ProjectTeaser(props: ProjectTeaserProps) {
    // # STORE
    const appStore = useAppStore();

    // # UTILS
    const { t } = useTranslation("common");
    const project = props.data;
    const description = t(project.description_short);
    const words = description.split(" ");
    const excerpt = words.length > 40 ? words.slice(0, 40).join(" ") + "…" : description;

    return <Link
        href={`/projects/${project.code}`}
        id={`project-${project.code}`}
        onClick={() => appStore.setDisabledFade(true)}
        className="group grid lg:grid-cols-12 gap-x-10 gap-y-4 lg:gap-y-6 items-center pt-12 pb-6 lg:py-[clamp(36px,6vw,80px)] first:pt-0"
    >
        {/* Phones: each project opens with a numbered rule so the start of the next one is unmistakable. */}
        <div data-reveal className="lg:hidden flex items-center gap-3 -mb-1" aria-hidden="true">
            <span className="diamond" />
            <span className="label text-faint"><span className="text-bone">{pad(props.index)}</span> / {pad(props.total)}</span>
            <span className="h-px flex-1 bg-line2" />
        </div>
        <div data-reveal className={`lg:col-span-7 ${props.flip ? "lg:order-2" : ""}`}>
            <div className="chamfer chamfer-hover relative overflow-hidden bg-raised aspect-[16/9] [--chamfer:14px] group-hover:[--chamfer:28px]">
                <Image
                    quality={100}
                    src={`/img/${project.code}/teaser.png`}
                    fill
                    sizes="(min-width: 1024px) 720px, 100vw"
                    alt={`${project.name} preview`}
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-ink/10 transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true" />
            </div>
        </div>

        <div data-reveal data-reveal-delay="140" className={`lg:col-span-5 ${props.flip ? "lg:order-1" : ""}`}>
            <div className="max-lg:sr-only label text-faint mb-2 lg:mb-4">
                <span className="text-bone">{pad(props.index)}</span> / {pad(props.total)}
            </div>
            <h3 className="font-display text-[clamp(2rem,4vw,3.25rem)] text-bone">
                <span className="relative inline-block">
                    {project.name}
                    <span className="absolute left-0 -bottom-1 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-active:scale-x-100" aria-hidden="true" />
                </span>
            </h3>
            {project.tags.length > 0 &&
                <ul className="flex flex-wrap gap-2 mt-3 lg:mt-5">
                    {project.tags.slice(0, 4).map((tag) => <li key={tag} className="label !text-[0.68rem] text-muted bg-raised px-2.5 py-1.5">{tag}</li>)}
                </ul>
            }
            <p className="text-muted mt-3 lg:mt-5 max-w-[52ch] clamp-3-mobile">{excerpt}</p>
            <span className="link-arrow label mt-4 lg:mt-6 text-bone">
                {t("main_see_more")} <span className="arrow" aria-hidden="true">&rarr;</span>
            </span>
        </div>
    </Link>
}
