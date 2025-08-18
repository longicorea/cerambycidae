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
            className={`text-base font-base transition-colors ${
                isActive ? 'text-slate-800 font-medium' : 'text-slate-400 hover:text-slate-700'
            }`}
        >
            {label}
        </Link>)
}

export default function Navigation() {
    return (
        <nav className="h-16 bg-white">
            <div className="w-full mx-auto px-4  h-full flex flex-row items-center justify-center ">
                <div className="w-[1280px] flex flex-row justify-between items-center  ">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            LongiHUB
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="relative group">
                            <MenuLink targetUrl={"/about/longihub"} label="About"/>
                            <div
                                className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="py-2">
                                    <Link href="/about/longihub"
                                          className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50">LongiHUB?</Link>
                                    <Link href="/about/seunghyunlee"
                                          className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50">Seunghyun
                                        Lee</Link>
                                    <Link href="/about/contributors"
                                          className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50">Contributors</Link>
                                </div>
                            </div>
                        </div>
                        <MenuLink targetUrl={"/explore"} label={"Explore"}/>
                        <MenuLink targetUrl={"/about"} label={"About"}/>
                    </div>
                </div>
            </div>
        </nav>
    );
}