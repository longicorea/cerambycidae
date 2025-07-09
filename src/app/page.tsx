'use client'

import {useEffect, useMemo, useState} from "react";

import _ from "lodash";
import {For} from "react-loops";

import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import AutocompleteSearch from "@src/components/AutocompleteSearch";
import {ImageCard} from "@src/components/ImageCard";


export default function HomePage() {
    const [searchText, setSearchText] = useState("");
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 컬렉션 데이터 로드
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

    // 퍼지 매칭 함수 - 부분 문자열과 순서가 맞는 문자들을 찾음
    const fuzzyMatch = (searchTerm: string, target: string): boolean => {
        const search = searchTerm.toLowerCase();
        const text = target.toLowerCase();

        // 완전 포함 검사 (기존 방식)
        if (text.includes(search)) return true;

        // 순서가 맞는 부분 문자열 검사
        let searchIndex = 0;
        for (let i = 0; i < text.length && searchIndex < search.length; i++) {
            if (text[i] === search[searchIndex]) {
                searchIndex++;
            }
        }

        return searchIndex === search.length;
    };

    const dataList = useMemo(() => {
        if (!searchText) {
            const randomItems: CollDataType[] = _.sampleSize(collData, 10);
            return randomItems
        } else {
            return collData.filter((item) => {
                const fields = [
                    item.host,
                    item.coll_id,
                    item.name_ko,
                    item.location,
                    item.genus_name,
                    item.species_name,
                    item.family_name,
                    item.subfamily_name,
                    `${item.genus_name} ${item.species_name}`,
                ];

                return fields.some(field => field && fuzzyMatch(searchText, field));
            }).slice(0, 10)
        }
    }, [searchText, collData])


    if (loading) {
        return (
            <DefaultSection>
                <div className={"flex justify-center py-4"}>
                    <div className="text-gray-600">데이터를 불러오는 중...</div>
                </div>
            </DefaultSection>
        );
    }

    return (
        <DefaultSection>
            <div className={"flex justify-center py-8"}>
                <AutocompleteSearch
                    collData={collData}
                    onSearch={setSearchText}
                    placeholder="과명, 속명, 종명, 국명으로 검색..."
                    className="w-1/2"
                />
            </div>
            <div className={"flex flex-wrap gap-2 justify-start "}>
                <For of={dataList}>
                    {(data) => {
                        const typeSet = new Set((data?.imageFiles ?? []).map((img => img.name.split('_')[1])))
                        if (data.dna_identified) {
                            typeSet.add("D");
                        }
                        const types = Array.from(typeSet).filter(Boolean);
                        return (
                            <ImageCard
                                href={`/explore/${encodeURIComponent(data.family_name)}/${encodeURIComponent(data.subfamily_name)}/${encodeURIComponent(data.genus_name)}/${encodeURIComponent(data.species_name)}`}
                                imageUrl={(data.imageFiles ?? []).find(img => img.name.includes("A_dorsal"))?.url}
                                description={data.genus_name + " " + data.species_name}
                                badge={types ?? []}/>
                        )
                    }}
                </For>
            </div>

        </DefaultSection>
    )
}