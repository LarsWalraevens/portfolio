import { lwLogoIcon } from "@/assets/icons/icons";

export default function Footer() {
    return <>
        <footer className="bg-black-300 py-[15px]  relative">
            <div className="container container-sm wrapper text-base text-grey-100 mx-auto relative flex justify-center items-center font-secondary">
                <span className="mr-2 inline-block h-5">{lwLogoIcon}</span> Lars Walraevens - 2026
            </div>
        </footer>
    </>
}