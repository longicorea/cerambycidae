import Link from "next/link";

interface TaxonCardProps {
    name: string;
    count: number;
    href: string;
    description?: string;
}

export default function TaxonCard({ name, count, href, description }: TaxonCardProps) {
    return (
        <Link 
            href={href}
            className="block p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
            <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                {name}
            </h2>
            <p className="text-gray-600 mt-2">
                {count} 종
            </p>
            {description && (
                <p className="text-gray-500 text-sm mt-1">
                    {description}
                </p>
            )}
        </Link>
    );
}