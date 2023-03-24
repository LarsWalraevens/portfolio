import Image from "next/image";
import typescript from '@/../public/img/typescript.png';
import react from '@/../public/img/react.png';
import nextjs from '@/../public/img/nextjs.png';
import tailwind from '@/../public/img/tailwind.png';
import javascript from '@/../public/img/javascript.png';
import jquery from '@/../public/img/jquery.png';
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

export default function HomeToolsSection() {
    const { t } = useTranslation('common');
    return <>
        <section id="tools" className="bg-black-300 py-[25px] border-y border-y-black-200 relative">
            <div className="container container-sm wrapper mx-auto relative">
                <div className="flex items-center justify-around max-lg:hidden">

                    <Image quality={100} src={react} className='mx-4' alt="react-logo" />
                    <Image quality={100} src={nextjs} className='mx-4' alt="nextjs-logo" />
                    <Image quality={100} src={javascript} className='mx-4' alt="javascript-logo" />
                    <Image quality={100} src={typescript} className='mx-4' alt="typescript-logo" />
                    <Image quality={100} src={tailwind} className='mx-4' alt="tailwind-logo" />
                    <Image quality={100} src={jquery} className='mx-4' alt="jquery-logo" />
                </div>
                <div
                    className="lg:hidden relative mt-[-10px]">
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        className="relative"
                        modules={[Pagination]}
                        pagination={{
                            clickable: true,
                        }}>
                        <SwiperSlide>
                            <Image quality={100} src={react} className='mx-auto flex items-center h-full' alt="react-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={nextjs} className='mx-auto flex items-center h-full' alt="nextjs-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={javascript} className='mx-auto flex items-center h-full' alt="javascript-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={typescript} className='mx-auto flex items-center h-full' alt="typescript-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={tailwind} className='mx-auto flex items-center h-full' alt="tailwind-logo" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image quality={100} src={jquery} className='mx-auto flex items-center h-full' alt="jquery-logo" />
                        </SwiperSlide>
                    </Swiper>
                </div>
                <span className="uppercase text-grey-500 absolute right-10 bottom-[-20px] font-special text-[10px] font-semibold">{t("section_tools_title")}</span>
            </div>
        </section>
    </>
}