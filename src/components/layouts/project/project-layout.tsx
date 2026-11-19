import { handleSeoTags } from "@/components/utils/myMethods";
import { ProjectDataItem } from "@/components/utils/types/types";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Link from "next/link";
import NotFound from "../not-found/not-found";
import ContactSection from "../sections/contact";

interface ProjectLayoutProps {
    data: ProjectDataItem | false | null;
    children: any;
}

export default function ProjectLayout(props: ProjectLayoutProps) {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <Head>
            {
                !props.data ? handleSeoTags("title", t("seo_title")) :
                    handleSeoTags("title", `Lars Walraevens - ${props.data.name}`)
            }
            {
                handleSeoTags("description", t("seo_description"))
            }
        </Head>
        <div className="min-h-[50vh]">
            <div className="shell pt-10 max-lg:pt-6">
                <Link href={props.data ? `/#project-${props.data.code}` : "/#projects"} className="link-arrow label text-muted hover:text-bone">
                    <span className="arrow inline-block rotate-180" aria-hidden="true">&rarr;</span>
                    {t("main_back")}
                </Link>
            </div>
            {
                props.data === null ? <div className="min-h-[60vh]"><NotFound /></div> :
                    !props.data ? <div className="flex justify-center py-20" role="status" aria-label="Loading">
                        <span className="diamond animate-spin !w-3 !h-3" aria-hidden="true" />
                    </div> :
                        props.children
            }
        </div>

        <ContactSection />
    </>
}