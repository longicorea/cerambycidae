export default function BiologyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Biology</h1>


                    <div className="grid md:grid-cols-3 gap-6">
                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Larva</h2>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/biology/!BIO_Lar.webp"
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                            <a href="/biology/larva" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Signs & Feeding →
                            </a>
                        </div>

                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pupa</h2>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/biology/!BIO_Pup.webp"
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                            <a href="/biology/pupa" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Signs & Pupal cell →
                            </a>
                        </div>

                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Others</h2>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/biology/!BIO_Others.webp"
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                            <a href="/biology/others" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Breeding & Natural enemies →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}