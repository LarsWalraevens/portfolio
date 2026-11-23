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
                <path id={shapeId} d={LW_PATH} fillRule="evenodd" data-lw-shape="" />
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
            <g className="logo-trace-body">
                <path d={LW_PATH} data-lw-shape="" fillRule="evenodd" fill={`url(#${faceId})`} />
                <path d={LW_PATH} data-lw-shape="" fillRule="evenodd" className="logo-trace-fill" />
                <path d={LW_PATH} data-lw-shape="" fillRule="evenodd" fill={`url(#${gradientId})`} className="logo-trace-static" />
            </g>
            <path d={LW_PATH} data-lw-shape="" pathLength={1} className="logo-trace-line" />
            {/* Redraw after a fix (hero plate only): the clean outline is drawn first, its points popping in
                as the line reaches them, and only then does the solid mark fill back in. */}
            <path d={LW_PATH} pathLength={1} className="logo-redraw-line" />
            <g className="logo-redraw-nodes">
                {LW_GEOMETRY.anchors.map(([x, y], k) => k === LW_GEOMETRY.twin ? null :
                    <rect key={k} x={x - 7} y={y - 7} width={14} height={14} style={{ "--at": LW_GEOMETRY.along[k] } as CSSProperties} />
                )}
            </g>
        </svg>
    </span>;
};

/** The logo's geometry, parsed once from LW_PATH (only M, L, C and Z are used): its segments, the anchor
    point each segment ends on, and its bezier handles. Each handle belongs to an anchor, so a moved anchor
    takes its handles along (the usual vector-editor rule). The closing anchor sits on the starting one. */
type Segment = { cmd: "M" | "L" | "C", p: number[] };
const LW_GEOMETRY = (() => {
    const segs: Segment[] = [];
    const tokens = LW_PATH.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? [];
    let i = 0, cmd = "";
    const num = () => parseFloat(tokens[i++]);
    while (i < tokens.length) {
        if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
        if (cmd === "Z" || cmd === "z") continue;
        if (cmd === "C") segs.push({ cmd: "C", p: [num(), num(), num(), num(), num(), num()] });
        else segs.push({ cmd: cmd === "M" ? "M" : "L", p: [num(), num()] });
    }
    const anchors = segs.map(seg => [seg.p[seg.p.length - 2], seg.p[seg.p.length - 1]] as [number, number]);
    // Handles: control 1 of a curve belongs to the anchor it starts from, control 2 to the anchor it ends on.
    const handles: { seg: number, ctrl: 0 | 1, anchor: number }[] = [];
    segs.forEach((seg, k) => {
        if (seg.cmd !== "C") return;
        handles.push({ seg: k, ctrl: 0, anchor: k - 1 }, { seg: k, ctrl: 1, anchor: k });
    });
    const last = anchors.length - 1;
    const twin = last > 0 && anchors[last][0] === anchors[0][0] && anchors[last][1] === anchors[0][1] ? last : -1;
    // Where each anchor sits along the outline (0..1 of its drawn length; M jumps aren't drawn), so the
    // redraw after a fix can pop each point in just as the line reaches it.
    const lengths = segs.map((seg, k) => {
        if (seg.cmd === "M" || k === 0) return 0;
        const [x0, y0] = anchors[k - 1], p = seg.p;
        if (seg.cmd === "L") return Math.hypot(p[0] - x0, p[1] - y0);
        let len = 0, px = x0, py = y0;
        for (let s = 1; s <= 24; s++) {
            const t = s / 24, u = 1 - t;
            const x = u * u * u * x0 + 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t * t * t * p[4];
            const y = u * u * u * y0 + 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t * t * t * p[5];
            len += Math.hypot(x - px, y - py); px = x; py = y;
        }
        return len;
    });
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    let run = 0;
    const along = lengths.map(l => (run += l) / total);
    return { segs, anchors, handles, twin, along };
})();

/** Rebuilds the logo's path (and its blueprint points) with the anchors moved by `off` (x,y per anchor). */
const handlePoint = (h: typeof LW_GEOMETRY.handles[number], off: Float32Array): [number, number] => {
    const p = LW_GEOMETRY.segs[h.seg].p, j = h.ctrl * 2;
    return [p[j] + off[h.anchor * 2], p[j + 1] + off[h.anchor * 2 + 1]];
};
const anchorPoint = (k: number, off: Float32Array): [number, number] =>
    [LW_GEOMETRY.anchors[k][0] + off[k * 2], LW_GEOMETRY.anchors[k][1] + off[k * 2 + 1]];
const buildLogoPath = (off: Float32Array, deleted?: Set<number>) => {
    if (!deleted || deleted.size === 0) {
        let d = "";
        LW_GEOMETRY.segs.forEach((seg, k) => {
            const [x, y] = anchorPoint(k, off);
            if (seg.cmd === "C") {
                const p = seg.p;
                d += `C${(p[0] + off[(k - 1) * 2]).toFixed(1)} ${(p[1] + off[(k - 1) * 2 + 1]).toFixed(1)} ${(p[2] + off[k * 2]).toFixed(1)} ${(p[3] + off[k * 2 + 1]).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
            } else d += `${seg.cmd}${x.toFixed(1)} ${y.toFixed(1)}`;
        });
        return d + "Z";
    }
    // Deleted anchors are skipped: their neighbours get joined with straight lines (curves survive only
    // between two kept anchors), which is what breaks the mark in a visible, "something is wrong" way.
    const kept = LW_GEOMETRY.anchors.map((_, k) => k).filter(k => !deleted.has(k));
    if (kept.length < 2) return "";
    let d = "", prev = -1;
    for (const k of kept) {
        const [x, y] = anchorPoint(k, off), seg = LW_GEOMETRY.segs[k];
        if (prev < 0) d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
        else if (seg.cmd === "C" && prev === k - 1) {
            const p = seg.p;
            d += `C${(p[0] + off[prev * 2]).toFixed(1)} ${(p[1] + off[prev * 2 + 1]).toFixed(1)} ${(p[2] + off[k * 2]).toFixed(1)} ${(p[3] + off[k * 2 + 1]).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        } else d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
        prev = k;
    }
    return d + "Z";
};

/** The logo's vector "blueprint": outline, anchor points and bezier handles. Shown only inside the cursor
    lens and the selection box, as if the screen were a design tool. */
const NO_OFFSET = new Float32Array(LW_GEOMETRY.anchors.length * 2);
const LogoBlueprint = () => <svg viewBox={LW_VIEWBOX} fill="none" aria-hidden="true" className="blueprint block h-full w-auto overflow-visible">
    <path d={LW_PATH} className="blueprint-outline" data-lw-shape="" />
    {LW_GEOMETRY.handles.map((h, k) => {
        const [ax, ay] = anchorPoint(h.anchor, NO_OFFSET), [hx, hy] = handlePoint(h, NO_OFFSET);
        return <g key={`h${k}`} className="blueprint-handle-group">
            <line x1={ax} y1={ay} x2={hx} y2={hy} className="blueprint-handle" />
            <circle cx={hx} cy={hy} r={5} className="blueprint-handle-dot" />
        </g>;
    })}
    {LW_GEOMETRY.anchors.map(([x, y], k) => <rect key={`a${k}`} x={x - 6} y={y - 6} width={12} height={12} className="blueprint-anchor" />)}
</svg>;

/** Tells the status line what the visitor is doing to the logo; the detail is a PlateEditDetail. */
const PLATE_EDIT_EVENT = "plate:edit";

/** The plate's cursor lens. While the mouse is over the plate, sets --px/--py (plate pixels) so a lens
    reveals the logo's blueprint and a fine grid, crosshair guides run through the cursor, and a readout
    shows its X/Y like a design tool. Tracked across the window; the lens fades out when the mouse
    leaves the plate. Everything per frame is a direct DOM write (no React render).

    Press and drag on the plate to draw a selection box (like a desktop marquee): it shows its size while
    dragging, reveals the blueprint inside it, and on release selects the anchor points it covers.

    Then press inside the box and pull: the selected points (and their bezier handles) follow the mouse,
    so the logo's face, 3D side, glowing outline and blueprint all bend live. They follow the mouse freely for a
    good distance, then a soft rubber band takes over; on release the iron springs back with one small overshoot.
    Or press Delete/Backspace: the selected points are removed, the mark breaks and the screen goes into a
    critical alert with a Fix button, which puts the points back one by one. Escape clears the selection.
    The status line narrates all of it. The selection clears a few seconds after the last action, or on a
    new press outside it. Touch and reduced motion: none of this. */
const PULL_FREE = 260;        // SVG units the points follow the mouse 1:1 (about a quarter of the mark's height)
const PULL_RESISTANCE = 320;  // past that, a soft rubber band: at most this much further, however far you pull
const SPRING_K = 380, SPRING_C = 22;
const usePlateLens = (ref: React.RefObject<HTMLElement>, readoutRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const el = ref.current;
        // if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!el) return;

        let frame = 0, last = 0, x = -999, y = -999, tx = -999, ty = -999, inside = false;
        const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");
        const signed = (n: number) => `${n < 0 ? "\u2212" : "+"}${String(Math.abs(Math.round(n))).padStart(3, "0")}`;

        // Marquee selection state.
        const label = el.querySelector<HTMLElement>(".hero-marquee-label");
        let drag: { x0: number, y0: number } | null = null, box = { x: 0, y: 0, w: 0, h: 0 }, clearTimer = 0, resetTimer = 0;
        let selected: number[] = [], countLabel = "", hasPulled = false, hasDeleted = false;
        const say = (tone: PlateEditDetail["tone"], text: string) =>
            window.dispatchEvent(new CustomEvent<PlateEditDetail>(PLATE_EDIT_EVENT, { detail: { tone, text } }));
        const setBox = (b: typeof box) => {
            box = b;
            // Near the bottom edge the label would run into the clock, so it moves above the box there.
            el.classList.toggle("marquee-label-above", b.y + b.h > el.clientHeight - 70);
            el.style.setProperty("--sx", `${b.x}px`);
            el.style.setProperty("--sy", `${b.y}px`);
            el.style.setProperty("--sw", `${b.w}px`);
            el.style.setProperty("--sh", `${b.h}px`);
        };
        const scheduleClear = () => {
            window.clearTimeout(clearTimer);
            clearTimer = window.setTimeout(() => clearSelection(), 4500);
        };
        const clearSelection = (instant = false) => {
            window.clearTimeout(clearTimer);
            window.clearTimeout(resetTimer);
            el.classList.remove("has-selection", "has-nodes", "can-grab");
            selected = [];
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
        const inBox = (px: number, py: number) => px >= box.x && px <= box.x + box.w && py >= box.y && py <= box.y + box.h;

        // --- Bending: one offset buffer drives every layer of the logo on the plate.
        const off = new Float32Array(LW_GEOMETRY.anchors.length * 2);
        const deleted = new Set<number>();
        const missingCount = () => deleted.size - (LW_GEOMETRY.twin > 0 && deleted.has(0) && deleted.has(LW_GEOMETRY.twin) ? 1 : 0);
        const criticalLine = () => `Critical: ${missingCount()} node${missingCount() === 1 ? "" : "s"} missing`;
        const shapes = el.querySelectorAll<SVGPathElement>("[data-lw-shape]");
        const anchorEls = el.querySelectorAll<SVGRectElement>(".blueprint-anchor");
        const handleEls = el.querySelectorAll<SVGGElement>(".blueprint-handle-group");
        const blueprintSvg = el.querySelector<SVGSVGElement>(".blueprint");
        // A press inside the selection only becomes a pull once the mouse moves a few pixels; a plain click
        // there deselects instead.
        let pull: { x0: number, y0: number, box: typeof box, unitsPerPx: number, active: boolean, released: boolean } | null = null;
        let okTimer = 0, repairTimer = 0, alertAt = 0;
        const MIN_ALERT_MS = 1300;    // "Issues detected" always gets this long on screen, even after a quick flick
        const PULL_THRESHOLD = 4;     // px before a press inside the box counts as a pull
        const REPAIR_DELAY = 1100;    // after release the bent shape holds while "Fixing…" runs, then springs back
        const VERDICT_DELAY = 350;    // pause after the spring settles before "All tests passing"
        let pullPx = { x: 0, y: 0 };      // current (resisted) offset in plate pixels
        let spring: { t: number, v: number, from: { x: number, y: number }, last: number } | null = null, springFrame = 0;

        const applyOffset = (dxPx: number, dyPx: number, unitsPerPx: number) => {
            off.fill(0);
            const dx = dxPx * unitsPerPx, dy = dyPx * unitsPerPx;
            for (const k of selected) { off[k * 2] = dx; off[k * 2 + 1] = dy; }
            const d = buildLogoPath(off, deleted);
            shapes.forEach(path => path.setAttribute("d", d));
            for (const k of selected) {
                const [ax, ay] = anchorPoint(k, off);
                anchorEls[k]?.setAttribute("x", String(ax - 6));
                anchorEls[k]?.setAttribute("y", String(ay - 6));
            }
            LW_GEOMETRY.handles.forEach((h, k) => {
                if (!selected.includes(h.anchor)) return;
                const g = handleEls[k];
                if (!g) return;
                const [ax, ay] = anchorPoint(h.anchor, off), [hx, hy] = handlePoint(h, off);
                const line = g.firstElementChild as SVGLineElement, dot = g.lastElementChild as SVGCircleElement;
                line.setAttribute("x1", String(ax)); line.setAttribute("y1", String(ay));
                line.setAttribute("x2", String(hx)); line.setAttribute("y2", String(hy));
                dot.setAttribute("cx", String(hx)); dot.setAttribute("cy", String(hy));
            });
            pullPx = { x: dxPx, y: dyPx };
            if (pull) setBox({ ...pull.box, x: pull.box.x + dxPx, y: pull.box.y + dyPx });
        };
        const restoreShape = () => {
            off.fill(0);
            const d = deleted.size ? buildLogoPath(off, deleted) : LW_PATH;
            shapes.forEach(path => path.setAttribute("d", d));
        };
        // Hide / show the blueprint points (and the handles of curves touching them) to match `deleted`.
        const syncDeletedPoints = () => {
            anchorEls.forEach((a, k) => a.classList.toggle("is-deleted", deleted.has(k)));
            LW_GEOMETRY.handles.forEach((h, k) => handleEls[k]?.classList.toggle("is-deleted", deleted.has(h.seg) || deleted.has(h.seg - 1)));
        };

        // --- Breaking and fixing.
        const alertText = el.querySelector<HTMLElement>(".hero-alert-text");
        const fixButton = el.querySelector<HTMLButtonElement>(".hero-fix");
        let fixing = false, fixTimer = 0;
        const deleteSelected = () => {
            if (!selected.length || pull || fixing) return;
            window.clearTimeout(okTimer); // a pending "All tests passing" would now be a lie
            selected.forEach(k => deleted.add(k));
            hasDeleted = true;
            clearSelection(true);
            syncDeletedPoints();
            restoreShape();
            if (alertText) alertText.textContent = `${missingCount()} node${missingCount() === 1 ? "" : "s"} missing from lw.svg`;
            el.classList.add("is-broken");
            say("alert", criticalLine());
        };
        const fix = () => {
            if (!deleted.size || fixing) return;
            fixing = true;
            el.classList.add("is-fixing");
            say("fixing", "Fixing\u2026");
            // A calm rebuild instead of a shape that jumps with every restored point: the broken mark
            // dissolves, the clean outline is drawn in one stroke (points popping in as the line reaches
            // them), then the solid mark fills back in, front face first and the extruded side behind it.
            // Timings match the .is-clearing / .is-tracing / .is-filling transitions in base.css.
            const later = (ms: number, fn: () => void) => { fixTimer = window.setTimeout(fn, ms); };
            later(350, () => {
                el.classList.add("is-clearing");
                later(450, () => {
                    deleted.clear();
                    syncDeletedPoints();
                    restoreShape(); // swapped in while the mark is invisible
                    el.classList.add("is-tracing");
                    later(1700, () => {
                        el.classList.add("is-filling");
                        el.classList.remove("is-clearing");
                        later(900, () => {
                            fixing = false;
                            el.classList.remove("is-broken", "is-fixing", "is-tracing", "is-filling");
                            say("ok", "All tests passing");
                        });
                    });
                });
            });
        };
        // Free within a radius, then a rubber band on the distance (not per axis, so diagonals feel the same).
        const resist = (dx: number, dy: number, freePx: number, rPx: number) => {
            const d = Math.hypot(dx, dy);
            if (d <= freePx) return { x: dx, y: dy };
            const extra = d - freePx, scale = (freePx + extra * rPx / (rPx + extra)) / d;
            return { x: dx * scale, y: dy * scale };
        };

        const springBack = () => {
            const from = { ...pullPx }, unitsPerPx = pull!.unitsPerPx;
            spring = { t: 1, v: 0, from, last: 0 };
            const step = (time: number) => {
                if (!spring) return;
                const dt = spring.last ? Math.min(0.032, (time - spring.last) / 1000) : 0.016;
                spring.last = time;
                spring.v += (-SPRING_K * spring.t - SPRING_C * spring.v) * dt;
                spring.t += spring.v * dt;
                const done = Math.abs(spring.t) < 0.002 && Math.abs(spring.v) < 0.02;
                if (done) {
                    applyOffset(0, 0, unitsPerPx);
                    restoreShape();
                    spring = null; springFrame = 0; pull = null;
                    el.classList.remove("is-bending");
                    if (label) label.textContent = countLabel;
                    el.classList.remove("is-repairing");
                    const verdict = () => deleted.size ? say("alert", criticalLine()) : say("ok", "All tests passing");
                    okTimer = window.setTimeout(verdict, VERDICT_DELAY);
                    scheduleClear();
                    return;
                }
                applyOffset(from.x * spring.t, from.y * spring.t, unitsPerPx);
                springFrame = requestAnimationFrame(step);
            };
            springFrame = requestAnimationFrame(step);
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
            } else if (pull && !spring && !pull.released) {
                if (!pull.active) {
                    if (Math.hypot(nx - pull.x0, ny - pull.y0) < PULL_THRESHOLD) return;
                    pull.active = true;
                    hasPulled = true;
                    window.clearTimeout(okTimer);
                    el.classList.add("is-bending");
                    el.classList.remove("can-grab");
                    say("alert", "Issues detected\u2026");
                    alertAt = performance.now();
                }
                const { x: dxPx, y: dyPx } = resist(nx - pull.x0, ny - pull.y0, PULL_FREE / pull.unitsPerPx, PULL_RESISTANCE / pull.unitsPerPx);
                applyOffset(dxPx, dyPx, pull.unitsPerPx);
                if (label) label.textContent = `\u0394X ${signed(dxPx)}  \u0394Y ${signed(dyPx)}`;
            } else if (selected.length) {
                el.classList.toggle("can-grab", inBox(nx, ny));
            }
            if (!inside) return;
            tx = nx; ty = ny;
            if (!frame) frame = requestAnimationFrame(tick);
        };

        const onDown = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            if ((e.target as Element).closest(".hero-fix, .hero-menu")) return; // these handle their own clicks
            if (el.classList.contains("menu-open")) { closeMenu(); if (selected.length) scheduleClear(); return; }
            e.preventDefault(); // no text selection while dragging
            if (spring || fixing || pull?.released) return; // let the repair / the fix finish
            const { x: x0, y: y0 } = local(e);
            if (selected.length && inBox(x0, y0)) {
                // Grab the selection: start bending.
                window.clearTimeout(clearTimer);
                const svgRect = blueprintSvg?.getBoundingClientRect();
                const unitsPerPx = svgRect && svgRect.height ? 1006 / svgRect.height : 2;
                pull = { x0, y0, box: { ...box }, unitsPerPx, active: false, released: false };
                return;
            }
            clearSelection(true);
            drag = { x0, y0 };
            setBox({ x: x0, y: y0, w: 0, h: 0 });
            if (label) label.textContent = "W 0000  H 0000";
            el.classList.add("is-selecting");
        };
        const onUp = () => {
            if (pull && !spring && !pull.released) {
                if (!pull.active) { pull = null; clearSelection(); return; } // a click inside the box: deselect
                // Hold the bent shape: let "Issues detected" breathe, then "Fixing…", then the iron springs back.
                pull.released = true;
                const startRepair = () => {
                    el.classList.add("is-repairing");
                    say("fixing", "Fixing\u2026");
                    repairTimer = window.setTimeout(springBack, REPAIR_DELAY);
                };
                repairTimer = window.setTimeout(startRepair, Math.max(0, MIN_ALERT_MS - (performance.now() - alertAt)));
                return;
            }
            if (!drag) return;
            drag = null;
            el.classList.remove("is-selecting");
            if (box.w < 6 && box.h < 6) { clearSelection(true); return; } // a plain click
            const r = el.getBoundingClientRect();
            selectIn(r.left + box.x, r.top + box.y, r.left + box.x + box.w, r.top + box.y + box.h);
        };
        // Select the anchor points whose centre falls inside a screen rectangle (screen space, so the 3D pose
        // is respected), then show the count and the hints for what you can do next.
        const selectIn = (left: number, top: number, right: number, bottom: number) => {
            selected = [];
            anchorEls.forEach((a, k) => {
                const b = a.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
                const hit = !deleted.has(k) && b.width > 0 && cx >= left && cx <= right && cy >= top && cy <= bottom;
                a.classList.toggle("is-selected", hit);
                if (hit) selected.push(k);
            });
            const visible = selected.length;
            // The closing anchor sits on the first one: they always move together.
            const twin = LW_GEOMETRY.twin;
            if (twin > 0 && (selected.includes(0) || selected.includes(twin))) {
                if (!selected.includes(0)) selected.push(0);
                if (!selected.includes(twin)) selected.push(twin);
            }
            countLabel = visible ? `${visible} node${visible === 1 ? "" : "s"} selected` : "Nothing selected";
            const hints = [!hasPulled && "drag to bend", !hasDeleted && "del to delete"].filter(Boolean);
            if (label) label.textContent = visible && hints.length ? [countLabel, ...hints].join("  \u00b7  ") : countLabel;
            if (menuCount) menuCount.textContent = String(visible);
            if (!visible) selected = [];
            el.classList.add("has-selection");
            el.classList.toggle("has-nodes", visible > 0);
            scheduleClear();
        };
        // Select every remaining point, with the box drawn around them.
        const selectAll = () => {
            if (pull || fixing) return;
            const r = el.getBoundingClientRect();
            let l = Infinity, t = Infinity, rr = -Infinity, b = -Infinity;
            anchorEls.forEach((a, k) => {
                if (deleted.has(k)) return;
                const bb = a.getBoundingClientRect();
                if (!bb.width) return;
                l = Math.min(l, bb.left); t = Math.min(t, bb.top); rr = Math.max(rr, bb.right); b = Math.max(b, bb.bottom);
            });
            if (!isFinite(l)) return;
            const pad = 10;
            setBox({ x: l - r.left - pad, y: t - r.top - pad, w: rr - l + pad * 2, h: b - t + pad * 2 });
            selectIn(l - pad, t - pad, rr + pad, b + pad);
        };

        // --- Right-click menu: the same actions as the keys, so they are discoverable.
        const menu = el.querySelector<HTMLElement>(".hero-menu");
        const menuCount = el.querySelector<HTMLElement>(".hero-menu [data-count]");
        const closeMenu = () => el.classList.remove("menu-open");
        const onContextMenu = (e: MouseEvent) => {
            if (!menu) return;
            e.preventDefault();
            window.clearTimeout(clearTimer); // keep the selection while the menu is open
            const r = el.getBoundingClientRect();
            el.classList.add("menu-open");
            const mw = menu.offsetWidth, mh = menu.offsetHeight;
            const mx = Math.min(e.clientX - r.left, r.width - mw - 8), my = Math.min(e.clientY - r.top, r.height - mh - 8);
            menu.style.transform = `translate(${Math.max(8, mx)}px, ${Math.max(8, my)}px)`;
        };
        const onMenuClick = (e: MouseEvent) => {
            const action = (e.target as Element).closest<HTMLElement>("[data-action]")?.dataset.action;
            if (!action) return;
            e.stopPropagation();
            closeMenu();
            if (action === "delete") deleteSelected();
            else if (action === "deselect") clearSelection();
            else if (action === "select-all") selectAll();
            else if (action === "fix") fix();
            else if (selected.length) scheduleClear();
        };
        const onOut = (e: PointerEvent) => {
            if (e.relatedTarget || !inside) return;
            inside = false;
            el.classList.remove("is-pointing");
            closeMenu();
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && el.classList.contains("menu-open")) { closeMenu(); return; }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && inside) { e.preventDefault(); selectAll(); return; }
            if (!selected.length) return;
            if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
            else if (e.key === "Escape") clearSelection();
        };
        const onFix = (e: MouseEvent) => { e.stopPropagation(); fix(); };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerout", onOut);
        el.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("keydown", onKey);
        fixButton?.addEventListener("click", onFix);
        el.addEventListener("contextmenu", onContextMenu);
        menu?.addEventListener("click", onMenuClick);
        el.classList.add("is-interactive");
        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(springFrame);
            window.clearTimeout(clearTimer);
            window.clearTimeout(resetTimer);
            window.clearTimeout(fixTimer);
            window.clearTimeout(okTimer);
            window.clearTimeout(repairTimer);
            deleted.clear();
            syncDeletedPoints();
            restoreShape();
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerout", onOut);
            el.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("keydown", onKey);
            fixButton?.removeEventListener("click", onFix);
            el.removeEventListener("contextmenu", onContextMenu);
            menu?.removeEventListener("click", onMenuClick);
            el.classList.remove("is-interactive", "is-bending", "is-repairing", "can-grab", "is-broken", "is-fixing", "is-clearing", "is-tracing", "is-filling", "menu-open");
        };
    }, [ref, readoutRef]);
};

/** A status line in the spirit of a coding agent at work: a spinning diamond and a gerund that is typed
    out ("Engineering…"), holds, is backspaced and replaced by the next. Now and then (about one in six)
    it slips into an off-hours one instead. English only, like a terminal. The cursor stays solid while
    typing and blinks while idle.

    The logo interaction can take it over at any moment (PLATE_EDIT_EVENT): the line is cleared at once and
    the new one typed fast, in a tone that shows on the line itself: "alert" (red, highlighted: issues
    detected, nodes missing), "fixing", and "ok" (all tests passing), after which the normal words resume.
    Reduced motion keeps the first word, fully typed, and a still diamond. */
const WORK_WORDS = ["Engineering", "Crafting", "Testing", "Pixel-pushing", "Refactoring", "Tinkering", "Polishing", "Debugging", "Testing", "Shipping"];
const OFF_HOURS_WORDS = ["Flying drones", "Playing tennis"];
const OFF_HOURS_CHANCE = 1 / 6;
const STATUS_CYCLE = 6300;  // per word, from first keystroke to the next word (2800ms + 125%)
const TYPE_DELAY = 70;      // per character typed
const ERASE_DELAY = 32;     // per character backspaced
const ALERT_TYPE_DELAY = 22; // takeovers type fast so they stay in sync with what happens on the plate
const OK_HOLD = 2600;       // how long "All tests passing" stays before the normal words resume
type StatusTone = "normal" | "alert" | "fixing" | "ok";
type PlateEditDetail = { tone: Exclude<StatusTone, "normal">, text: string };
const StatusTicker = () => {
    const first = `${WORK_WORDS[0]}\u2026`;
    const [text, setText] = useState(first);
    const [typing, setTyping] = useState(false);
    const [tone, setTone] = useState<StatusTone>("normal");
    useEffect(() => {
        // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let workIndex = 0, offIndex = 0, lastWasOff = false, cancelled = false;
        let gen = 0; // bumped on every takeover; any older loop stops at its next step
        const timers = new Set<number>();
        const wait = (ms: number) => new Promise<void>(resolve => {
            const step = () => {
                timers.delete(id);
                if (cancelled) return;
                if (document.hidden) { id = window.setTimeout(step, 500); timers.add(id); return; } // pause in background tabs
                resolve();
            };
            let id = window.setTimeout(step, ms);
            timers.add(id);
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
        const alive = (myGen: number) => !cancelled && gen === myGen;
        const typeIn = async (line: string, myGen: number, delay: number) => {
            setTyping(true);
            for (let n = 1; n <= line.length; n++) {
                if (!alive(myGen)) return false;
                setText(line.slice(0, n));
                await wait(delay);
            }
            if (!alive(myGen)) return false;
            setTyping(false);
            return true;
        };
        const eraseOut = async (line: string, myGen: number) => {
            setTyping(true);
            for (let n = line.length - 1; n >= 0; n--) {
                if (!alive(myGen)) return false;
                setText(line.slice(0, n));
                await wait(ERASE_DELAY);
            }
            return alive(myGen);
        };
        // The normal cycle: hold, backspace, type the next word, repeat.
        const cycle = async (current: string, myGen: number, firstHold: number) => {
            await wait(firstHold);
            while (alive(myGen)) {
                if (!await eraseOut(current, myGen)) return;
                current = `${nextWord()}\u2026`;
                await wait(220);
                if (!await typeIn(current, myGen, TYPE_DELAY)) return;
                await wait(Math.max(1200, STATUS_CYCLE - current.length * (TYPE_DELAY + ERASE_DELAY) - 220));
            }
        };
        const onEdit = async (e: Event) => {
            const { tone: nextTone, text: line } = (e as CustomEvent<PlateEditDetail>).detail;
            const myGen = ++gen;
            setTone(nextTone);
            setText("");
            if (!await typeIn(line, myGen, ALERT_TYPE_DELAY)) return;
            if (nextTone !== "ok") return; // alerts and "fixing" hold until the plate says what happens next
            await wait(OK_HOLD);
            if (!alive(myGen)) return;
            setTone("normal");
            cycle(line, myGen, 0);
        };
        window.addEventListener(PLATE_EDIT_EVENT, onEdit);
        cycle(first, gen, STATUS_CYCLE - first.length * TYPE_DELAY); // the first word is already shown
        return () => {
            cancelled = true;
            timers.forEach(id => window.clearTimeout(id));
            window.removeEventListener(PLATE_EDIT_EVENT, onEdit);
        };
    }, [first]);
    // Test-runner style badge while the logo interaction has the line: FAIL, RUN, PASS.
    const tag = tone === "alert" ? "FAIL" : tone === "fixing" ? "RUN" : tone === "ok" ? "PASS" : "";
    return <span className={`status-line is-${tone} flex items-center gap-3`}>
        {tag ? <span key={tone} className="status-tag">{tag}</span> : <span className="diamond status-diamond" />}
        {/* A zero-width space keeps the line's height while the word is fully erased, so the diamond doesn't jump. */}
        <span className="status-word whitespace-pre">{text || "\u200b"}</span>
        {/* The PASS check is its own (larger) glyph that pops in once the line is typed. */}
        {tone === "ok" && !typing && <span className="status-check" aria-hidden="true">{"\u2713"}</span>}
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
    return <span className="flex items-center gap-5 text-muted">
        <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="screen-clock-icon" aria-hidden="true">
                <circle cx="8" cy="8" r="6.25" />
                <path d="M8 4.5V8l2.4 1.6" />
            </svg>
            <span>{get("hour")}<span className="screen-clock-colon">:</span>{get("minute")} {get("dayPeriod")}</span>
        </span>
        <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="screen-clock-icon" aria-hidden="true">
                <path d="M8 14.5s-4.75-4.6-4.75-8.1a4.75 4.75 0 0 1 9.5 0c0 3.5-4.75 8.1-4.75 8.1Z" />
                <circle cx="8" cy="6.4" r="1.6" />
            </svg>
            <span>Mechelen, Belgium</span>
        </span>
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
                                <span className="hero-mark block h-full">
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
                            {/* Critical state after deleting points: a pulsing red wash and an error pop-up with a Fix button. */}
                            <span aria-hidden="true" className="hero-alert-wash absolute inset-0" />
                            <span aria-hidden="true" className="hero-alert">
                                <span className="label hero-alert-title"><span className="hero-alert-icon">!</span>Critical error</span>
                                <span className="label hero-alert-text" />
                                <button type="button" tabIndex={-1} className="hero-fix btn btn-sm btn-primary">Fix</button>
                            </span>

                            {/* A quiet hint while the mouse is over the screen, until something is selected. */}
                            <span aria-hidden="true" className="hero-hint label">
                                <svg viewBox="0 0 16 16" className="hero-hint-icon"><rect x="3.5" y="1.5" width="9" height="13" rx="4.5" /><path d="M8 1.5v5M3.5 6.5h9" /><path className="hero-hint-button" d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5v.5H8Z" /></svg>
                                Drag to select <span className="text-line2">&middot;</span> right-click for more
                            </span>

                            {/* Right-click menu with the same actions as the keyboard shortcuts. */}
                            <span aria-hidden="true" className="hero-menu label">
                                <button type="button" tabIndex={-1} data-action="delete" className="hero-menu-item when-selection">Delete <span data-count>0</span> nodes<kbd>Del</kbd></button>
                                <span className="hero-menu-note when-selection">Drag inside the box to bend</span>
                                <button type="button" tabIndex={-1} data-action="deselect" className="hero-menu-item when-selection">Deselect<kbd>Esc</kbd></button>
                                <span className="hero-menu-note when-empty">Drag on the screen to select</span>
                                <button type="button" tabIndex={-1} data-action="select-all" className="hero-menu-item">Select all nodes<kbd>Ctrl A</kbd></button>
                                <button type="button" tabIndex={-1} data-action="fix" className="hero-menu-item when-broken">Fix lw.svg</button>
                            </span>

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
                            <span aria-hidden="true" className="label text-faint absolute right-6 bottom-4 tabular-nums">
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

                        <h1 className="font-display text-bone relative pointer-events-auto lg:pointer-events-none lg:select-none">
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

                        <p className="hero-intro relative mt-5 max-w-[46ch] text-grey-100 lg:text-muted text-[1.0625rem] sm:text-lg leading-relaxed pointer-events-auto">
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
