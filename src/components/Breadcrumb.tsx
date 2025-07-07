import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="mb-6 space-x-2">
            {items.map((item, index) => (
                <span key={index} className="inline-flex items-center">
                    {index > 0 && <span className="text-gray-500 mx-2">{'>'}</span>}
                    {item.href ? (
                        <Link href={item.href} className="text-blue-600 hover:text-blue-800">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-700">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}