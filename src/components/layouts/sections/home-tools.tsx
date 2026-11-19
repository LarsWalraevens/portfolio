import javascript from '@/../public/img/javascript.png';
import nextjs from '@/../public/img/nextjs.png';
import react from '@/../public/img/react.png';
import svelte from '@/../public/img/svelte.png';
import tailwind from '@/../public/img/tailwind.png';
import typescript from '@/../public/img/typescript.png';
import Image from "next/image";

const tools = [
    { src: react, alt: "React" },
    { src: nextjs, alt: "Next.js" },
    { src: svelte, alt: "Svelte" },
    { src: javascript, alt: "JavaScript" },
    { src: typescript, alt: "TypeScript" },
    { src: tailwind, alt: "Tailwind CSS" },
];

/** The six tools as chamfered tiles; used inside the About section. */
export function ToolsGrid() {
    return <ul className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {tools.map((tool) => <li key={tool.alt} className="group chamfer chamfer-hover [--chamfer:8px] hover:[--chamfer:16px] h-24 max-sm:h-20 flex items-center justify-center bg-ink px-6 hover:bg-raised">
            <Image
                quality={100}
                src={tool.src}
                alt={tool.alt}
                title={tool.alt}
                // Fixed CSS height (natural height, capped) so the rendered size doesn't depend on
                // which srcset density the browser picks; these source PNGs are only 1x.
                style={{ height: Math.min(tool.src.height, 36), width: "auto" }}
                className="max-w-full object-contain grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            />
        </li>)}
    </ul>
}
