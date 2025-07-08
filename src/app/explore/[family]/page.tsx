'use client'

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { For } from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import { CollDataType } from "@src/data/collData";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import RepresentativeImage from "@src/components/RepresentativeImage";
import Breadcrumb from "@src/components/Breadcrumb";

export default function FamilyPage({ params }: { params: { family: string } }) {
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
        return Array.from(new Set(familyData.map(item => item.subfamily_name).filter(Boolean)));
    }, [familyData]);
    
    const subfamilyCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        familyData.forEach(item => {
            if (item.subfamily_name) {
                counts[item.subfamily_name] = (counts[item.subfamily_name] || 0) + 1;
            }
        });
        return counts;
    }, [familyData]);
    
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
                <Breadcrumb familyName={familyName} />


                <h1 className="text-3xl font-bold mb-8 text-center">
                    {familyName} - Subfamily 목록
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For of={subfamilies}>
                        {(subfamily) => (
                            <Link 
                                href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamily)}`}
                                className="block border rounded-lg hover:bg-gray-50 transition-colors overflow-hidden"
                            >
                                <RepresentativeImage 
                                    familyName={familyName}
                                    subfamilyName={subfamily}

                                    alt={`${subfamily} 대표 이미지`}
                                />
                                <div className="p-4 text-center">
                                    <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                                        {subfamily}
                                    </h2>

                                </div>
                            </Link>
                        )}
                    </For>
                </div>
            </div>
        </DefaultSection>
    );
}