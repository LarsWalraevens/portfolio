import { LW_PATH, LW_VIEWBOX } from '@/assets/icons/icons.jsx';
import useTranslation from 'next-translate/useTranslation';
import Link from "next/link";
import { CSSProperties, useEffect, useId, useRef, useState } from 'react';

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

/** The logo's vector "blueprint": its outline, anchor points and bezier handles, parsed once from LW_PATH.
    Shown only inside the cursor lens, as if the screen were a design tool. */
const LW_BLUEPRINT = (() => {
    const anchors: [number, number][] = [];
    const handles: [number, number, number, number][] = [];
    const tokens = LW_PATH.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
    let i = 0, cmd = "", cx = 0, cy = 0;
    const num = () => parseFloat(tokens[i++]);
    while (i < tokens.length) {
        if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
        if (cmd === "Z" || cmd === "z") continue;
        if (cmd === "C") {
            const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
            handles.push([cx, cy, x1, y1], [x, y, x2, y2]);
            cx = x; cy = y;
        } else { // M / L
            cx = num(); cy = num();
        }
        anchors.push([cx, cy]);
    }
    return { anchors, handles };
})();

const LogoBlueprint = () => <svg viewBox={LW_VIEWBOX} fill="none" aria-hidden="true" className="block h-full w-auto overflow-visible">
    <path d={LW_PATH} className="blueprint-outline" />
    {LW_BLUEPRINT.handles.map(([ax, ay, hx, hy], k) => <g key={`h${k}`}>
        <line x1={ax} y1={ay} x2={hx} y2={hy} className="blueprint-handle" />
        <circle cx={hx} cy={hy} r={5} className="blueprint-handle-dot" />
    </g>)}
    {LW_BLUEPRINT.anchors.map(([x, y], k) => <rect key={`a${k}`} x={x - 6} y={y - 6} width={12} height={12} className="blueprint-anchor" />)}
</svg>;

/** The plate's cursor lens. While the mouse is over the plate, sets --px/--py (plate pixels) so a lens
    reveals the logo's blueprint and a fine grid, crosshair guides run through the cursor, and a readout
    shows its X/Y like a design tool. Tracked across the window; the lens fades out when the mouse
    leaves the plate. The readout is written straight to the DOM (no React render per frame), and the
    loop only runs while the cursor is moving.

    Press and drag on the plate to draw a selection box (like a desktop marquee): it shows its size while
    dragging, reveals the blueprint inside it, and on release selects the anchor points it covers, with a
    count. The selection clears after a few seconds or on the next press. Touch and reduced motion: none of this. */
const usePlateLens = (ref: React.RefObject<HTMLElement>, readoutRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0, last = 0, x = -999, y = -999, tx = -999, ty = -999, inside = false;
        const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

        // Marquee selection state.
        const label = el.querySelector<HTMLElement>(".hero-marquee-label");
        let drag: { x0: number, y0: number } | null = null, box = { x: 0, y: 0, w: 0, h: 0 }, clearTimer = 0, resetTimer = 0;
        const setBox = (b: typeof box) => {
            box = b;
            el.style.setProperty("--sx", `${b.x}px`);
            el.style.setProperty("--sy", `${b.y}px`);
            el.style.setProperty("--sw", `${b.w}px`);
            el.style.setProperty("--sh", `${b.h}px`);
        };
        const clearSelection = (instant = false) => {
            window.clearTimeout(clearTimer);
            window.clearTimeout(resetTimer);
            el.classList.remove("has-selection");
            const reset = () => {
                el.querySelectorAll(".blueprint-anchor.is-selected").forEach(a => a.classList.remove("is-selected"));
                setBox({ x: 0, y: 0, w: 0, h: 0 });
            };
            if (instant) reset(); else resetTimer = window.setTimeout(reset, 320); // after the fade-out
        };
        const local = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            return { r, x: Math.max(0, Math.min(r.width, e.clientX - r.left)), y: Math.max(0, Math.min(r.height, e.clientY - r.top)) };
        };

        const tick = (time: number) => {
            // Very short easing (~45ms) so the guides feel attached to the cursor but never jitter.
            const dt = last ? Math.min(64, time - last) : 16;
            last = time;
            const k = 1 - Math.exp(-dt / 45);
            x += (tx - x) * k;
            y += (ty - y) * k;
            const settled = Math.abs(tx - x) < 0.2 && Math.abs(ty - y) < 0.2;
            if (settled) { x = tx; y = ty; last = 0; }
            el.style.setProperty("--px", `${x.toFixed(1)}px`);
            el.style.setProperty("--py", `${y.toFixed(1)}px`);
            if (readoutRef.current) readoutRef.current.textContent = `X ${pad(x)}  Y ${pad(y)}`;
            frame = settled ? 0 : requestAnimationFrame(tick);
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = el.getBoundingClientRect();
            if (!r.width) return; // plate hidden (phones)
            const nx = e.clientX - r.left, ny = e.clientY - r.top;
            const nowInside = nx >= 0 && ny >= 0 && nx <= r.width && ny <= r.height;
            if (nowInside && !inside) { x = nx; y = ny; } // enter: start right under the cursor
            if (nowInside !== inside) { inside = nowInside; el.classList.toggle("is-pointing", inside); }
            if (drag) {
                const { x: x1, y: y1 } = local(e);
                setBox({ x: Math.min(drag.x0, x1), y: Math.min(drag.y0, y1), w: Math.abs(x1 - drag.x0), h: Math.abs(y1 - drag.y0) });
                if (label) label.textContent = `W ${pad(box.w)}  H ${pad(box.h)}`;
            }
            if (!inside) return;
            tx = nx; ty = ny;
            if (!frame) frame = requestAnimationFrame(tick);
        };

        const onDown = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            e.preventDefault(); // no text selection while dragging
            clearSelection(true);
            const { x: x0, y: y0 } = local(e);
            drag = { x0, y0 };
            setBox({ x: x0, y: y0, w: 0, h: 0 });
            if (label) label.textContent = "W 0000  H 0000";
            el.classList.add("is-selecting");
        };
        const onUp = () => {
            if (!drag) return;
            drag = null;
            el.classList.remove("is-selecting");
            if (box.w < 6 && box.h < 6) { clearSelection(true); return; } // a plain click
            // Select the anchor points whose centre falls inside the box (in screen space, so the 3D pose is respected).
            const r = el.getBoundingClientRect();
            const left = r.left + box.x, top = r.top + box.y, right = left + box.w, bottom = top + box.h;
            let count = 0;
            el.querySelectorAll<SVGElement>(".blueprint-anchor").forEach(a => {
                const b = a.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
                const hit = cx >= left && cx <= right && cy >= top && cy <= bottom;
                a.classList.toggle("is-selected", hit);
                if (hit) count++;
            });
            if (label) label.textContent = count ? `${count} node${count === 1 ? "" : "s"} selected` : "Nothing selected";
            el.classList.add("has-selection");
            clearTimer = window.setTimeout(() => clearSelection(), 4500);
        };
        const onOut = (e: PointerEvent) => {
            if (e.relatedTarget || !inside) return;
            inside = false;
            el.classList.remove("is-pointing");
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerout", onOut);
        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        el.classList.add("is-interactive");
        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(clearTimer);
            window.clearTimeout(resetTimer);
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerout", onOut);
            el.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            el.classList.remove("is-interactive");
        };
    }, [ref, readoutRef]);
};

/** A status line in the spirit of a coding agent at work: a spinning diamond and a gerund that is typed
    out ("Engineering…"), holds, is backspaced and replaced by the next. Now and then (about one in six)
    it slips into an off-hours one instead. English only, like a terminal. The cursor stays solid while
    typing and blinks while idle. Reduced motion keeps the first word, fully typed, and a still diamond. */
const WORK_WORDS = ["Engineering", "Crafting", "Testing", "Pixel-pushing", "Refactoring", "Tinkering", "Polishing", "Debugging", "Testing", "Shipping"];
const OFF_HOURS_WORDS = ["Flying drones", "Playing tennis"];
const OFF_HOURS_CHANCE = 1 / 6;
const STATUS_CYCLE = 6300;  // per word, from first keystroke to the next word (2800ms + 125%)
const TYPE_DELAY = 70;      // per character typed
const ERASE_DELAY = 32;     // per character backspaced
const StatusTicker = () => {
    const first = `${WORK_WORDS[0]}\u2026`;
    const [text, setText] = useState(first);
    const [typing, setTyping] = useState(false);
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let workIndex = 0, offIndex = 0, lastWasOff = false, timer = 0, cancelled = false;
        const wait = (ms: number) => new Promise<void>(resolve => {
            const step = () => {
                if (cancelled) return;
                if (document.hidden) { timer = window.setTimeout(step, 500); return; } // pause in background tabs
                resolve();
            };
            timer = window.setTimeout(step, ms);
        });
        const nextWord = () => {
            if (!lastWasOff && Math.random() < OFF_HOURS_CHANCE) {
                lastWasOff = true;
                return OFF_HOURS_WORDS[offIndex++ % OFF_HOURS_WORDS.length];
            }
            lastWasOff = false;
            workIndex = (workIndex + 1) % WORK_WORDS.length;
            return WORK_WORDS[workIndex];
        };
        const run = async () => {
            let current = first;
            await wait(STATUS_CYCLE - current.length * TYPE_DELAY); // the first word is already shown
            while (!cancelled) {
                setTyping(true);
                for (let n = current.length - 1; n >= 0 && !cancelled; n--) {
                    setText(current.slice(0, n));
                    await wait(ERASE_DELAY);
                }
                current = `${nextWord()}\u2026`;
                await wait(220);
                for (let n = 1; n <= current.length && !cancelled; n++) {
                    setText(current.slice(0, n));
                    await wait(TYPE_DELAY);
                }
                setTyping(false);
                await wait(Math.max(1200, STATUS_CYCLE - current.length * (TYPE_DELAY + ERASE_DELAY) - 220));
            }
        };
        run();
        return () => { cancelled = true; window.clearTimeout(timer); };
    }, [first]);
    return <span className="flex items-center gap-3">
        <span className="diamond status-diamond" />
        {/* A zero-width space keeps the line's height while the word is fully erased, so the diamond doesn't jump. */}
        <span className="status-word whitespace-pre">{text || "\u200b"}</span>
        <span className={`status-cursor ${typing ? "is-typing" : ""}`} />
    </span>;
};

/** The plate's "taskbar clock": Lars's local time in Belgium (12-hour) with where that is, updated on the
    minute. English only, like the rest of the screen. Rendered only after mount so the server's time never mismatches the visitor's render. */
const BRUSSELS = "Europe/Brussels";
const timeFormat = new Intl.DateTimeFormat("en-US", { timeZone: BRUSSELS, hour: "numeric", minute: "2-digit", hour12: true });
const ScreenClock = () => {
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => {
        let timer = 0;
        const tick = () => {
            setNow(new Date());
            timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50); // next minute boundary
        };
        tick();
        return () => window.clearTimeout(timer);
    }, []);
    if (!now) return null;
    const parts = timeFormat.formatToParts(now);
    const get = (type: string) => parts.find(part => part.type === type)?.value ?? "";
    return <span className="flex items-center gap-2.5 text-muted">
        <span>{get("hour")}<span className="screen-clock-colon">:</span>{get("minute")} {get("dayPeriod")}</span>
        <span className="text-line2" aria-hidden="true">/</span>
        <span>Mechelen, Belgium</span>
    </span>;
};

export default function HomeHeroSection(props: HomeSectionProps) {
    // # UTILS
    const { t } = useTranslation('common');
    const plateRef = useRef<HTMLDivElement>(null);
    const readoutRef = useRef<HTMLSpanElement>(null);
    usePlateLens(plateRef, readoutRef);

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
                            <span aria-hidden="true" className="absolute left-[56%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[78%]">
                                <span className="block h-full">
                                    <LogoTrace />
                                </span>
                            </span>

                            {/* Cursor lens (desktop, mouse only): reveals the logo's vector blueprint and a fine grid
                                around the cursor, with crosshair guides and an X/Y readout, like a design tool. */}
                            <span aria-hidden="true" className="hero-lens absolute inset-0">
                                <span className="hero-lens-grid absolute inset-0" />
                                <span className="absolute left-[56%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[78%]">
                                    <LogoBlueprint />
                                </span>
                            </span>
                            <span aria-hidden="true" className="hero-guide hero-guide-x absolute left-0 right-0 top-0" />
                            <span aria-hidden="true" className="hero-guide hero-guide-y absolute top-0 bottom-0 left-0" />
                            <span aria-hidden="true" ref={readoutRef} className="hero-readout label absolute left-0 top-0 tabular-nums whitespace-pre" />
                            {/* Drag-to-select box with its size / selection count. */}
                            <span aria-hidden="true" className="hero-marquee">
                                <span className="hero-marquee-label label tabular-nums whitespace-pre" />
                            </span>

                            {/* Screen glass: faint scanlines and a vignette over everything but the labels. */}
                            <span aria-hidden="true" className="hero-screen-glass absolute inset-0" />

                            {/* Plate details: a working-status ticker top-left, a local-time "taskbar clock" bottom-right, a ruler along the bottom edge.
                                Decorative (desktop only); the intro under the title carries the actual pitch. */}
                            <span aria-hidden="true" className="label text-faint absolute left-7 top-7">
                                <StatusTicker />
                            </span>
                            <span aria-hidden="true" className="label text-faint absolute right-7 bottom-7 tabular-nums">
                                <ScreenClock />
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

                        <p className="relative mt-5 max-w-[46ch] text-muted text-[1.0625rem] sm:text-lg leading-relaxed pointer-events-auto">
                            {t("hero_intro")}
                        </p>

                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 mt-7 relative pointer-events-auto">
                            <Link href="/#projects" className="btn btn-primary btn-hero">{t("nav_projects")} <span aria-hidden="true">&rarr;</span></Link>
                            <Link href="/#about" className="btn btn-hero">{t("nav_about")}</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </section>
}
