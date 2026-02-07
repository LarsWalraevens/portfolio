import { heroCodeIcon, heroGamingIcon, heroHeadsetIcon, heroLineIcon, heroMarkerIcon, heroDroneIcon, rightSideEffectIcon } from '@/assets/icons/icons.jsx';
import picture from '@/assets/img/picture.png';
import { useAppStore } from '@/components/utils/appStore';
import Tippy from '@tippyjs/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from "next/link";
import { Bounce, Fade } from 'react-awesome-reveal';
interface HeroTooltipProps {
    text: string;
    children: any;
}

export interface HomeSectionProps {
}

export default function HomeHeroSection(props: HomeSectionProps) {
    // # STORE
    const appStore = useAppStore();

    // # UTILS
    const { t } = useTranslation('common');
    const HeroTooltip = (props: HeroTooltipProps) =>
        <div className="mb-4 hover:scale-110">
            <Tippy
                content={<span className="text-sm pb-2">{props.text}</span>}
                placement="left"
            >
                <span className='mb-2 cursor-pointer relative'>{props.children}</span>
            </Tippy >
        </div>;

    return <>
        <section id="hero" className="max-md:!bg-none">
            <div className="container-sm container wrapper mx-auto h-[65vh] max-h-[650px] min-h-[600px] max-lg:min-h-[430px] max-lg:h-auto flex flex-row justify-between max-lg:flex-col max-lg:justify-center relative ">
                <span className="absolute right-[4vw] top-[5vh] hidden max-md:inline-block">
                    <Fade duration={appStore.fadeConditional(500)} delay={appStore.fadeConditional(300)} triggerOnce direction='right'>
                        {rightSideEffectIcon}
                    </Fade>
                </span>
                <Fade duration={appStore.fadeConditional(1000)} delay={appStore.fadeConditional(300)} triggerOnce>
                    <div className={`flex items-start flex-col justify-center mt-[-20px] max-md:!mt-[-50px] h-full`}>
                        <h1 className='w-[730px] max-lg:w-[100%] max-lg:text-[34px] max-lg:leading-tight !z-100 font-secondary font-medium relative flex flex-wrap items-center'>
                            <div className="text-base max-lg:text-[34px] lg:leading-tight font-secondary lg:!font-Marcellus lg:block lg:w-full">{t("hero_lars_is")}&nbsp;</div>
                            <div className="text-[5rem] max-lg:text-[34px] font-secondary font-bold text-[transparent] bg-clip-text animate-wave-gradient lg:leading-tight lg:mb-[-10px] mr-2">Web developer </div>
                            {/* <div id="underline" className="text-[3.3rem] max-lg:text-[34px] font-secondary font-medium">{t("main_frontend_developer")}&nbsp;</div> */}
                            <span className="text-[3.1rem] lg:!font-Marcellus max-lg:text-[34px] font-secondary font-medium lg:mr-4 mr-2">{t("hero_located_in")}</span>
                            <div className="text-[3.1rem] lg:!font-Marcellus max-lg:text-[34px] font-secondary font-medium flex items-center">
                                <span className="inline-block scale-[115%] max-lg:scale-[82%] vertical-align mr-2 lg:mr-3">{heroMarkerIcon} </span>
                                {`${t("hero_location_country")},`}&nbsp;
                            </div>
                            <span className="text-[3.3rem] max-lg:text-[34px] font-secondary font-medium mr-2 !z-100 relative">{t("hero_location_city")} </span>
                        </h1>
                        <div className="flex items-center mt-5 gap-3 flex-wrap">
                            <Link href="/#about" className='btn max-sm:grow text-medium min-h-[55px] !font-medium !font-Marcellus flex items-center justify-center'>{t("nav_about")}</Link>
                            <Link href="/#projects" className='btn max-sm:grow text-medium min-h-[55px] !font-medium !font-Marcellus flex items-center justify-center'>{t("nav_projects")}</Link>
                            <div className="max-lg:hidden">
                                <svg width="41" height="10" viewBox="0 0 41 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="3.89453" width="20" height="2" rx="1" fill="white" />
                                    <rect x="31.4008" y="0.000976562" width="12.2431" height="1.74901" rx="0.874505" transform="rotate(45 31.4008 0.000976562)" fill="white" />
                                    <rect width="12.2431" height="1.74901" rx="0.874505" transform="matrix(-0.707107 0.707107 0.707107 0.707107 38.9565 0.000976562)" fill="white" />
                                </svg>
                            </div>

                        </div>
                    </div>
                </Fade>
                <Fade duration={appStore.fadeConditional(600)} delay={appStore.fadeConditional(900)} direction='right' triggerOnce>
                    <div className='flex items-end relative h-full max-lg:hidden' >
                        <div className="absolute z-[1] right-12 bottom-[-10px] max-[1280px]:right-[-20px]" style={{ width: 310 }}>
                            <span
                                style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)" }}
                                className="absolute z-[-1] max-[1280px]:hidden bottom-2 left-[-17%] w-[130%] h-[35%] rotate-[20deg]"
                            />
                            <Image alt="lars-walraevens-picture" className='z-1' quality={100} src={picture} />
                        </div>
                        <div className="max-[1280px]:opacity-0">
                            <div className='absolute z-10 right-0 bottom-[12%] flex flex-col items-center '>
                                <Fade duration={appStore.fadeConditional(500)} delay={appStore.fadeConditional(1700)} triggerOnce>
                                    <div className="flex items-center justify-center flex-col">
                                        {/* <span className='mb-2 '>{heroLogoIcon}</span> */}
                                        <span className='flex uppercase flex-row items-center text-white-100'>
                                            <span style={{ writingMode: 'vertical-rl' }} className="!font-Marcellus text-base">Hover 👇</span>
                                            <span style={{ writingMode: 'vertical-rl' }} className="font-secondary text-sm"></span>
                                        </span>
                                        <span className='mb-[10px] mt-[10px] opacity-40'>{heroLineIcon}</span>
                                    </div>

                                </Fade>
                                <Bounce duration={appStore.fadeConditional(500)} delay={appStore.fadeConditional(2200)} triggerOnce>
                                    <HeroTooltip
                                        text={t("hero_tooltip_music")}
                                    >
                                        <span className="relative opacity-80 hover:opacity-100">{heroHeadsetIcon}</span>
                                    </HeroTooltip>

                                </Bounce>
                                <Bounce duration={appStore.fadeConditional(500)} delay={appStore.fadeConditional(2600)} triggerOnce>
                                    <HeroTooltip
                                        text={t("hero_tooltip_gaming")}
                                    >
                                        <span className="relative opacity-80 hover:opacity-100">{heroGamingIcon}</span>
                                    </HeroTooltip>
                                </Bounce>
                                <Bounce duration={appStore.fadeConditional(500)} delay={appStore.fadeConditional(3000)} triggerOnce>
                                    <HeroTooltip
                                        text={t("hero_tooltip_code")}
                                    >
                                        <span className="relative opacity-80 hover:opacity-100">{heroCodeIcon}</span>
                                    </HeroTooltip>
                                </Bounce>
                                <Bounce duration={appStore.fadeConditional(500)} delay={appStore.fadeConditional(3400)} triggerOnce>
                                    <HeroTooltip
                                        text={t("hero_tooltip_drone")}
                                    >
                                        <span className="relative opacity-80 hover:opacity-100">{heroDroneIcon}</span>
                                    </HeroTooltip>
                                </Bounce>
                            </div>
                        </div>
                    </div>
                </Fade>
            </div>
        </section>
    </>
}

const endIcon = <svg width="11" height="55" viewBox="0 0 11 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" width="30" height="1.99999" rx="0.999997" transform="rotate(90 6 0)" fill="white" />
    <rect x="10.0433" y="45.2363" width="12.2431" height="1.74901" rx="0.874505" transform="rotate(135 10.0433 45.2363)" fill="white" />
    <rect width="12.2431" height="1.74901" rx="0.874505" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 10.0433 52.792)" fill="white" />
</svg>;
