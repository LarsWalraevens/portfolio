import { githubIcon, linkedInIcon, logoIcon, mailIcon } from '@/assets/icons/icons';
import { useAppStore } from '@/components/utils/appStore';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Slide } from 'react-awesome-reveal';

export default function Header() {
    // # STORE
    const appStore = useAppStore();

    // # CLIENT STATES
    const [showMenu, setShowMenu] = useState(false);

    // # UTILS
    const { t, lang } = useTranslation('common');
    const navMobileClasses = `py-3 mb-4 w-full border-grey-500 border-y border-opacity-50 bg-black-200 bg-opacity-50 h-full relative`;
    const UnderlineMenuEffect = () => <span className="absolute bottom-[13%] left-[2%] !skew-x-[45deg] z-[-1] w-0 h-2 bg-[#3c8ae5cc] transition-all group-hover:w-full " />;

    const router = useRouter();
    const { locale } = router;

    const changeLang = (newLang: "nl" | "en") => {
        router.push(router.asPath.split("#")[0], router.asPath.split("#")[0], { locale: newLang });
    }
    return <>
        {
            !showMenu ? null :
                // MOBILE
                <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-black-300">
                    <div className="flex justify-between items-center mx-4 mt-5">
                        <div className="scale-[130%] ml-[4px] mt-[-3px] w-[30px]">{logoIcon}</div>
                        <div className='flex items-center no-select' onClick={(e) => changeLang(lang === "nl" ? 'en' : 'nl')}>
                            <span className={`cursor-pointer text-[1.2rem]`}>EN</span>
                            <span className='mx-2 lang-stripe relative'>
                                <span id="stripe" className={`absolute ${lang.toUpperCase() === "EN" ? "" : "right-0"}`}>
                                    <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="16" height="4" rx="2" fill="white" />
                                    </svg>
                                </span>
                                <svg width="31" height="4" viewBox="0 0 31 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="31" height="3.99999" rx="2" fill="#393939" />
                                </svg>
                            </span>
                            <span className={`cursor-pointer text-[1.2rem]`} >NL</span>
                        </div>
                        <div onClick={() => setShowMenu(false)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 19L19 1M1 1L19 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    {/* <span className="absolute right-[10vw] top-[18%] ">{rightSideEffectIcon}</span> */}
                    {/* <span className="absolute left-[10vw] top-[18%] rotate-[-90deg] ">{rightSideEffectIcon}</span> */}
                    <div className='flex flex-col items-center justify-center h-[80%] max-lg:min-h-[600px]'>
                        <nav className="flex item-center flex-col justify-center w-full text-center">
                            <div onClick={() => setShowMenu(false)} className={`${navMobileClasses}`}>
                                <Link id="nav-item" className='relative w-full h-full inline-block' href="/#about" passHref>
                                    <span className="underline-title relative text-[2rem]">
                                        {t("nav_about")}
                                    </span>
                                </Link>
                            </div>
                            <div onClick={() => setShowMenu(false)} className={`${navMobileClasses}`}>
                                <Link id="nav-item" className='relative w-full h-full inline-block' href="/#projects" passHref>
                                    <span className="underline-title relative text-[2rem]">
                                        {t("nav_projects")}
                                    </span>
                                </Link>
                            </div>
                            <div onClick={() => setShowMenu(false)} className={`${navMobileClasses}`}>
                                <Link id="nav-item" className='relative w-full h-full inline-block' href="/#contact" passHref>
                                    <span className="underline-title relative text-[2rem]">
                                        {t("nav_contact")}
                                    </span>
                                </Link>
                            </div>
                            <div className="my-5 mt-7 w-full inline-block">
                                <a
                                    href={locale === "nl" ? process.env.NEXT_PUBLIC_RESUME_NL : process.env.NEXT_PUBLIC_RESUME_EN}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    id="nav-resume"
                                    className='!text-[1.5rem] !py-3 !px-10 w-full'>
                                    {t("nav_resume")}
                                </a>
                            </div>

                            <div className="flex flex-row items-center justify-center mt-8">
                                <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="mx-3 hover:scale-110 cursor-pointer">{mailIcon}</a>
                                <a href={process.env.NEXT_PUBLIC_URL_LINKEDIN} target="_blank" rel="noreferrer noopener" title="linkedIn" className="mx-3 hover:scale-110 cursor-pointer">{linkedInIcon}</a>
                                <a href={process.env.NEXT_PUBLIC_URL_GITHUB} target="_blank" rel="noreferrer noopener" title="GitHub" className="mx-3 hover:scale-110 cursor-pointer">{githubIcon}</a>
                            </div>
                        </nav>


                    </div>
                </div>
        }
        {/* DESKTOP */}
        <Slide duration={appStore.fadeConditional(600)} delay={appStore.fadeConditional(200)} direction='down' triggerOnce>
            <header className='container container-sm mx-auto wrapper h-[65px] flex items-center justify-between'>
                <Link href="/" className='flex items-center hover:opacity-70'>
                    <span className="mr-1 scale-[140%]">
                        {logoIcon}
                    </span>
                    {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="14.2857" height="14.2857" rx="7.14286" fill="white" />
                        <path d="M6.35294 18.2773C6.47379 17.9956 6.70301 17.7663 6.96957 17.6819L11.1023 16.9331C14.0993 16.3337 16.3811 13.7755 16.656 10.75075L16.9512 7.50444C16.9771 7.21953 17.1485 6.96829 17.4044 6.84035C18.0537 6.56571 19 7.06513 19 7.87924V14.4887C19 17.201 16.8012 19.3997 14.289 19.3997H6.70953C6.08162 19.3997 5.67322 18.1389 6.35294 17.2773Z" fill="white" />
                    </svg> */}
                    <span className='ml-3 text-[20px] font-special max-lg:text-[17px]'>Lars Walraevens</span>
                </Link>
                <span className="max-lg:!block hidden" onClick={() => setShowMenu(!showMenu)}>
                    <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H25V2.25H0V0ZM5 7.875H25V10.125H5V7.875ZM0 15.75H25V18H0V15.75Z" fill="white" />
                    </svg>
                </span>
                <div className='flex items-center max-lg:hidden'>
                    <nav className='relative flex flex-row items-center justify-center'>
                        <Link id="nav-item" href="/#about" className='font-secondary relative group' passHref >
                            {t("nav_about")}
                            <UnderlineMenuEffect />
                        </Link>
                        <Link id="nav-item" href="/#projects" className='font-secondary relative group' passHref>
                            {t("nav_projects")}
                            <UnderlineMenuEffect />
                        </Link>
                        <Link id="nav-item" href="/#contact" className='font-secondary relative group' passHref>
                            {t("nav_contact")}
                            <UnderlineMenuEffect />
                        </Link>
                        <a href={locale === "nl" ? process.env.NEXT_PUBLIC_RESUME_NL : process.env.NEXT_PUBLIC_RESUME_EN} target='_blank' rel='noopener noreferrer' id="nav-resume" className='text-base'>{t("nav_resume")}</a>
                    </nav>
                    <div className='flex items-center ml-4 cursor-pointer' onClick={(e) => changeLang(lang === "nl" ? 'en' : 'nl')}>
                        <span className={`${locale === "nl" ? 'hover:opacity-60' : 'pointer-events-none !cursor-default'}`}>EN</span>
                        <span className='mx-2 lang-stripe relative'>
                            <span id="stripe" className={`absolute ${lang.toUpperCase() === "EN" ? "" : "right-0"}`}>
                                <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="16" height="4" rx="2" fill="white" />
                                </svg>
                            </span>
                            <svg width="31" height="4" viewBox="0 0 31 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="31" height="3.99999" rx="2" fill="#393939" />
                            </svg>
                        </span>
                        <span className={`${locale === "nl" ? 'pointer-events-none !cursor-default' : 'hover:opacity-60'}`}>NL</span>
                    </div>
                </div>
            </header>
        </Slide>
    </>
}