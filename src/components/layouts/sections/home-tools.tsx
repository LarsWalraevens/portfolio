import Image from "next/image";
import typescript from '@/../public/img/typescript.png';
import react from '@/../public/img/react.png';
import nextjs from '@/../public/img/nextjs.png';
import tailwind from '@/../public/img/tailwind.png';
import javascript from '@/../public/img/javascript.png';
import jquery from '@/../public/img/jquery.png';
import useTranslation from "next-translate/useTranslation";

export default function HomeToolsSection() {
    const { t } = useTranslation('common');
    return <>
        <section id="tools" className="bg-black-300 py-[25px] border-y border-y-black-200 relative">
            <div className="container container-sm wrapper mx-auto relative">
                <div className="flex items-center justify-around">
                    <Image quality={100} src={react} className='hover:scale-110 cursor-pointer transition mx-4' alt="typescript-logo" />
                    <Image quality={100} src={nextjs} className='hover:scale-110 cursor-pointer transition mx-4' alt="typescript-logo" />
                    <Image quality={100} src={javascript} className='hover:scale-110 cursor-pointer transition mx-4' alt="typescript-logo" />
                    <Image quality={100} src={typescript} className='hover:scale-110 cursor-pointer transition mx-4' alt="typescript-logo" />
                    <Image quality={100} src={tailwind} className='hover:scale-110 cursor-pointer transition mx-4' alt="typescript-logo" />
                    <Image quality={100} src={jquery} className='hover:scale-110 cursor-pointer transition mx-4' alt="typescript-logo" />
                </div>
                <span className="uppercase text-grey-500 absolute right-10 bottom-[-20px] font-special text-[10px] font-semibold">{t("section_tools_title")}</span>
            </div>
        </section>
    </>
}