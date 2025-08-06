export function ExploreTitle({title, subtitle}: { title?: string; subtitle?: string }) {
    return (<div className={"flex flex-row justify-start items-end space-x-1 mb-8"}>
                    <span className="text-3xl font-bold text-left text-slate-700">
                        {title}
                    </span>
        <span className={"text-slate-200 text-base font-light"}>{subtitle}</span>
    </div>)
}