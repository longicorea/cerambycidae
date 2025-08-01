'use client'

import {useEffect, useMemo, useState} from "react";
import {For} from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import {ImageCard} from "@src/components/ImageCard";
import Breadcrumb from "@src/components/Breadcrumb";
import {ExploreTitle} from "@src/components/ExploreTitle";

export default function ExplorePage() {
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCachedCollectionData();
                console.log(data)
                setCollData(data);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const families = useMemo(() => {
        const families = Array.from(new Set(collData.map(item => item.family_name).filter(Boolean)));
        const result = families.map((family) => ({
            familyName: family,
            specimens: collData.filter((item => item.family_name === family && item.imageFiles && item.imageFiles.length > 0))

        })).map((family) => {
            const imageList = family.specimens.flatMap((specimen) => specimen.imageFiles)
            const representativeImageUrl = imageList.find(img => img?.name.includes("A_dorsal"))?.url || imageList[0]?.url

            return {
                ...family,
                representativeImageUrl
            };
        }).sort((a, b) => {
            return a.familyName.localeCompare(b.familyName)
        });
        return result;
    }, [collData]);


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
                <Breadcrumb familyName={""}/>
                <ExploreTitle title={"Coleoptera"} subtitle={"order"}/>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For of={families}>
                        {(family) => (

                            <ImageCard
                                href={`/explore/${encodeURIComponent(family.familyName)}`}
                                imageUrl={family.representativeImageUrl}
                                description={family.familyName}/>


                        )}
                    </For>
                </div>
            </div>
        </DefaultSection>
    );
}