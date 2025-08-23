export default function DefaultSection({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full p-2 flex flex-row justify-center">
            <div className={"w-full min-w-full  max-w-full px-4 "}>
                {children}
            </div>
        </div>);
}