'use client'
import DefaultSection from "@/components/section/DefaultSection";

import {useCallback, useMemo, useState} from "react";
import {CollData, CollDataType} from "@/data/collData";
import _ from "lodash";
import {For} from "react-loops";
import {FlickrImageData} from "@/data/imageData";

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
                            <div className={"flex flex-col justify-end items-center p-4 border rounded-2xl h-64 "}>
                                <div className="grid grid-cols-2 gap-3 h-64 overflow-y-scroll w-full">
                                    <For of={FlickrImageData.filter((item) => {
                                        return item.fileName.startsWith(data.id)
                                    }).slice(0, 4)}>
                                        {(image) => {
                                            return <img src={image.imageUrlSmall}/>
                                        }}
                                    </For>
                                </div>
                                <div className={"grid grid-cols-2 w-full justify-start items-start gap-2"}>
                                    <LabelText label={"ID"} value={data.id}/>
                                    <LabelText label={"Name"} value={data.nameKr}/>
                                    <LabelText label={"Type"} value={data.type}/>
                                    <LabelText label={"Loc."} value={data.location}/>
                                    <LabelText label={"Date"} value={data.collDate}/>
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