export default function PupaPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pupa</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            The pupal stage represents the metamorphic transition from larva to adult in longhorn beetles.
                            Our collection provides detailed documentation of pupal morphology and development
                            across various Cerambycidae species.
                        </p>

                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-300 mb-3">Morphological Studies</h2>
                            <ul className="list-disc list-inside space-y-2 text-purple-800 dark:text-purple-200">
                                <li>Detailed pupal case documentation</li>
                                <li>Developmental timeline tracking</li>
                                <li>Species-specific characteristics</li>
                                <li>Comparative morphological analysis</li>
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Development Stages</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Documentation includes early pupal formation, intermediate development phases,
                                    and pre-emergence characteristics that distinguish species and genera.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Identification Features</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Focus on distinctive pupal features including appendage positioning,
                                    surface textures, and size measurements for taxonomic identification.
                                </p>
                            </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-2">Research Applications</h3>
                            <p className="text-orange-800 dark:text-orange-200">
                                Pupal studies are essential for understanding complete life cycle development,
                                seasonal timing patterns, and species-specific metamorphosis processes in
                                forest ecosystem management and conservation biology.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}