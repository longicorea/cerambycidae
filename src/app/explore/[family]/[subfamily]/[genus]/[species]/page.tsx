'use client'

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { For } from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import { CollDataType } from "@src/data/collData";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import { getSpecimenImageUrl, getSpecimenAllImages } from "@src/lib/imageUtils";


function LabelText({label,value}:{label:string,value:string|number}) {
    return (
        <div className={"grid grid-cols-4 items-center space-x-2"}>
            <span className={"col-span-1 w-20"}>{label}</span>
            <span className={"col-span-3 text-gray-600 text-sm overflow-hidden text-nowrap text-ellipsis"}>{value}</span>
        </div>
    )
}

export default function SpeciesPage({ params }: { params: { family: string, subfamily: string, genus: string, species: string } }) {
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);
    const familyName = decodeURIComponent(params.family);
    const subfamilyName = decodeURIComponent(params.subfamily);
    const genusName = decodeURIComponent(params.genus);
    const speciesKey = decodeURIComponent(params.species);
    
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
    
    // speciesKey에서 species와 subspecies 분리
    const [speciesName, subspeciesName] = useMemo(() => {
        return speciesKey.includes('_') 
            ? speciesKey.split('_') 
            : [speciesKey, undefined];
    }, [speciesKey]);
    
    const speciesData = useMemo(() => {
        return collData.filter(item => 
            item.family_name === familyName && 
            item.subfamily_name === subfamilyName && 
            item.genus_name === genusName &&
            item.species_name === speciesName &&
            (subspeciesName ? item.subspecies_name === subspeciesName : !item.subspecies_name)
        );
    }, [collData, familyName, subfamilyName, genusName, speciesName, subspeciesName]);
    
    const firstItem = useMemo(() => {
        return speciesData[0];
    }, [speciesData]);
    
    const fullSpeciesName = useMemo(() => {
        if (!firstItem) return '';
        return `${firstItem.genus_name} ${firstItem.species_name}${firstItem.subspecies_name ? ` ${firstItem.subspecies_name}` : ''}`;
    }, [firstItem]);
    
    if (loading) {
        return (
            <DefaultSection>
                <div className="text-center py-8">
                    <div className="text-gray-600">데이터를 불러오는 중...</div>
                </div>
            </DefaultSection>
        );
    }
    
    if (speciesData.length === 0) {
        return (
            <DefaultSection>
                <div className="text-center py-8">
                    <div className="text-gray-600">해당 종의 데이터를 찾을 수 없습니다.</div>
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
                    <Link href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName)}`} className="text-blue-600 hover:text-blue-800">
                        {subfamilyName}
                    </Link>
                    <span className="text-gray-500">{'>'}</span>
                    <Link href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName)}/${encodeURIComponent(genusName)}`} className="text-blue-600 hover:text-blue-800">
                        {genusName}
                    </Link>
                    <span className="text-gray-500">{'>'}</span>
                    <span className="text-gray-700">{fullSpeciesName}</span>
                </nav>
                
                <h1 className="text-3xl font-bold mb-8 text-center">
                    {fullSpeciesName}
                </h1>
                <h2 className="text-xl text-center mb-8 text-gray-600">
                    {firstItem.name_ko}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <For of={speciesData}>
                        {(specimen) => (
                            <div className="border rounded-lg p-6">
                                <div className="grid grid-cols-2 gap-3 h-48 overflow-y-scroll w-full mb-4">
                                    <For of={getSpecimenAllImages(specimen, ['Adult'], ['default', 'dorsal', 'ventral', 'lateral']).slice(0, 4)}>
                                        {(imageUrl) => {
                                            return (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={specimen.name_ko} 
                                                    className="w-full h-20 object-cover rounded"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            );
                                        }}
                                    </For>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-3">
                                        표본 정보
                                    </h3>
                                    <LabelText label="ID" value={specimen.coll_id}/>
                                    <LabelText label="타입" value={specimen.type}/>
                                    <LabelText label="채집일" value={specimen.coll_date}/>
                                    <LabelText label="채집자" value={specimen.collector_name}/>
                                    <LabelText label="위치" value={specimen.location}/>
                                    <LabelText label="기주" value={specimen.host}/>
                                    {specimen.dna_identified && (
                                        <LabelText label="DNA ID" value={specimen.dna_identified}/>
                                    )}
                                    {specimen.dna_accession_no && (
                                        <LabelText label="DNA 접근번호" value={specimen.dna_accession_no}/>
                                    )}
                                </div>
                            </div>
                        )}
                    </For>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        총 {speciesData.length}개의 표본이 있습니다.
                    </p>
                </div>
            </div>
        </DefaultSection>
    );
}