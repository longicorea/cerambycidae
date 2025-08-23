export default function LarvaPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Larva</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            The larval stage of longhorn beetles represents a critical phase in their life cycle.
                            Our collection features detailed morphological studies and identification resources
                            for Cerambycidae larvae.
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Key Features</h2>
                            <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
                                <li>High-resolution morphological imagery</li>
                                <li>DNA barcoding verification</li>
                                <li>Taxonomic identification keys</li>
                                <li>Developmental stage documentation</li>
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Research Focus</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Our larval studies emphasize morphological characteristics that aid in species
                                    identification, particularly focusing on head capsule features, body segmentation,
                                    and specialized structures.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Collection Scope</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Specimens primarily collected from Korean habitats, with ongoing expansion
                                    to include Southeast Asian species for comparative studies.
                                </p>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">Scientific Applications</h3>
                            <p className="text-green-800 dark:text-green-200">
                                This larval database serves as a crucial resource for taxonomists, ecologists,
                                and forest management professionals working with wood-boring beetle identification
                                and pest management strategies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}