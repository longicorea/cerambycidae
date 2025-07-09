import Link from "next/link";

function SpecimenImage({imageUrl, alt}: { imageUrl: string | undefined; alt?: string }) {


    if (!imageUrl) {
        return (
            <div className="w-full h-full bg-slate-50 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
    );
}

export function ImageCard({href, imageUrl, description}: {
    href: string,
    imageUrl: string | undefined,
    description: string
}) {
    return (<Link
        href={href}
        className="block bg-slate-50 rounded-lg hover:bg-gray-100 transition-colors overflow-hidden min-w-[300px] max-w-[300px]"
    >
        <div
            className={"flex flex-col space-y-2 justify-end items-center p-4  rounded-2xl h-96 min-w-[300px]"}>
            <div className="grid grid-cols-1 gap-3 h-96 overflow-hidden w-full">
                <SpecimenImage imageUrl={imageUrl}/>
            </div>
            <div className={"grid  w-full justify-center items-start gap-2 text-gray-600"}>
                <span><i>{description}</i></span>
            </div>


        </div>
    </Link>)
}