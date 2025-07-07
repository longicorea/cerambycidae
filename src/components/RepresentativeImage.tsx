'use client'

import { useState, useEffect } from "react";
import { getRepresentativeImageForTaxon } from "@src/lib/imageCache";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import { CollDataType } from "@src/data/collData";

interface RepresentativeImageProps {
    familyName: string;
    subfamilyName?: string;
    genusName?: string;
    speciesName?: string;
    className?: string;
    alt?: string;
}

export default function RepresentativeImage({
    familyName,
    subfamilyName,
    genusName,
    speciesName,
    className = "w-full h-64 object-fit rounded",
    alt = "대표 이미지"
}: RepresentativeImageProps) {

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadImage = async () => {
            setLoading(true);
            setError(false);

            try {
                const allData = await getCachedCollectionData();

                const filteredSpecimens = allData.filter((specimen: CollDataType) =>
                    specimen.family_name === familyName &&
                    (!subfamilyName || specimen.subfamily_name === subfamilyName) &&
                    (!genusName || specimen.genus_name === genusName) &&
                    (!speciesName || specimen.species_name === speciesName)
                );

                const representativeImageUrl =
                    filteredSpecimens
                        .map((specimen) =>
                            (specimen.imageFiles ?? []).find((img) =>
                                img.name.includes("A_dorsal")
                            )?.thumbnailLink ?? null
                        )
                        .find((url) => url !== null) ?? null;

                console.log("대표 이미지 URL:", representativeImageUrl);
                setImageUrl(representativeImageUrl);
            } catch (err) {
                console.error("대표 이미지 로드 실패:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [familyName, subfamilyName, genusName, speciesName]);

    if (loading) {
        return (
            <div
                className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
            >
                <span className="text-gray-400 text-sm">로딩 중...</span>
            </div>
        );
    }

    if (error || !imageUrl) {
        console.log(error)
        console.log(imageUrl)
        console.warn("이미지 로드 실패:", {
            familyName,
            subfamilyName,
            genusName,
            speciesName,
            imageUrl,
            error,
        });

        return (
            <div
                className={`${className} bg-gray-100 flex items-center justify-center`}
            >
                <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
        );
    }

    return (
        <img
            src={`/cerambycidae/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
            alt={alt}
            className={className}
            onError={(e) => {
                console.log(e)
                setError(true)
            }}
        />
    );
}