import SideNavigation from "@/app/_components/SideNavigation";
import {ReactNode} from "react";

export default function AccountLayout({children}:Readonly<{children: ReactNode}>) {
    return (
        <div className="grid grid-cols-[16rem_1fr] h-full gap-16">
            <SideNavigation />
            {children}
        </div>
    )
}