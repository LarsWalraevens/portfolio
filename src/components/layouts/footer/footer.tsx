import { lwLogoIcon } from "@/assets/icons/icons";

export default function Footer() {
    return <footer className="bg-ink">
        <div className="shell flex items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4 text-sm text-muted">
                <span className="inline-flex h-6 text-bone">{lwLogoIcon}</span>
                <span className="text-line2" aria-hidden="true">/</span>
                <span>Lars Walraevens &copy; 2026</span>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="link-arrow label text-faint hover:text-bone">
                Top <span aria-hidden="true">↑</span>
            </a>
        </div>
    </footer>
}
