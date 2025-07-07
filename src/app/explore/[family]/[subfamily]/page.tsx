'use client'

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { For } from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import { CollDataType } from "@src/data/collData";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import RepresentativeImage from "@src/components/RepresentativeImage";

export default function SubfamilyPage({ params }: { params: { family: string, subfamily: string } }) {
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
        return Array.from(new Set(subfamilyData.map(item => item.genus_name).filter(Boolean)));
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
            <div className="py-8">
                <nav className="mb-6 space-x-2">
                    <Link href="/explore" className="text-blue-600 hover:text-blue-800">
                        모든 Family
                    </Link>
                    <span className="text-gray-500">{'>'}</span>
                    <Link href={`/explore/${encodeURIComponent(familyName)}`} className="text-blue-600 hover:text-blue-800">
                        {familyName}
                    </Link>
                    <span className="text-gray-500">{'>'}</span>
                    <span className="text-gray-700">{subfamilyName}</span>
                </nav>
                
                <h1 className="text-3xl font-bold mb-8 text-center">
                    {subfamilyName} - Genus 목록
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For of={genera}>
                        {(genus) => (
                            <Link 
                                href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName)}/${encodeURIComponent(genus)}`}
                                className="block border rounded-lg hover:bg-gray-50 transition-colors overflow-hidden"
                            >
                                <RepresentativeImage 
                                    familyName={familyName}
                                    subfamilyName={subfamilyName}
                                    genusName={genus}
                                    className="w-full h-48 object-cover"
                                    alt={`${genus} 대표 이미지`}
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                                        {genus}
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        {genusCounts[genus] || 0} 종
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