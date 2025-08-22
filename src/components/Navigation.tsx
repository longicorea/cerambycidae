'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import ThemeToggle from "./ThemeToggle";

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
                isActive ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
            {label}
        </Link>)
}

export default function Navigation() {
    return (
        <nav className="h-16 bg-white dark:bg-slate-900/30 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full mx-auto px-4  h-full flex flex-row items-center justify-center ">
                <div className="w-[1280px] flex flex-row justify-between items-center  ">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                            LongiHUB
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="relative group">
                            <MenuLink targetUrl={"/about/longihub"} label="About"/>
                            <div
                                className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border border-gray-200 dark:border-gray-700">
                                <div className="py-2">
                                    <Link href="/about/longihub"
                                          className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700">LongiHUB?</Link>
                                    <Link href="/about/seunghyunlee"
                                          className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700">Seunghyun
                                        Lee</Link>
                                    <Link href="/about/contributors"
                                          className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700">Contributors</Link>
                                </div>
                            </div>
                        </div>
                        <MenuLink targetUrl={"/explore"} label={"Explore"}/>
                        <ThemeToggle/>
                    </div>
                </div>
            </div>
        </nav>
    );
}