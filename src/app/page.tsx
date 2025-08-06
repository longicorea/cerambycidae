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
        const filtered = !searchText
            ? _.sampleSize(collData, 20)
            : collData.filter((item) => {
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
                return fields.some(
                    (field) => field && fuzzyMatch(searchText, field)
                );
            });

        // 종 기준으로 그룹핑
        const grouped = _.groupBy(filtered, (item) =>
            `${item.genus_name} ${item.species_name}`.trim()
        );

        // 그룹을 종합 객체로 변환
        const merged = Object.entries(grouped).map(([key, items]) => {
            return {
                genus_name: items[0]!.genus_name,
                species_name: items[0]!.species_name,
                items, // 같은 종의 모든 원본 데이터 배열
            };
        });

        return merged.slice(0, 20);
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
