import { LW_PATH, LW_VIEWBOX } from '@/assets/icons/icons.jsx';
import useTranslation from 'next-translate/useTranslation';
import Link from "next/link";
import { CSSProperties, useEffect, useId, useRef } from 'react';

export interface HomeSectionProps {
}

/** Layers that make up the mark's extruded side, back to front, darkening towards the back. */
const DEPTH_LAYERS = 14;
const depthColor = (i: number) => {
    // i = 1 (just behind the face) .. DEPTH_LAYERS (furthest back): #6E1720 -> #1C0609
    const t = (i - 1) / (DEPTH_LAYERS - 1);
    const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
    return `rgb(${mix(110, 28)}, ${mix(23, 6)}, ${mix(32, 9)})`;
};

/** The "lw" mark as a solid, extruded object with an oxblood line that traces its outline on a loop.
    The extruded side lives in its own static SVG layer, so the looping trace never has to repaint it.
    With reduced motion it shows a finished, static version: oxblood gradient face and a glowing outline.
    `fit` picks which side sizes the mark: its parent's height (desktop panel) or width (mobile watermark). */
const LogoTrace = (p: { fit?: "height" | "width" }) => {
    const uid = useId().replace(/:/g, "");
    const gradientId = `lw-grad-${uid}`;
    const faceId = `lw-face-${uid}`;
    const shapeId = `lw-shape-${uid}`;
    const byWidth = p.fit === "width";
    return <span className={`relative block ${byWidth ? "w-full" : "h-full w-fit"}`}>
        <svg viewBox={LW_VIEWBOX} aria-hidden="true" className="logo-trace-side absolute inset-0 w-full h-full overflow-visible">
            <defs>
                <path id={shapeId} d={LW_PATH} fillRule="evenodd" />
            </defs>
            {Array.from({ length: DEPTH_LAYERS }, (_, k) => DEPTH_LAYERS - k).map(i =>
                <use key={i} href={`#${shapeId}`} fill={depthColor(i)} className="logo-trace-depth" style={{ "--i": i } as CSSProperties} />
            )}
        </svg>
        <svg viewBox={LW_VIEWBOX} fill="none" aria-hidden="true" className={`relative block overflow-visible ${byWidth ? "w-full h-auto" : "h-full w-auto"}`}>
            <defs>
                <linearGradient id={faceId} x1="0" y1="0" x2="0.6" y2="1">
                    <stop offset="0%" stopColor="#2A2A2F" />
                    <stop offset="100%" stopColor="#111113" />
                </linearGradient>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E0414C" stopOpacity="0.55" />
                    <stop offset="55%" stopColor="#A3202A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#A3202A" stopOpacity="0.12" />
                </linearGradient>
            </defs>
            {/* Opaque face so the extruded side never shows through the translucent fills. */}
            <path d={LW_PATH} fillRule="evenodd" fill={`url(#${faceId})`} />
            <path d={LW_PATH} fillRule="evenodd" className="logo-trace-fill" />
            <path d={LW_PATH} fillRule="evenodd" fill={`url(#${gradientId})`} className="logo-trace-static" />
            <path d={LW_PATH} pathLength={1} className="logo-trace-line" />
        </svg>
    </span>;
};

/** Moves the plate's light with the mouse: eases --lx/--ly (plate-relative, about -0.6..0.6) on the
    plate so the glint sits under the cursor, as if a lamp were sliding over the metal. The plate itself
    never moves. The mouse is tracked across the whole window (no jump when moving onto the header);
    when it leaves the window the light eases back to its rest spot, and the loop stops once settled.
    Touch and reduced motion keep the CSS rest spot. */
const LIGHT_REST = { x: -0.3, y: -0.35 };
const usePlateLight = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0, last = 0;
        let target = { ...LIGHT_REST }, x = LIGHT_REST.x, y = LIGHT_REST.y;

        const tick = (time: number) => {
            // Frame-rate independent easing (~180ms time constant).
            const dt = last ? Math.min(64, time - last) : 16;
            last = time;
            const k = 1 - Math.exp(-dt / 180);
            x += (target.x - x) * k;
            y += (target.y - y) * k;
            const settled = Math.abs(target.x - x) < 0.001 && Math.abs(target.y - y) < 0.001;
            if (settled) { x = target.x; y = target.y; last = 0; }
            el.style.setProperty("--lx", x.toFixed(4));
            el.style.setProperty("--ly", y.toFixed(4));
            frame = settled ? 0 : requestAnimationFrame(tick);
        };
        const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = el.getBoundingClientRect();
            if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return; // hidden (phones) or off screen
            const clamp = (v: number) => Math.max(-0.6, Math.min(0.6, v));
            target = {
                x: clamp((e.clientX - r.left) / r.width - 0.5),
                y: clamp((e.clientY - r.top) / r.height - 0.5),
            };
            kick();
        };
        const onOut = (e: PointerEvent) => {
            if (e.relatedTarget) return; // still inside the page
            target = { ...LIGHT_REST };
            kick();
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerout", onOut);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerout", onOut);
        };
    }, [ref]);
};

export default function HomeHeroSection(props: HomeSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');
    const plateRef = useRef<HTMLDivElement>(null);
    usePlateLight(plateRef);

    return <section id="hero" className="relative overflow-hidden">
        <div className="shell relative">
            <div className="relative grid lg:grid-cols-12 gap-x-8 max-lg:min-h-[max(520px,calc(88svh-72px))] lg:h-[min(780px,calc(100svh-72px))] lg:min-h-[640px]">

                {/* Brand panel (desktop): wide plate with a deep cut corner; the full "lw" mark is the visual
                    (nudged right of the headline overlap), so the looping trace always draws the complete logo. */}
                <div className="hidden lg:block lg:col-start-6 lg:col-span-7 lg:row-start-1 self-end h-[84%] mb-12 relative hero-stage">
                    <div className="hero-tilt absolute inset-0">
                    <div ref={plateRef} className="hero-plate absolute inset-0">
                        <div className="hero-plate-inner absolute inset-[1px] overflow-hidden">
                            <span aria-hidden="true" className="hero-plate-grid absolute -inset-8" />
                            <span aria-hidden="true" className="hero-plate-glow absolute inset-[6%]" />
                            <span aria-hidden="true" className="hero-plate-sheen absolute inset-0" />
                            <span aria-hidden="true" className="hero-plate-light absolute" />
                            <span aria-hidden="true" className="absolute left-[56%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[78%]">
                                <span className="block h-full">
                                    <LogoTrace />
                                </span>
                            </span>

                            {/* Plate details: mono meta in the corners and a ruler along the bottom edge. */}
                            <span aria-hidden="true" className="label text-faint absolute left-7 top-7 flex items-center gap-3">
                                <span className="diamond" />51.0259&deg; N, 4.4776&deg; E
                            </span>
                            <span aria-hidden="true" className="label text-faint absolute right-7 bottom-7">
                                React <span className="text-line2 mx-1.5">/</span> .NET <span className="text-line2 mx-1.5">/</span> Azure
                            </span>
                            <span aria-hidden="true" className="hero-plate-ruler absolute left-[52px] bottom-0 w-[42%] h-3" />
                        </div>
                    </div>
                    {/* Pen stroke parallel to the cut corner. */}
                    <span aria-hidden="true" className="hero-plate-stroke" />
                    </div>
                </div>

                {/* Type column overlaps onto the panel. */}
                <div className="lg:col-start-1 lg:col-span-8 lg:row-start-1 relative z-10 flex flex-col justify-center pt-10 pb-28 lg:py-0 pointer-events-none">
                    <div className="relative">
                        {/* Mobile watermark, centred on the text block itself (not the padded column). */}
                        <span aria-hidden="true" className="hero-watermark lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[440px] opacity-40">
                            <LogoTrace fit="width" />
                        </span>

                        <div className="label text-faint mb-7 relative">
                            Lars Walraevens <span className="mx-2 text-line2" aria-hidden="true">/</span> <span className="text-bone">{t("hero_location_city")}</span>, {t("hero_location_country")}
                        </div>

                        <h1 className="font-display text-bone relative pointer-events-auto">
                            <span className="sr-only">Lars Walraevens. {t("hero_lars_is")} </span>
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span className="rise block text-[clamp(3.1rem,8.6vw,8.2rem)] leading-[0.86]">Software</span>
                            </span>
                            {" "}
                            <span className="block overflow-hidden pb-[0.06em] -mt-[0.02em]">
                                <span className="rise rise-2 block text-[clamp(4rem,11vw,10.5rem)] leading-[0.86] whitespace-nowrap">
                                    Developer
                                </span>
                            </span>
                        </h1>

                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 mt-6 relative pointer-events-auto">
                            <Link href="/#projects" className="btn btn-primary">{t("nav_projects")} <span aria-hidden="true">&rarr;</span></Link>
                            <Link href="/#about" className="btn">{t("nav_about")}</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </section>
}
