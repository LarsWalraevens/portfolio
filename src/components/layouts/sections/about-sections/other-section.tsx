import useTranslation from "next-translate/useTranslation";

export default function OtherSection() {
    // # UTILS
    const { t } = useTranslation('common');

    return <>
        <div id="other">
            <div>
                <p className="lead text-grey-100 text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.45] max-w-[40ch] lg:max-w-none" dangerouslySetInnerHTML={{ __html: t("section_about_other_description1") }}></p>
                <ul className="mt-10 flex flex-wrap gap-2">
                    <li className="label text-bone bg-raised px-3 py-2">T3 Code</li>
                    <li className="label text-bone bg-raised px-3 py-2">Claude Code</li>
                    <li className="label text-bone bg-raised px-3 py-2">Codex</li>
                    <li className="label text-bone bg-raised px-3 py-2">TanStack Query</li>
                    <li className="label text-bone bg-raised px-3 py-2">shadcn/ui</li>
                    <li className="label text-bone bg-raised px-3 py-2">Jotai</li>
                    <li className="label text-bone bg-raised px-3 py-2">Zod</li>
                </ul>
                <div className="mt-8 flex flex-col items-start gap-5">
                    <a href="https://github.com/LarsWalraevens/dotfiles" target="_blank" rel="noopener noreferrer" className="link-arrow label text-muted hover:text-bone">
                        {t("section_about_other_dotfiles")} <span className="arrow" aria-hidden="true">↗</span>
                    </a>
                    <a href="https://github.com/LarsWalraevens/util-library" target="_blank" rel="noopener noreferrer" className="link-arrow label text-muted hover:text-bone">
                        {t("section_about_other_utils")} <span className="arrow" aria-hidden="true">↗</span>
                    </a>
                </div>
            </div>

        </div>
    </>
}