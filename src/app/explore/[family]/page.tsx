'use client'

import {useEffect, useMemo, useState} from "react";
import {For} from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import Breadcrumb from "@src/components/Breadcrumb";
import {ImageCard} from "@src/components/ImageCard";
import {ExploreTitle} from "@src/components/ExploreTitle";

export default function FamilyPage({params}: { params: { family: string } }) {
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);
    const familyName = decodeURIComponent(params.family);

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

    const familyData = useMemo(() => {
        return collData.filter(item => item.family_name === familyName);
    }, [collData, familyName]);


    const subfamilies = useMemo(() => {
        const subfamilies = Array.from(new Set(collData.map(item => item.subfamily_name).filter(Boolean)));
        const result = subfamilies.map((subfamily) => ({
            subFamilyName: subfamily,
            specimens: collData.filter((item => item.subfamily_name === subfamily && item.imageFiles && item.imageFiles.length > 0))

        })).map((subfamily) => {
            const imageList = subfamily.specimens.flatMap((specimen) => specimen.imageFiles)
            const representativeImageUrl = imageList.find(img => img?.name.includes("A_dorsal"))?.url || imageList[0]?.url


            return {
                ...subfamily,
                representativeImageUrl
            };
        })
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
                <Breadcrumb familyName={familyName}/>
                <ExploreTitle title={familyName} subtitle={"family"}/>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For of={subfamilies}>
                        {(subfamily) => (
                            <ImageCard
                                href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamily.subFamilyName)}`}
                                imageUrl={subfamily.representativeImageUrl}
                                description={subfamily.subFamilyName}/>

                        )}
                    </For>
                </div>
            </div>
        </DefaultSection>
    );
}