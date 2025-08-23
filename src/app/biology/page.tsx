export default function BiologyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Biology</h1>

                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Explore the fascinating world of longhorn beetle biology. Our comprehensive collection
                            covers different life stages and biological aspects of Cerambycidae species.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Larva</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Study the larval stage of longhorn beetles, including morphological characteristics,
                                identification keys, and developmental stages.
                            </p>
                            <a href="/biology/larva" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Explore Larva →
                            </a>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pupa</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Examine the pupal stage, featuring detailed images and descriptions of
                                pre-adult development in various Cerambycidae species.
                            </p>
                            <a href="/biology/pupa" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Explore Pupa →
                            </a>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Others</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Additional biological aspects including adult specimens, ecological relationships,
                                and specialized research topics.
                            </p>
                            <a href="/biology/others" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Explore Others →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}