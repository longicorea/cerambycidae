export default function OthersPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Others</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            Beyond larval and pupal stages, our research encompasses additional biological
                            aspects of longhorn beetles including adult morphology, ecological relationships,
                            and specialized research topics.
                        </p>

                        <div className="grid md:grid-cols-1 gap-8 mb-8">
                            <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Adult Specimens</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Comprehensive documentation of adult Cerambycidae including morphological
                                    features, sexual dimorphism, and taxonomic characteristics for species verification.
                                </p>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Ecological Studies</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Research on host plant relationships, habitat preferences, seasonal patterns,
                                    and ecological roles of longhorn beetles in forest ecosystems.
                                </p>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Molecular Research</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    DNA barcoding studies, phylogenetic analyses, and molecular systematics
                                    supporting morphological identification and taxonomic classification.
                                </p>
                            </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-teal-900 dark:text-teal-300 mb-3">Special Collections</h2>
                            <div className="text-teal-800 dark:text-teal-200 space-y-2">
                                <p><strong>Behavioral Studies:</strong> Documentation of mating behaviors, feeding patterns, and life cycle observations</p>
                                <p><strong>Conservation Biology:</strong> Research on threatened species and habitat conservation strategies</p>
                                <p><strong>Applied Research:</strong> Pest management studies and forest health monitoring applications</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Future Directions</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Ongoing research includes expanding geographical coverage to Southeast Asian species,
                                developing automated identification tools, and creating comprehensive life cycle
                                documentation for forest management applications.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}