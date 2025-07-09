'use client'

import {useEffect, useMemo, useState} from "react";
import {For} from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import Breadcrumb from "@src/components/Breadcrumb";
import {ExploreTitle} from "@src/components/ExploreTitle";
import {ImageCard} from "@src/components/ImageCard";

function LabelText({label, value}: { label: string, value: string | number }) {
    return (
        <div className={"grid grid-cols-4 items-center space-x-2"}>
            <span className={"col-span-1 w-20"}>{label}</span>
            <span
                className={"col-span-3 text-gray-600 text-sm overflow-hidden text-nowrap text-ellipsis"}>{value}</span>
        </div>
    )
}

export default function GenusPage({params}: { params: { family: string, subfamily: string, genus: string } }) {
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);
    const familyName = decodeURIComponent(params.family);
    const subfamilyName = decodeURIComponent(params.subfamily);
    const genusName = decodeURIComponent(params.genus);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCachedCollectionData();
                setCollData(data);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const genusData = useMemo(() => {
        return collData.filter(item =>
            item.family_name === familyName &&
            item.subfamily_name === subfamilyName &&
            item.genus_name === genusName
        );
    }, [collData, familyName, subfamilyName, genusName]);

    // Species별로 그룹화
    const speciesGroups = useMemo(() => {
        return genusData.reduce((acc, item) => {
            const speciesKey = `${item.species_name}${item.subspecies_name ? `_${item.subspecies_name}` : ''}`;
            if (!acc[speciesKey]) {
                acc[speciesKey] = [];
            }
            acc[speciesKey].push(item);
            return acc;
        }, {} as Record<string, CollDataType[]>);
    }, [genusData]);

    const species = useMemo(() => {


        const speciesList = Object.keys(speciesGroups);
        const result = speciesList.map((species) => ({
            speciesName: species,
            specimens: collData.filter((item => item.species_name === species && item.imageFiles && item.imageFiles.length > 0))

        })).map((species) => {
            const imageList = species.specimens.flatMap((specimen) => specimen.imageFiles)
            const representativeImageUrl = imageList.find(img => img?.name.includes("A_dorsal"))?.url || imageList[0]?.url


            return {
                ...species,
                representativeImageUrl
            };
        })
        return result;
    }, [speciesGroups]);

    if (loading) {
        return (
            <DefaultSection>
                <div className="text-center py-8">
                    <div className="text-gray-600">데이터를 불러오는 중...</div>
                </div>
            </DefaultSection>
        );
    }

    return (
        <DefaultSection>
            <div className="py-4">
                <Breadcrumb familyName={familyName} subfamilyName={subfamilyName} genusName={genusName}/>
                <ExploreTitle title={genusName} subtitle={"Genus"}/>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For of={species}>
                        {(speciesKey) => {
                            const speciesData = speciesGroups[speciesKey.speciesName]!;
                            const firstItem = speciesData[0]!;
                            const speciesName = firstItem.genus_name + ' ' + firstItem.species_name + (firstItem.subspecies_name ? ` ${firstItem.subspecies_name}` : '');

                            return (
                                <ImageCard
                                    href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName)}/${encodeURIComponent(genusName)}/${encodeURIComponent(speciesKey.speciesName)}`}
                                    imageUrl={speciesKey.representativeImageUrl}
                                    description={speciesName}/>

                            );
                        }}
                    </For>
                </div>
            </div>
        </DefaultSection>
    );
}