'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";

function MenuLink({targetUrl, label}: { targetUrl: string, label: string }) {
    const pathname = usePathname()
    const isActive =
        targetUrl === '/'
            ? pathname === '/'
            : pathname.startsWith(targetUrl)

    return (
        <Link
            href={targetUrl}
            className={`text-sm font-base transition-colors ${
                isActive ? 'text-slate-800 font-medium' : 'text-slate-400 hover:text-slate-700'
            }`}
        >
            {label}
        </Link>)
}

export default function Navigation() {
    return (
        <nav className="h-16 bg-white ">
            <div className="max-w-7xl mx-auto px-10  h-full flex flex-row items-center w-full ">
                <div className="flex flex-row justify-between items-center w-full ">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            IMMATURE DB
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <MenuLink targetUrl={"/"} label="Home"/>
                        <MenuLink targetUrl={"/explore"} label={"Explore"}/>
                        <MenuLink targetUrl={"/about"} label={"About"}/>
                    </div>
                </div>
            </div>
        </nav>
    );
}