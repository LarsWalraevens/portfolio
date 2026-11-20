import { useEffect } from "react";

/**
 * Soft fade-up for anything marked `data-reveal` as it scrolls into view.
 *
 * Progressive: content renders visible on first paint. Only elements that are still below
 * the fold when this runs get hidden (`is-pending`), so nothing above the fold ever flashes.
 * Elements added later (e.g. a project page resolving its data) are picked up too.
 * Optional `data-reveal-delay="120"` (ms) staggers siblings.
 */
export function useScrollReveal() {
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") { return }
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) { return }
                const el = entry.target as HTMLElement;
                el.classList.add("is-revealed");
                el.classList.remove("is-pending");
                pending.delete(el);
                io.unobserve(el);
                // Drop the reveal transition once done so the element's own transitions win again.
                const done = (e: TransitionEvent) => {
                    if (e.target !== el || e.propertyName !== "transform") { return }
                    el.classList.remove("is-revealed");
                    el.removeEventListener("transitionend", done);
                };
                el.addEventListener("transitionend", done);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

        // Per-run bookkeeping (not on the DOM), so a re-run of this effect (Strict Mode,
        // Fast Refresh) starts clean instead of skipping elements an old run left hidden.
        const seen = new WeakSet<HTMLElement>();
        const pending = new Set<HTMLElement>();

        const prepare = (el: HTMLElement) => {
            if (seen.has(el)) { return }
            seen.add(el);
            const delay = el.dataset.revealDelay;
            if (delay) { el.style.setProperty("--reveal-delay", `${delay}ms`); }
            // Already on screen: leave it alone.
            if (el.getBoundingClientRect().top < window.innerHeight * 0.92) { return }
            el.classList.add("is-pending");
            pending.add(el);
            io.observe(el);
        };

        const scan = (root: ParentNode) => {
            if (root instanceof HTMLElement && root.hasAttribute("data-reveal")) { prepare(root); }
            root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(prepare);
        };

        scan(document);

        const mo = new MutationObserver((mutations) => {
            mutations.forEach((m) => m.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) { scan(node); }
            }));
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
            // Never leave anything stuck invisible.
            pending.forEach((el) => el.classList.remove("is-pending"));
        };
    }, []);
}
