import Link from "next/link";
import { heroCodeIcon, heroGamingIcon, heroHeadsetIcon, heroLaptopIcon, heroLineIcon, heroLogoIcon, heroMarkerIcon, heroWeightIcon, rightSideEffectIcon } from '@/assets/icons/icons.jsx'
import picture from '@/assets/img/picture.png';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { endIcon } from "./home-projects";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


interface HeroTooltipProps {
    text: string;
    children: any;
}

export default function HomeHeroSection() {

    // # UTILS
    const { t } = useTranslation('common');
    const HeroTooltip = (props: HeroTooltipProps) =>
        <div className="mb-4 hover:scale-110">
            <Tippy
                content={<span className="text-[0.7rem] pb-2">{props.text}</span>}
                placement="left"
            >
                <span className='mb-2 cursor-pointer relative'>{props.children}</span>
            </Tippy >
        </div>
    const heroPictureBg = <svg width="228" height="481" viewBox="0 0 228 481" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M224 481L224 3.99999L228 14.1294L228 481L224 481Z" fill="#E2E2E2" />
        <rect x="219" width="481" height="219" transform="rotate(90 219 0)" fill="url(#paint0_linear_1239_1943)" />
        <defs>
            <linearGradient id="paint0_linear_1239_1943" x1="459.5" y1="0" x2="459.5" y2="219" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E2E2E2" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>;


    return <>
        <section id="hero" className="max-md:!bg-none">
            <div className="container-sm container wrapper mx-auto h-[70vh] min-h-[600px] max-lg:min-h-[50vh] max-lg:h-auto flex flex-row justify-between max-lg:flex-col max-lg:justify-center relative ">

                <span className="absolute right-[4vw] top-[5vh] hidden max-md:inline-block">{rightSideEffectIcon}</span>
                <div className='flex items-start flex-col justify-center mt-[-30px] max-md:!mt-[-50px]'>
                    <h1 className='w-[730px] max-lg:w-[100%] max-lg:text-[30px] max-lg:leading-tight !z-100 font-special relative flex flex-wrap items-center'>
                        <div className="text-[3.1rem] max-lg:text-[30px] font-special">{t("hero_lars_is")}&nbsp;</div>
                        <div id="underline" className="text-[3.1rem] max-lg:text-[30px] font-special">{t("main_frontend_developer")}&nbsp;</div>
                        <span className="text-[3.1rem] max-lg:text-[30px] font-special mr-3">{t("hero_located_in")} </span>
                        <div className="text-[3.1rem] max-lg:text-[30px] font-special flex items-center">
                            <span className="inline-block max-lg:scale-[80%] vertical-align mr-2">{heroMarkerIcon} </span>
                            {`${t("hero_location_country")},`}&nbsp;
                        </div>
                        <span className="text-[3.1rem] max-lg:text-[30px] font-special mr-2">{t("hero_location_city")} </span>
                    </h1>
                    <div className="flex items-center mt-5">
                        <Link href="/#about" className='btn mr-3'>{t("nav_about")}</Link>
                        <Link href="/#projects" className='btn mr-3'>{t("nav_projects")}</Link>
                        <div className="max-lg:hidden">
                            <svg width="41" height="10" viewBox="0 0 41 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="3.89453" width="20" height="2" rx="1" fill="white" />
                                <rect x="31.4008" y="0.000976562" width="12.2431" height="1.74901" rx="0.874505" transform="rotate(45 31.4008 0.000976562)" fill="white" />
                                <rect width="12.2431" height="1.74901" rx="0.874505" transform="matrix(-0.707107 0.707107 0.707107 0.707107 38.9565 0.000976562)" fill="white" />
                            </svg>
                        </div>

                    </div>
                </div>
                <div className='flex items-end relative max-lg:hidden'>
                    <div className="absolute left-[-110px] z-10">
                        <Image alt="lars-walraevens-picture" quality={100} src={picture} className='h-' />
                    </div>
                    <div id="hero-image-bg" className="relative">
                        <div className='absolute right-5 bottom-[53%] flex flex-col items-center'>
                            <span className='mb-2'>{heroLogoIcon}</span>
                            <span className='mb-2'>{heroLineIcon}</span>
                            <HeroTooltip
                                text={t("hero_tooltip_music")}
                            >
                                <span className="relative">{heroHeadsetIcon}</span>
                            </HeroTooltip>
                            <HeroTooltip
                                text={t("hero_tooltip_gaming")}
                            >
                                <span className="relative">{heroGamingIcon}</span>
                            </HeroTooltip>
                            <HeroTooltip
                                text={t("hero_tooltip_code")}
                            >
                                <span className="relative">{heroCodeIcon}</span>
                            </HeroTooltip>
                            <HeroTooltip
                                text={t("hero_tooltip_weight")}
                            >
                                <span className="relative">{heroWeightIcon}</span>
                            </HeroTooltip>
                        </div>
                        {heroPictureBg}
                    </div>
                </div>
                <div className="justify-center absolute w-[95%] bottom-[0%] my-10 hidden max-lg:!flex">
                    {endIcon}
                </div>
            </div>
        </section>
    </>
}