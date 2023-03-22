import { logoIcon } from "@/assets/icons/icons";

export default function Footer() {
    return <>
        <footer className="bg-black-300 py-[15px] border-y border-y-black-200 relative">

            <div className="container container-sm wrapper mx-auto relative flex justify-center items-center font-secondary">
                <span className="mr-2">{logoIcon}</span> Lars Walraevens - 2023
            </div>
        </footer>
    </>
}