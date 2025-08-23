'use client'

import {useEffect, useMemo, useState} from "react";
import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import {getCachedCollectionData} from "@src/lib/dataCacheClient";
import Breadcrumb from "@src/components/Breadcrumb";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {ExploreTitle} from "@src/components/ExploreTitle";
import {For} from "react-loops";
import Image from "next/image";

function LabelText({label, value}: { label: string, value: string | number }) {
    return (
        <div className={"grid grid-cols-4 items-center space-x-2 hover:bg-slate-800"}>
            <span className={"col-span-2 w-20 text-slate-700 font-medium text-2xl dark:text-slate-300"}>{label}</span>
            <span
                className={"col-span-2 font-light text-2xl text-slate-600  overflow-hidden text-nowrap text-ellipsis dark:text-slate-300"}>{value}</span>
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

            <div className="py-4 w-[1280px] max-w-[1280px] min-w-[1280px]">
                <Breadcrumb familyName={familyName} subfamilyName={subfamilyName} genusName={genusName}
                            speciesName={speciesName}/>
                <ExploreTitle title={`${genusName} ${speciesName}`} subtitle={"Species"}/>
                <div className={"flex flex-row  space-x-8"}>
                    <div className={"flex flex-row space-x-4 min-h-[900px] min-w-[900px]"}>
                        <div
                            className={"w-full h-full border border-gray-300 rounded-md overflow-hidden max-w-[1000px] dark:border-gray-900"}>
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

                    </div>


                    <div className="space-y-6 min-w-[250px]">
                        <div className={"grid grid-cols-3 gap-1 max-h-96 overflow-hidden overflow-y-scroll"}>
                            <For of={speciesImageInfo}>
                                {(imageInfo, {index}) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSpecimenImageIndex(index)}
                                        className={`inline-block p-[1px] border dark:border-gray-900 rounded ${selectedSpecimenImageIndex === index ? 'bg-blue-300 dark:bg-gray-600' : 'bg-white dark:bg-gray-900'} hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors duration-200`}
                                    >
                                        <Image src={imageInfo.imageUrl}
                                               alt={`${imageInfo.genus_name} ${imageInfo.species_name} 이미지`}
                                               width={100} height={300}/>
                                    </button>
                                )}

                            </For>
                        </div>
                        <div className={"space-y-4"}>
                            <h3 className="text-slate-700 font-semibold  mb-3 dark:text-slate-200 text-3xl">
                                Specimen Information
                            </h3>
                            <LabelText label="ID" value={selectedSpecimenInfo?.coll_id}/>
                            <LabelText label="Type" value={selectedSpecimenInfo?.type}/>
                            <LabelText label="Location" value={selectedSpecimenInfo?.location}/>
                            <LabelText label="DNA Identified" value={selectedSpecimenInfo?.dna_identified}/>
                            <LabelText label="DNA Accession No." value={selectedSpecimenInfo?.dna_accession_no}/>
                        </div>
                    </div>
                </div>

            </div>

        </DefaultSection>
    );
}