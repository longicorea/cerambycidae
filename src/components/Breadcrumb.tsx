import Link from "next/link";
import {When} from "react-if";

function BreadcrumbLink({href, name, isLast}: { href: string; name?: string, isLast?: boolean }) {
    return (
        <When condition={!!name}>
            <Link href={href}
                  className={isLast ? "text-slate-500 text-base underline dark:text-slate-100" : "text-slate-300 text-sm dark:text-slate-400"}>
                {name}
            </Link>
            <When condition={!isLast}>
                <span className="text-slate-300 text-sm ">{'>'}</span>
            </When>
        </When>)
}

export default function Breadcrumb({familyName, subfamilyName, genusName, speciesName}: {
    familyName: string;
    subfamilyName?: string;
    genusName?: string;
    speciesName?: string
}) {
    return (
        <nav className="mb-6 space-x-2">
            <BreadcrumbLink href="/explore" name="Coleoptera" isLast={!familyName}/>
            <BreadcrumbLink href={`/explore/${encodeURIComponent(familyName)}`} name={familyName}
                            isLast={!subfamilyName}/>
            <BreadcrumbLink href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName!)}`}
                            name={subfamilyName} isLast={!genusName}/>
            <BreadcrumbLink
                href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName!)}/${encodeURIComponent(genusName!)}`}
                name={genusName} isLast={!speciesName}/>
            <BreadcrumbLink
                href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName!)}/${encodeURIComponent(genusName!)}/${encodeURIComponent(speciesName!)}`}
                name={speciesName ? `${genusName} ${speciesName}` : undefined} isLast={true}/>
        </nav>
    );
}