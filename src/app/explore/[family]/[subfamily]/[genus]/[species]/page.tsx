'use client'

import {useEffect, useMemo, useState} from "react";
import {For} from "react-loops";
import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import Breadcrumb from "@src/components/Breadcrumb";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {ExploreTitle} from "@src/components/ExploreTitle";
import Image from "next/image";

function LabelText({label, value}: { label: string, value: string | number }) {
    return (
        <div className={"grid grid-cols-4 items-center space-x-2"}>
            <span className={"col-span-2 w-20 text-slate-700 font-medium"}>{label}</span>
            <span
                className={"col-span-2 font-light text-slate-600 text-sm overflow-hidden text-nowrap text-ellipsis"}>{value}</span>
        </div>
    )
}

export default function SpeciesPage({params}: {
    params: { family: string, subfamily: string, genus: string, species: string }
}) {
    const [collData, setCollData] = useState<CollDataType[]>([]);

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
        return speciesData[0]!;
    }, [speciesData]);

    const fullSpeciesName = useMemo(() => {
        if (!firstItem) return '';
        return `${firstItem.genus_name} ${firstItem.species_name}${firstItem.subspecies_name ? ` ${firstItem.subspecies_name}` : ''}`;
    }, [firstItem]);


    const speciesImageInfo = useMemo(() => {
        const imageList = speciesData.flatMap((item) => (item?.imageFiles ?? []).map((imageInfo) => ({
            ...item,
            imageUrl: imageInfo.url
        }))).filter((item) => !item.imageUrl.includes("thumbnail"));
        return imageList;
    }, [speciesData])
    const [selectedSpecimenImageIndex, setSelectedSpecimenImageIndex] = useState<number>(0);

    const selectedSpecimenInfo = useMemo(() => speciesImageInfo[selectedSpecimenImageIndex]!, [speciesImageInfo, selectedSpecimenImageIndex]);
    return (
        <DefaultSection>
            <div className="py-4">
                <Breadcrumb familyName={familyName} subfamilyName={subfamilyName} genusName={genusName}
                            speciesName={speciesName}/>
                <ExploreTitle title={`${genusName} ${speciesName}`} subtitle={"Species"}/>
                <div className={"flex flex-row  space-x-8"}>
                    <div className={"flex flex-row space-x-4 min-h-[900px] min-w-[1000px]"}>
                        <div
                            className={"w-full h-full border border-gray-300 rounded-md overflow-hidden max-w-[1000px]"}>
                            <TransformWrapper
                                initialScale={1}
                                minScale={1}
                                maxScale={10}
                                wheel={{step: 0.1, smoothStep: 0.01}}
                                doubleClick={{disabled: true}}
                                pinch={{disabled: true}}

                            >
                                {({zoomIn, zoomOut, resetTransform}) => (


                                    <div className="flex-1 relative">

                                        <TransformComponent wrapperClass="w-full h-full">
                                            <img
                                                src={selectedSpecimenInfo?.imageUrl ?? ''}
                                                alt="Specimen"
                                                className="min-h-[900px] min-w-[900px] max-w-[900px] object-contain mx-auto"
                                            />
                                        </TransformComponent>
                                    </div>

                                )}
                            </TransformWrapper>
                        </div>
                        <div className={"flex flex-col space-y-2 "}>
                            <For of={speciesImageInfo}>
                                {(imageInfo, {index}) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSpecimenImageIndex(index)}
                                        className={`inline-block p-1 border rounded ${selectedSpecimenImageIndex === index ? 'bg-blue-300' : 'bg-white'}`}
                                    >
                                        <Image src={imageInfo.imageUrl}
                                               alt={`${imageInfo.genus_name} ${imageInfo.species_name} 이미지`}
                                               width={100} height={300}/>
                                    </button>
                                )}

                            </For>
                        </div>
                    </div>


                    <div className="space-y-2 min-w-[250px]">
                        <h3 className="text-slate-700 font-semibold  mb-3">
                            표본 정보
                        </h3>
                        <LabelText label="ID" value={selectedSpecimenInfo?.coll_id}/>
                        <LabelText label="타입" value={selectedSpecimenInfo?.type}/>
                        <LabelText label="채집일" value={selectedSpecimenInfo?.coll_date}/>
                        <LabelText label="채집자" value={selectedSpecimenInfo?.collector_name}/>
                        <LabelText label="위치" value={selectedSpecimenInfo?.location}/>
                        <LabelText label="기주" value={selectedSpecimenInfo?.host}/>
                        <LabelText label="DNA Identified" value={selectedSpecimenInfo?.dna_identified}/>
                        <LabelText label="DNA Accession No." value={selectedSpecimenInfo?.dna_accession_no}/>

                    </div>
                </div>

            </div>
        </DefaultSection>
    );
}