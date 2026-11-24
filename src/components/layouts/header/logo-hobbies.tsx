import { CSSProperties, ReactNode } from "react";

/**
 * Small hobby accents that play around the header logo while it's hovered.
 * Every new hover advances to the next hobby: tennis → FPV drone → code → gaming → …
 *
 * Coordinates: 1 unit = 1px, with the logo's box at (0,0)–(34,36). Each scene has a
 * layer drawn behind the logo and one in front of it.
 * Styles and keyframes live in base.css under "Logo hobbies".
 */

interface Scene { back?: ReactNode; front?: ReactNode }

/** Tennis: the mark holds a racket off its right edge and keeps a ball bouncing on it. */
const tennis: Scene = {
    front: <>
        {/* The grip sits at the mark's edge; the racket pivots there on each hit. */}
        <g transform="translate(33 30)"><g className="lh-racket"><g transform="rotate(55) scale(1.08)">
            {/* A red racket with a darker red grip, so it reads against the bone mark. */}
            <line x1="0" y1="-5.2" x2="0" y2="-12.4" className="lh-racket-frame" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="0" y1=".2" x2="0" y2="-5.6" className="lh-racket-grip" strokeWidth="2.3" strokeLinecap="round" />
            <g transform="translate(0 -18.4)">
                <ellipse rx="4.6" ry="6.4" className="lh-racket-frame" strokeWidth="1.5" fill="none" />
                <path d="M-2.2 -5.6v11.2M0 -6.4v12.8M2.2 -5.6v11.2M-4 -3h8M-4.6 0h9.2M-4 3h8" className="lh-strings" />
            </g>
        </g></g></g>
        <g transform="translate(49.3 0)"><g className="lh-ball-y"><g className="lh-ball-squash">
            <circle r="3" className="lh-ball" />
            <path d="M-2.6 -1.2 Q0 .5 -1.1 2.7 M2.6 1.2 Q0 -.5 1.1 -2.7" className="lh-seam" />
        </g></g></g>
    </>,
};

/** A ducted tiny whoop (Air65-style), seen from the side and a little above: prop ducts with
    spinning props, a red canopy with a forward-tilted camera, the battery slung underneath and
    a short antenna at the back. Faces +x. */
function Duct({ cx, late }: { cx: number, late?: boolean }) {
    return <>
        <path d={`M${cx - 5.2} -2.5v2.6a5.2 1.6 0 0 0 10.4 0v-2.6a5.2 1.6 0 0 1 -10.4 0z`} className="lh-duct" />
        <ellipse cx={cx} cy="-2.9" rx="4.4" ry="1.1" className="lh-prop-disc" />
        <ellipse cx={cx} cy="-2.9" rx="4.4" ry=".4" className={`lh-accent lh-prop ${late ? "lh-prop--b" : ""}`} />
        <ellipse cx={cx} cy="-2.5" rx="5.2" ry="1.6" className="lh-duct-rim" />
    </>
}

function Drone() {
    return <>
        <line x1="-3.2" y1="-6" x2="-7" y2="-10.5" className="lh-stroke-muted" strokeWidth=".7" strokeLinecap="round" />
        <circle cx="-7" cy="-10.5" r=".8" className="lh-accent" />
        <rect x="-3.8" y=".6" width="7.6" height="2.8" rx=".6" className="lh-battery" />
        <rect x="-5" y="-1.2" width="10" height="1.6" rx=".5" className="lh-carbon" />
        <Duct cx={-9} />
        <Duct cx={9} late />
        <path d="M-4.6 -1.2C-4.6 -6.6 -1.5 -8 1 -8C3.8 -8 5.4 -6 5.6 -1.2Z" className="lh-accent" />
        <path d="M-2.6 -5Q-1.4 -7 1 -7.1" className="lh-canopy-shine" />
        <g transform="translate(4.3 -4.2) rotate(-18)">
            <rect x="-1.5" y="-1.6" width="3.4" height="3.2" rx=".8" className="lh-cam" />
            <circle cx="1.9" cy="0" r="1" className="lh-lens" />
            <circle cx="2.2" cy="-.3" r=".3" className="lh-glint" />
        </g>
        <circle cx="-1.2" cy="-.4" r=".55" className="lh-led" />
    </>
}

/** FPV drone: a tight orbit round the logo, behind it on the far half and in front on the near half. */
const droneOrbit = (layer: "back" | "front") =>
    <g transform="translate(17 17)"><g className={`lh-orbit-${layer}`}>
        <g className="lh-orbit-x"><g className="lh-orbit-y"><g className="lh-orbit-tilt"><Drone /></g></g></g>
    </g></g>;
const drone: Scene = { back: droneOrbit("back"), front: droneOrbit("front") };

// [token, x, delay]: spread across and just beside the mark so none hide behind it.
const TOKENS: Array<[string, number, number]> = [["{}", -16, 0], ["</>", 44, .55], ["()", 12, 1.1], ["</>", -21, 1.65], ["[]", 46, 2.2]];

/** Code: a blinking caret after the mark, with code tokens floating up around it. */
const code: Scene = {
    front: <>
        {TOKENS.map(([t, x, delay], i) => <text key={i} x={x} y="12" className={`lh-token ${i % 2 ? "lh-token--accent" : ""}`} style={{ animationDelay: `${delay}s` } as CSSProperties}>{t}</text>)}
        <rect x="38.5" y="14" width="2" height="20" className="lh-accent lh-caret" />
    </>,
};

/** Gaming: the mark holds a shield on its left and swings a sword forward off its right. */
const gaming: Scene = {
    front: <>
        <g transform="translate(-2 15)"><g className="lh-shield">
            <path d="M-6 0h12v5.5c0 5-3 8.6-6 10.2-3-1.6-6-5.2-6-10.2z" className="lh-shield-body" />
            <path d="M0 3.2 3 7 0 10.8-3 7z" className="lh-accent" />
        </g></g>
        <path d="M23.5 10.5 A21.9 21.9 0 0 1 55.8 37.6" className="lh-slash" pathLength={1} />
        <g transform="translate(36 26)"><g className="lh-sword">
            <path d="M-1.3 -1.5 L-1.3 -17 L0 -19.5 L1.3 -17 L1.3 -1.5z" className="lh-blade" />
            <line x1="0" y1="-4" x2="0" y2="-16" className="lh-fuller" />
            <rect x="-4.2" y="-1.8" width="8.4" height="1.8" rx=".6" className="lh-accent" />
            <rect x="-.8" y="0" width="1.6" height="4.2" className="lh-grip" />
            <circle cx="0" cy="5" r="1.2" className="lh-accent" />
        </g></g>
    </>,
};

/** Window event (detail: boolean) from elsewhere on the page asking the header logo to show / hide its scene. */
export const LOGO_PEEK_EVENT = "logo-hobby-peek";

const SCENES: Scene[] = [tennis, drone, code, gaming];
const VIEWBOX = "-26 -14 92 64";

export default function LogoHobbies({ hover, layer }: { hover: number, layer: "back" | "front" }) {
    if (hover < 1) { return null }
    const scene = SCENES[(hover - 1) % SCENES.length];
    // Keyed on the hover count so every hover restarts its scene from the first frame.
    return <svg key={hover} viewBox={VIEWBOX} aria-hidden="true" className={`logo-hobbies logo-hobbies--${layer}`}>{scene[layer]}</svg>
}
