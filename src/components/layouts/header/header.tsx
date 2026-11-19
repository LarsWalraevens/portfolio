import { githubIcon, linkedInIcon, lwLogoIcon, mailIcon } from '@/assets/icons/icons';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
    // # CLIENT STATES
    const [showMenu, setShowMenu] = useState(false);

    // # UTILS
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;
    const resumeHref = locale === "nl" ? process.env.NEXT_PUBLIC_RESUME_NL : process.env.NEXT_PUBLIC_RESUME_EN;

    const changeLang = (newLang: "nl" | "en") => {
        if (newLang === lang) { return }
        router.push(router.asPath.split("#")[0], router.asPath.split("#")[0], { locale: newLang });
    }

    // Mobile menu is a native modal <dialog>: background is inert, Escape closes it,
    // focus starts on the close button and returns to the menu button afterwards.
    const dialogRef = useRef<HTMLDialogElement>(null);
    // Section picked in the mobile menu; its heading receives focus after the menu closes.
    const pendingFocusId = useRef<string | null>(null);

    const focusSectionHeading = (id: string) => {
        const started = Date.now();
        const tryFocus = () => {
            const heading = document.querySelector<HTMLElement>(`#${id} h2`);
            if (heading) {
                heading.setAttribute("tabindex", "-1");
                heading.focus({ preventScroll: true });
                return;
            }
            // The section may still be loading (e.g. navigating home from a project page).
            if (Date.now() - started < 2000) { window.setTimeout(tryFocus, 100); }
        };
        window.setTimeout(tryFocus, 150);
    };
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) { return }
        if (showMenu && !dialog.open) {
            dialog.showModal();
            closeButtonRef.current?.focus();
            document.body.style.overflow = "hidden";
        } else if (!showMenu && dialog.open) {
            dialog.close();
        }
        if (!showMenu) {
            document.body.style.overflow = "";
        }
    }, [showMenu]);

    // The menu is mobile-only: close it if the viewport grows to the desktop layout,
    // otherwise the (hidden) modal would keep the page inert.
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const onChange = (e: MediaQueryListEvent) => { if (e.matches) { setShowMenu(false); } };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // Close the menu after navigating (e.g. language switch).
    useEffect(() => {
        const close = () => setShowMenu(false);
        router.events.on("routeChangeStart", close);
        return () => router.events.off("routeChangeStart", close);
    }, [router.events]);

    const navItems = [
        { id: "about", href: "/#about", label: t("nav_about"), number: "01" },
        { id: "projects", href: "/#projects", label: t("nav_projects"), number: "02" },
        { id: "contact", href: "/#contact", label: t("nav_contact"), number: "03" },
    ];

    // Transparent over the hero. Once scrolled, the bar hides while scrolling down and
    // slides back in as soon as the visitor scrolls up.
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 8);
            if (Math.abs(y - lastY) > 6) {
                setHidden(y > lastY && y > 160);
                lastY = y;
            }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Highlight the section in view (home); project pages highlight "Projects".
    const [activeId, setActiveId] = useState<string | null>(null);
    useEffect(() => {
        if (router.pathname.startsWith("/projects")) { setActiveId("projects"); return }
        if (router.pathname !== "/") { setActiveId(null); return }
        const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
        if (sections.length === 0) { return }
        const visible = new Map<string, boolean>();
        // At the very bottom the last section (Contact) can be too short to reach the
        // observer band, so the bottom of the page always selects it.
        const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const update = () => {
            if (atBottom()) { setActiveId(navItems[navItems.length - 1].id); return }
            const current = navItems.find((item) => visible.get(item.id));
            setActiveId(current ? current.id : null);
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
            update();
        }, { rootMargin: "-40% 0px -55% 0px" });
        sections.forEach((section) => observer.observe(section));
        window.addEventListener("scroll", update, { passive: true });
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", update);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.pathname, lang]);

    const NavMarker = (p: { active: boolean, number: string }) => p.active ?
        <span className="diamond pop" aria-hidden="true" /> :
        <span className="label !text-[0.68rem] text-faint" aria-hidden="true">{p.number}</span>;

    const LangSwitch = (p: { large?: boolean }) => <div className="label flex items-center gap-2" role="group" aria-label="Language">
        {(["en", "nl"] as const).map((code, i) => <span key={code} className="flex items-center gap-2">
            {i > 0 && <span className="text-line2" aria-hidden="true">/</span>}
            <button
                type="button"
                onClick={() => changeLang(code)}
                aria-current={lang === code ? "true" : undefined}
                className={`transition-colors ${p.large ? "inline-flex items-center justify-center min-h-[44px] min-w-[44px]" : ""} ${lang === code ? "text-bone cursor-default" : "text-faint hover:text-bone"}`}
            >
                {code.toUpperCase()}
            </button>
        </span>)}
    </div>;

    return <>
        <header className={`sticky top-0 z-40 transition-[transform,background-color,backdrop-filter] duration-300 ease-out focus-within:translate-y-0 ${hidden && !showMenu ? "translate-y-0 lg:-translate-y-full" : "translate-y-0"} ${scrolled ? "bg-ink/70 backdrop-blur-md" : "bg-transparent"}`}>
            <div className="shell h-[72px] flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
                <Link href="/" aria-label="Home" className="flex h-9 items-center justify-self-start text-bone transition-opacity hover:opacity-70">
                    {lwLogoIcon}
                </Link>

                <nav aria-label="Main" className="max-lg:hidden flex items-center gap-2">
                    {navItems.map((item) => {
                        const active = activeId === item.id;
                        return <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "location" : undefined}
                            className={`flex items-center gap-2.5 h-10 px-3 text-[0.9375rem] font-medium transition-colors ${active ? "text-bone" : "text-muted hover:text-bone"}`}
                        >
                            <span className="w-5 flex justify-center"><NavMarker active={active} number={item.number} /></span>
                            {item.label}
                        </Link>;
                    })}
                </nav>

                <div className="max-lg:hidden flex items-center justify-self-end gap-10">
                    <LangSwitch />
                    <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">{t("nav_resume")} <span aria-hidden="true">↗</span></a>
                </div>

                <button
                    ref={menuButtonRef}
                    type="button"
                    className="lg:hidden label flex items-center gap-3 h-11 px-4 bg-surface text-bone chamfer [--chamfer:7px]"
                    onClick={() => setShowMenu(true)}
                    aria-expanded={showMenu}
                    aria-controls="mobile-menu"
                >
                    Menu
                    <svg width="18" height="12" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                        <path d="M0 1h22M6 7h16M0 13h22" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </button>
            </div>
        </header>

        {/* MOBILE MENU */}
        <dialog
            ref={dialogRef}
            id="mobile-menu"
            aria-label="Menu"
            className="mobile-menu lg:hidden"
            onClose={() => {
                setShowMenu(false);
                // A section was picked: its heading is focused from the click handler.
                if (pendingFocusId.current) {
                    pendingFocusId.current = null;
                    return;
                }
                // Return focus to the Menu button, or to the logo when it's hidden (desktop).
                const menuButton = menuButtonRef.current;
                if (menuButton && menuButton.offsetParent !== null) { menuButton.focus(); }
                else { document.querySelector<HTMLAnchorElement>("header a[aria-label='Home']")?.focus(); }
            }}
        >
            <div className="min-h-full flex flex-col">
                <div className="shell h-[72px] flex items-center justify-between shrink-0">
                    <Link href="/" onClick={() => setShowMenu(false)} aria-label="Home" className="flex h-9 items-center text-bone">{lwLogoIcon}</Link>
                    <div className="flex items-center gap-3">
                        <LangSwitch large />
                        <button ref={closeButtonRef} type="button" onClick={() => setShowMenu(false)} aria-label="Close menu" className="flex items-center justify-center w-11 h-11 bg-surface text-bone chamfer [--chamfer:7px]">
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                <path d="M1 17L17 1M1 1l16 16" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                <nav aria-label="Main" className="shell flex-1 flex flex-col gap-1 pt-6 sm:pt-10">
                    {navItems.map((item) => {
                        const active = activeId === item.id;
                        return <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => { pendingFocusId.current = item.id; setShowMenu(false); focusSectionHeading(item.id); }}
                            aria-current={active ? "location" : undefined}
                            className="flex items-center gap-4 py-2"
                        >
                            <span className="w-6 flex justify-center"><NavMarker active={active} number={item.number} /></span>
                            <span className="font-display text-[clamp(2.5rem,11vw,3.5rem)] text-bone">{item.label}</span>
                        </Link>;
                    })}
                    <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10 w-full">{t("nav_resume")} <span aria-hidden="true">↗</span></a>
                    <div className="flex items-center gap-3 mt-auto pb-8 pt-8">
                        <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} aria-label="E-mail" className="social-square">{mailIcon}</a>
                        <a href={process.env.NEXT_PUBLIC_URL_LINKEDIN} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="social-square">{linkedInIcon}</a>
                        <a href={process.env.NEXT_PUBLIC_URL_GITHUB} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="social-square">{githubIcon}</a>
                    </div>
                </nav>
            </div>
        </dialog>
    </>
}
