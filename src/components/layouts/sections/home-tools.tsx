import javascript from '@/../public/img/javascript.png';
import svelte from '@/../public/img/svelte.png';
import nextjs from '@/../public/img/nextjs.png';
import react from '@/../public/img/react.png';
import tailwind from '@/../public/img/tailwind.png';
import typescript from '@/../public/img/typescript.png';
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { HomeSectionProps } from "./home-hero";

export default function HomeToolsSection(props: HomeSectionProps) {
    const { t } = useTranslation('common');

    return <>
        <section id="tools" className="bg-black-300 pb-[25px] border-b border-b-black-200 relative">
            <div className="container container-sm wrapper mx-auto relative">
                <div className="flex items-center justify-around max-lg:hidden">
                    <Image quality={100} src={react} className='mx-4' alt="react-logo" />
                    <Image quality={100} src={nextjs} className='mx-4' alt="nextjs-logo" />
                    <Image quality={100} src={svelte} className='mx-4' width={128} alt="svelte-logo" />
                    <Image quality={100} src={javascript} className='mx-4' alt="javascript-logo" />
                    <Image quality={100} src={typescript} className='mx-4' alt="typescript-logo" />
                    <Image quality={100} src={tailwind} className='mx-4' alt="tailwind-logo" />
                </div>
                <div
                    className="lg:hidden relative mt-[-10px]">
                    <span className="uppercase italic hidden font-secondary text-base font-semibold max-lg:w-full text-center max-lg:mb-3 max-lg:sticky max-lg:inline-block">{t("section_tools_title")}</span>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        className="relative !pb-[20px]"
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        pagination={true}
                        modules={[Pagination, Autoplay, Navigation]}
                    // pagination={{
                    //     clickable: true,
                    //     el: '.swiper-pagination',
                    //     type: 'bullets',
                    // }}
                    >
                        <SwiperSlide>
                            <Image quality={100} src={react} className='mx-auto flex items-center' alt="react-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={nextjs} className='mx-auto flex items-center' alt="nextjs-logo" />
                        </SwiperSlide>
                        <SwiperSlide >
                            <Image quality={100} src={svelte} className='mx-auto flex items-center' alt="svelte-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={javascript} className='mx-auto flex items-center' alt="javascript-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={typescript} className='mx-auto flex items-center' alt="typescript-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={tailwind} className='mx-auto flex items-center' alt="tailwind-logo" />
                        </SwiperSlide>
                    </Swiper>
                </div>
                <span className="uppercase text-grey-500 absolute right-10 bottom-[-20px] font-special text-[0.6rem] font-semibold max-lg:hidden">{t("section_tools_title")}</span>
            </div>
        </section>
    </>
}