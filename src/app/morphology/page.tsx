export default function MorphologyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Morphology</h1>

                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Explore the detailed morphological characteristics of longhorn beetle developmental stages.
                            Our morphological studies focus on anatomical features that aid in species identification
                            and taxonomic classification across different life stages.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Larva</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Detailed morphological analysis of cerambycid larvae including head capsule features,
                                body segmentation, mandible structures, and species-specific diagnostic characters.
                            </p>
                            <a href="/morphology/larva" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Explore Larval Morphology →
                            </a>
                        </div>

                        <div
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Pupa</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Comprehensive documentation of pupal morphology featuring appendage arrangement,
                                surface textures, size measurements, and pre-emergence characteristics.
                            </p>
                            <a href="/morphology/pupa" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Explore Pupal Morphology →
                            </a>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}