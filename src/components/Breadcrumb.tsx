import Link from "next/link";
import {When} from "react-if";


export default function Breadcrumb({ familyName,subfamilyName,genusName,speciesName }: { familyName: string; subfamilyName?: string; genusName?: string; speciesName?: string }) {
    return (
        <nav className="mb-6 space-x-2">
            <Link href="/explore" className="text-blue-600 hover:text-blue-800">
                Family
            </Link>
            <span className="text-gray-500">{'>'}</span>
            <Link href={`/explore/${encodeURIComponent(familyName)}`} className="text-blue-600 hover:text-blue-800">
                {familyName}
            </Link>
            <When condition={!!subfamilyName}>
                <span className="text-gray-500">{'>'}</span>
                <Link href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName!)}`}
                      className="text-blue-600 hover:text-blue-800">
                    {subfamilyName}
                </Link>
                <When condition={!!genusName}>
                <span className="text-gray-500">{'>'}</span>
                    <Link
                        href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName!)}/${encodeURIComponent(genusName!)}`}
                        className="text-blue-600 hover:text-blue-800">
                        {genusName}
                    </Link>
                    <span className="text-gray-500">{'>'}</span>
                    <When condition={!!speciesName}>
                        <span className="text-gray-700">{genusName} {speciesName}</span>
                    </When>
                </When>
            </When>
        </nav>
    );
}