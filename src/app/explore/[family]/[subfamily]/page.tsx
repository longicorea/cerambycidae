'use client'

import {useEffect, useMemo, useState} from "react";
import {For} from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import Breadcrumb from "@src/components/Breadcrumb";
import {ExploreTitle} from "@src/components/ExploreTitle";
import {ImageCard} from "@src/components/ImageCard";

export default function SubfamilyPage({params}: { params: { family: string, subfamily: string } }) {
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);
    const familyName = decodeURIComponent(params.family);
    const subfamilyName = decodeURIComponent(params.subfamily);

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

    const subfamilyData = useMemo(() => {
        return collData.filter(item =>
            item.family_name === familyName && item.subfamily_name === subfamilyName
        );
    }, [collData, familyName, subfamilyName]);

    const genera = useMemo(() => {


        const genera = Array.from(new Set(subfamilyData.map(item => item.genus_name).filter(Boolean)));
        const result = genera.map((genus) => ({
            genusName: genus,
            specimens: collData.filter((item => item.genus_name === genus && item.imageFiles && item.imageFiles.length > 0))

        })).map((genus) => {
            const imageList = genus.specimens.flatMap((specimen) => specimen.imageFiles)
            const representativeImageUrl = imageList.find(img => img?.name.includes("A_dorsal"))?.url || imageList[0]?.url


            return {
                ...genus,
                representativeImageUrl
            };
        }).sort((a, b) => {
            return a.genusName.localeCompare(b.genusName)
        });
        return result;
    }, [subfamilyData]);

    const genusCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        subfamilyData.forEach(item => {
            if (item.genus_name) {
                counts[item.genus_name] = (counts[item.genus_name] || 0) + 1;
            }
        });
        return counts;
    }, [subfamilyData]);

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
            <div className="py-4  w-[1280px] max-w-[1280px] min-w-[1280px]">
                <Breadcrumb familyName={familyName} subfamilyName={subfamilyName}/>
                <ExploreTitle title={subfamilyName} subtitle={"Subfamily"}/>

                <div className={"h-[800px] overflow-y-scroll"}>
                    <div className="flex flex-wrap gap-4 justify-start">
                        <For of={genera}>
                            {(genus) => (
                                <ImageCard
                                    href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName)}/${encodeURIComponent(genus.genusName)}`}
                                    imageUrl={genus.representativeImageUrl}
                                    description={genus.genusName}/>

                            )}
                        </For>
                    </div>
                </div>
            </div>
        </DefaultSection>
    );
}