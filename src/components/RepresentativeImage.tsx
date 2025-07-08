'use client'

import { useState, useEffect } from "react";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import { CollDataType } from "@src/data/collData";

type RepresentativeImageProps = {
    familyName: string;
    subfamilyName?: string;
    genusName?: string;
    speciesName?: string;
    className?: string;
    alt?: string;
};

const extractRepresentativeImageUrl = (specimen: CollDataType): string | null => {
    return (
        specimen.imageFiles?.find((img) => img.name.includes("A_dorsal"))?.url ?? null
    );
};

export default function RepresentativeImage({
                                                familyName,
                                                subfamilyName,
                                                genusName,
                                                speciesName,
                                                className = "w-full h-64 rounded bg-white",
                                                alt = "대표 이미지",
                                            }: RepresentativeImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            setStatus("loading");

            try {
                const allData = await getCachedCollectionData();

                const matchedSpecimen = allData.find((specimen) =>
                    specimen.family_name === familyName &&
                    (!subfamilyName || specimen.subfamily_name === subfamilyName) &&
                    (!genusName || specimen.genus_name === genusName) &&
                    (!speciesName || specimen.species_name === speciesName)
                );

                const image = matchedSpecimen
                    ? extractRepresentativeImageUrl(matchedSpecimen)
                    : null;

                if (isMounted) {
                    if (image) {
                        setImageUrl(image);
                        setStatus("ready");
                    } else {
                        setStatus("error");
                    }
                }
            } catch (err) {
                if (isMounted) setStatus("error");
                console.error("대표 이미지 로드 실패:", err);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [familyName, subfamilyName, genusName, speciesName]);

    if (status === "loading") {
        return (
            <div className={`${className} animate-pulse flex items-center justify-center`}>
                <span className="text-gray-400 text-sm">로딩 중...</span>
            </div>
        );
    }

    if (status === "error" || !imageUrl) {
        return (
            <div className={`${className} flex items-center justify-center`}>
                <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={`${className}  object-contain aspect-[4/3] rounded bg-white`}
            loading="lazy"
            onError={() => setStatus("error")}
        />
    );
}