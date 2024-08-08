'use client'
import DefaultSection from "@/components/section/DefaultSection";

import {useCallback, useMemo, useState} from "react";
import {CollData, CollDataType} from "@/data/collData";
import _ from "lodash";
import {For} from "react-loops";
import {FlickrImageData} from "@/data/imageData";


export default function HomePage(){
    const [searchText,setSearchText] = useState("");
    const dataList = useMemo(()=>{
        if(!searchText){
            const randomItems:CollDataType[] = _.sampleSize(CollData, 10);
            return randomItems
        }else{
            return CollData.filter((item)=>{
                return item.host.includes(searchText)||item.id.includes(searchText)||item.nameKr.includes(searchText)||item.location.includes(searchText)
            }).slice(0,10)
        }
    },[searchText])


    return (
        <DefaultSection>
            <div className={"flex justify-center py-4"}>
                <input type={"text"} className={"border rounded-full h-20 w-1/2 text-[30px] px-2 text-gray-600"} onChange={(e:any) => { setSearchText(e.target.value)}} />
            </div>
            <div className={"grid grid-cols-4 gap-2 "}>
                <For of={dataList}>
                    {(data)=>{
                        return (
                            <div className={"flex flex-col justify-end items-center p-4 border rounded-2xl  "}>
                                <div className="grid grid-cols-2 gap-3 h-64 overflow-hidden">
                                    <For of={FlickrImageData.filter((item) => {
                                        return item.fileName.startsWith(data.id)
                                    }).slice(0, 4)}>
                                        {(image) => {
                                            return <img src={image.imageUrlSmall}/>
                                        }}
                                    </For>
                                </div>
                                <div className={"grid grid-cols-4 w-full justify-start items-start gap-4"}>
                                    <span>ID</span>
                                    <span className={"text-gray-600 text-sm"}>{data.id}</span>
                                    <span>Name</span>
                                    <span className={"text-gray-600 text-sm"}>{data.nameKr}</span>
                                    <span>Type</span>
                                    <span className={"text-gray-600 text-sm"}>{data.type}</span>
                                    <span>Location</span>
                                    <span className={"text-gray-600 text-sm"}>{data.location}</span>
                                    <span>Date</span>
                                    <span className={"text-gray-600 text-sm"}>{data.collDate}</span>
                                    <span>Host</span>
                                    <span className={"text-gray-600 text-sm"}>{data.host}</span>
                                </div>


                            </div>
                        )
                    }}
                </For>
            </div>

        </DefaultSection>
    )
}