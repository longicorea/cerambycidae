export default function DefaultSection({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full p-2 flex flex-row justify-center">
            <div className={"w-[1280px] min-w-[1280px]  max-w-[1280px] px-4 "}>
                {children}
            </div>
        </div>);
}