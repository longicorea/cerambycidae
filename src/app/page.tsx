'use client'

import {useEffect, useMemo, useState} from "react";

import _ from "lodash";
import {For} from "react-loops";

import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType, DriveImageInfo} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import AutocompleteSearch from "@src/components/AutocompleteSearch";
import {ImageCard} from "@src/components/ImageCard";


const preferredOrder = ["L_dorsal", "P_ventral"];

// normalize 함수: 대소문자 무시 + 구분자 통일
const normalize = (str: string) =>
    str.toLowerCase().replace(/[_\-\s]+/g, "_");

const getPreferredImageUrl = (thumbnailList: DriveImageInfo[]) => {
    for (const keyword of preferredOrder) {
        const normalizedKeyword = normalize(keyword);
        const match = thumbnailList.find((img) =>
            normalize(img.name).includes(normalizedKeyword)
        );
        if (match) return match.url;
    }
    return thumbnailList[0]?.url!;
};
export default function HomePage() {
    const [searchText, setSearchText] = useState("");
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 컬렉션 데이터 로드
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

    // 퍼지 매칭 함수 - 부분 문자열과 순서가 맞는 문자들을 찾음
    const fuzzyMatchScore = (searchTerm: string, target: string): number => {
        const search = searchTerm.toLowerCase();
        const text = target.toLowerCase();

        if (text.includes(search)) return 100; // 완전 포함 시 최고 점수

        let searchIndex = 0;
        let matchCount = 0;

        for (let i = 0; i < text.length && searchIndex < search.length; i++) {
            if (text[i] === search[searchIndex]) {
                searchIndex++;
                matchCount++;
            }
        }

        return searchIndex === search.length ? matchCount : 0;
    };
    const dataList = useMemo(() => {
        if (!searchText) {
            // 검색어가 없을 경우 랜덤 20개
            return _.chain(collData)
                .sampleSize(20)
                .groupBy(item => `${item.genus_name} ${item.species_name}`.trim())
                .map((items, key) => ({
                    genus_name: items[0]!.genus_name,
                    species_name: items[0]!.species_name,
                    items,
                    score: 0,
                }))
                .value();
        }

        // 점수 계산
        const scored = collData
            .map(item => {
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

                const maxScore = Math.max(
                    ...fields.map(field => (field ? fuzzyMatchScore(searchText, field) : 0))
                );

                return {...item, score: maxScore};
            })
            .filter(item => item.score > 0); // 점수가 0 이상인 항목만

        // 종 기준으로 그룹핑 및 최고 점수 추출
        const grouped = _.chain(scored)
            .groupBy(item => `${item.genus_name} ${item.species_name}`.trim())
            .map((items, key) => ({
                genus_name: items[0]!.genus_name,
                species_name: items[0]!.species_name,
                items,
                score: Math.max(...items.map(i => i.score)), // 그룹 내 최고 점수
            }))
            .orderBy('score', 'desc')
            .take(20)
            .value();

        return grouped;
    }, [searchText, collData]);


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
            <div className={"flex justify-center py-8 my-8 mb-16 "}>
                <AutocompleteSearch
                    collData={collData}
                    onSearch={setSearchText}
                    placeholder="Search by taxonomy or Korean name."
                    className="w-1/2 max-w-[800px]"
                />
            </div>
            <div className={"flex flex-wrap gap-4 justify-center max-h-[1000px] overflow-y-scroll"}>
                <For of={dataList}>
                    {(data) => {
                        const imageFiles = data.items.flatMap(item => item.imageFiles ?? []);
                        const dnaIdentified = data.items.some(item => item.dna_identified === "TRUE");
                        const familyName = data.items[0]?.family_name || "";
                        const subfamilyName = data.items[0]?.subfamily_name || "";
                        const genusName = data.items[0]?.genus_name || "";
                        const speciesName = data.items[0]?.species_name || "";
                        const typeSet = new Set(imageFiles.map((img => img.name.split('_')[1])))
                        const thumbnailList = imageFiles.filter((img) => img.name.includes("thumbnail"))
                        if (dnaIdentified) {
                            typeSet.add("D");
                        }
                        const types = Array.from(typeSet).filter(Boolean);
                        return (
                            <ImageCard
                                href={`/explore/${encodeURIComponent(familyName)}/${encodeURIComponent(subfamilyName)}/${encodeURIComponent(genusName)}/${encodeURIComponent(speciesName)}`}
                                imageUrl={getPreferredImageUrl(thumbnailList)}
                                description={data.genus_name + " " + data.species_name}
                                badge={types ?? []}/>
                        )
                    }}
                </For>
            </div>

        </DefaultSection>
    )
}
