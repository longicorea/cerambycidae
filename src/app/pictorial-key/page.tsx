export default function PictorialKeyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pictorial Key</h1>


                    <div className="grid md:grid-cols-2 gap-6">
                        <a href="/pictorial-key/larva" className="text-blue-600 dark:text-blue-400 ">
                            <div
                                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow dark:hover:bg-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Larvae</h2>


                                Use Larval Key →

                            </div>
                        </a>
                        <a href="/pictorial-key/pupa" className="text-blue-600 dark:text-blue-400">
                            <div
                                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow dark:hover:bg-gray-700">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pupae</h2>


                                Use Pupal Key →

                            </div>
                        </a>
                    </div>


                </div>
            </div>
        </div>
    );
}