import { logoIcon } from "@/assets/icons/icons";

export default function Footer() {
    return <>
        <footer className="bg-black-300 py-[15px]  relative">
            <div className="container container-sm wrapper text-base text-grey-100 mx-auto relative flex justify-center items-center font-secondary">
                <span className="mr-2">{logoIcon}</span> Lars Walraevens - 2023
            </div>
        </footer>
    </>
}