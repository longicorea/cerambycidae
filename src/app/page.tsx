'use client'

import { useMemo, useState, useEffect} from "react";

import _ from "lodash";
import {For} from "react-loops";

import DefaultSection from "@src/components/section/DefaultSection";
import {CollDataType} from "@src/data/collData";
import { getCachedCollectionData } from "@src/lib/dataCacheClient";
import { initializeImageCache, getSpecimenImageUrl } from "@src/lib/imageCache";

function SpecimenImage({ specimen }: { specimen: CollDataType }) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadImage = async () => {
            try {
                setLoading(true);
                const url = await getSpecimenImageUrl(specimen, 'Adult', 'dorsal');
                setImageUrl(url);
            } catch (error) {
                console.error('이미지 로드 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadImage();
    }, [specimen.coll_id]);
    
    if (loading) {
        return (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center animate-pulse">
                <span className="text-gray-500 text-sm">로딩 중...</span>
            </div>
        );
    }
    
    if (!imageUrl) {
        return (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
        );
    }
    
    return (
        <img 
            src={imageUrl} 
            alt={specimen.name_ko}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
    );
}

function LabelText({label,value}:{label:string,value:string|number}) {
    return (
        <div className={"grid grid-cols-4 items-center space-x-2"}>
            <span className={"col-span-1 w-20"}>{label}</span>
            <span className={"col-span-3 text-gray-600 text-sm overflow-hidden text-nowrap text-ellipsis"}>{value}</span>
        </div>
)

}

export default function HomePage() {
    const [searchText, setSearchText] = useState("");
    const [collData, setCollData] = useState<CollDataType[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 이미지 캐시 먼저 초기화
                await initializeImageCache();
                
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
    
    const dataList = useMemo(()=>{
        if(!searchText){
            const randomItems:CollDataType[] = _.sampleSize(collData, 10);
            return randomItems
        }else{
            return collData.filter((item)=>{
                return item.host.includes(searchText)||item.coll_id.includes(searchText)||item.name_ko.includes(searchText)||item.location.includes(searchText)||item.genus_name.includes(searchText)||item.species_name.includes(searchText)
            }).slice(0,10)
        }
    },[searchText, collData])


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
            <div className={"flex justify-center py-4"}>
                <input type={"text"} className={"border rounded-full h-20 w-1/2 text-[30px] px-2 text-gray-600"} onChange={(e:any) => { setSearchText(e.target.value)}} />
            </div>
            <div className={"grid grid-cols-4 gap-2 "}>
                <For of={dataList}>
                    {(data)=>{
                        return (
                            <div className={"flex flex-col justify-end items-center p-4 border rounded-2xl h-64 "}>
                                <div className="grid grid-cols-1 gap-3 h-64 overflow-hidden w-full">
                                    <SpecimenImage specimen={data} />
                                </div>
                                <div className={"grid grid-cols-2 w-full justify-start items-start gap-2"}>
                                    <LabelText label={"ID"} value={data.coll_id}/>
                                    <LabelText label={"Name"} value={data.name_ko}/>
                                    <LabelText label={"Type"} value={data.type}/>
                                    <LabelText label={"Loc."} value={data.location}/>
                                    <LabelText label={"Date"} value={data.coll_date}/>
                                    <LabelText label={"Host"} value={data.host}/>
                                </div>


                            </div>
                        )
                    }}
                </For>
            </div>

        </DefaultSection>
    )
}