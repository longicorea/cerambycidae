export default function MorphologyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Morphology</h1>


                    <div className="grid md:grid-cols-2 gap-6">
                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Larva</h2>
                            <div className={"flex flex-col items-center"}>
                                <a href="/morphology/larva"
                                   className="text-blue-600 dark:text-blue-400 hover:underline">
                                    <img
                                        src="https://my-cdn-worker.longicorea.workers.dev/images/morphology/!Mor_Larva.webp"
                                        className=" rounded-lg shadow-md max-h-[400px]"
                                    />

                                    Explore Larval Morphology →
                                </a>
                            </div>
                        </div>

                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pupa</h2>
                            <div className={"flex flex-col items-center"}>
                                <a href="/morphology/pupa" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    <img
                                        src="https://my-cdn-worker.longicorea.workers.dev/images/morphology/!Mor_Pupa.webp"
                                        className="rounded-lg shadow-md max-h-[400px]"
                                    />

                                    Explore Pupal Morphology →
                                </a>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}