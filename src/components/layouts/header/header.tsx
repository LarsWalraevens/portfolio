import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import envir from '@/assets/data/envir.json';
import { useState } from 'react';
import { githubIcon, linkedInIcon, logoIcon, mailIcon } from '@/assets/icons/icons';
import { Bounce, Fade, Slide } from 'react-awesome-reveal';
import { useAppStore } from '@/components/utils/appStore';

export default function Header() {
    // # STORE
    const appStore = useAppStore();

    // # CLIENT STATES
    const [showMenu, setShowMenu] = useState(false);

    // # UTILS
    const { t, lang } = useTranslation('common');
    const navMobileClasses = `py-3 mb-4 w-full border-grey-500 border-y border-opacity-50 bg-black-200 bg-opacity-50 h-full relative`;
    const UnderlineMenuEffect = () => <span className="absolute bottom-[13%] left-[2%] !skew-x-[45deg] z-[-1] w-0 h-2 bg-[#4e4e4e] transition-all group-hover:w-full " />;

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
                    <div className='flex flex-col items-center justify-center min-h-[80%]'>
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
                                    href={locale === "nl" ? envir.RESUME_NL : envir.RESUME_EN}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    id="nav-resume"
                                    className='!text-[1.5rem] !py-3 !px-10 w-full'>
                                    {t("nav_resume")}
                                </a>
                            </div>

                            <div className="flex flex-row items-center justify-center mt-8">
                                <a href={`mailto:${envir.EMAIL}`} className="mx-3 hover:scale-110 cursor-pointer">{mailIcon}</a>
                                <a href={envir.URL_LINKEDIN} target="_blank" rel="noreferrer noopener" title="linkedIn" className="mx-3 hover:scale-110 cursor-pointer">{linkedInIcon}</a>
                                <a href={envir.URL_GITHUB} target="_blank" rel="noreferrer noopener" title="GitHub" className="mx-3 hover:scale-110 cursor-pointer">{githubIcon}</a>
                            </div>
                        </nav>


                    </div>
                </div>
        }
        {/* DESKTOP */}
        <Slide duration={appStore.fadeConditional(600)} delay={appStore.fadeConditional(200)} direction='down' triggerOnce>
            <header className='container container-sm mx-auto wrapper h-[65px] flex items-center justify-between'>
                <Link href="/" className='flex items-center hover:opacity-70'>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="12.8571" height="12.8571" rx="6.42857" fill="white" />
                        <path d="M5.75403 16.7773C5.87489 16.5356 6.1041 16.3663 6.37067 16.3219L10.5035 15.6331C13.4995 15.1337 15.7811 12.6755 16.056 9.65075L16.3512 6.40444C16.3771 6.11953 16.5485 5.86829 16.8044 5.74035C17.3537 5.46571 18 5.86513 18 6.47924V13.0887C18 15.801 15.8012 17.9997 13.089 17.9997H6.50953C5.88162 17.9997 5.47322 17.3389 5.75403 16.7773Z" fill="white" />
                    </svg>
                    <span className='ml-3 text-[19px] font-special max-lg:text-[17px]'>Lars Walraevens</span>
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
                        <a href={locale === "nl" ? envir.RESUME_NL : envir.RESUME_EN} target='_blank' rel='noopener noreferrer' id="nav-resume">{t("nav_resume")}</a>
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