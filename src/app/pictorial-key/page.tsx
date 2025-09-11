export default function PictorialKeyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pictorial Key</h1>

                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Visual identification guide for longhorn beetle developmental stages.
                            Our pictorial keys provide step-by-step visual guides to help identify
                            different species and life stages using morphological characteristics.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Larvae</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Interactive pictorial key for identifying cerambycid larvae using visual
                                characteristics such as head capsule features, body shape, and diagnostic markers.
                            </p>
                            <a href="/pictorial-key/larva" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Use Larval Key →
                            </a>
                        </div>

                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pupae</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Visual identification guide for pupal stages featuring step-by-step
                                comparison of morphological features and species-specific characteristics.
                            </p>
                            <a href="/pictorial-key/pupa" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Use Pupal Key →
                            </a>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}