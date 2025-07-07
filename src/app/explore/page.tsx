'use client'

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { For } from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import { CollDataType } from "@src/data/collData";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import RepresentativeImage from "@src/components/RepresentativeImage";

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
        return Array.from(new Set(collData.map(item => item.family_name).filter(Boolean)));
    }, [collData]);
    
    const familyCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        collData.forEach(item => {
            if (item.family_name) {
                counts[item.family_name] = (counts[item.family_name] || 0) + 1;
            }
        });
        return counts;
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
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Family 목록</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For of={families}>
                        {(family) => (
                            <Link 
                                href={`/explore/${encodeURIComponent(family)}`}
                                className="block border rounded-lg hover:bg-gray-50 transition-colors overflow-hidden w-fit"
                            >

                                    <RepresentativeImage
                                        familyName={family}
                                        className="w-40 h-96  object-cover"
                                        alt={`${family} 대표 이미지`}
                                    />
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                                            {family}
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            {familyCounts[family] || 0} 종
                                        </p>
                                    </div>

                            </Link>
                        )}
                    </For>
                </div>
            </div>
        </DefaultSection>
    );
}