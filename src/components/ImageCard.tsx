import Link from "next/link";
import Image from "next/image";

const BadgeColor = {
    A: "bg-yellow-400",
    L: "bg-emerald-400",
    P: "bg-blue-400",
    D: "bg-red-400",
}

function SpecimenImage({imageUrl, alt}: { imageUrl: string | undefined; alt?: string }) {


    if (!imageUrl) {
        return (
            <div className="w-full h-full bg-slate-50 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
            </div>
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt ?? 'Specimen Image'}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
            }}
            fill
            sizes={"(max-width: 300px) 100vw, 300px"}
        />
    );
}

export function ImageCard({
                              href,
                              imageUrl,
                              description,
                              badge = [],
                          }: {
    href: string;
    imageUrl: string | undefined;
    description: string;
    badge?: (string | undefined)[];
}) {
    return (
        <Link
            href={href}
            className="block bg-slate-50 rounded-lg hover:bg-gray-100  overflow-hidden min-w-[280px] max-w-[280px]  transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
            <div className="flex flex-col space-y-2 justify-end items-center p-4 rounded-2xl h-96 min-w-[280px] ">
                <div className="relative grid grid-cols-1 gap-3 h-96 overflow-hidden w-full">
                    <SpecimenImage imageUrl={imageUrl}/>

                    {badge.length > 0 && (
                        <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                            {badge.filter(b => !!b).map((b, idx) => (
                                <div
                                    key={idx}
                                    className={`${BadgeColor[b!]} w-7 h-7 rounded-full  text-white text-xs font-bold flex items-center justify-center shadow-md`}
                                >
                                    {b}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 설명 */}
                <div
                    className="w-full justify-center items-start text-gray-600 text-lg text-nowrap text-ellipsis overflow-hidden">
                  <span>
                    <i>{description}</i>
                  </span>
                </div>
            </div>
        </Link>
    );
}