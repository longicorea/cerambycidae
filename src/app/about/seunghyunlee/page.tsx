export default function SeunghyunLeePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Seunghyun Lee (이승현)</h1>

                    <div className="prose prose-lg max-w-none">
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="md:w-2/3">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    I am an entomologist specializing in the taxonomy and ecology of longhorn beetles
                                    (Cerambycidae). My research focuses on Korean biodiversity with particular emphasis
                                    on larval and pupal stages of longhorn beetles, combining traditional morphological
                                    approaches with modern molecular techniques.
                                </p>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Research
                                    Interests</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                                    <li>Taxonomic study of Cerambycidae larvae and pupae</li>
                                    <li>DNA barcoding for species identification</li>
                                    <li>Korean longhorn beetle biodiversity</li>
                                    <li>Morphological and molecular systematics</li>
                                    <li>Digital museum and database development</li>
                                </ul>
                            </div>

                            <div className="md:w-1/3">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <p><strong>Email:</strong> chiyark@snu.ac.kr</p>
                                        <p><strong>Institution:</strong> Seoul National University</p>
                                        <p><strong>Field:</strong> Entomology, Coleoptera Taxonomy</p>
                                        <p><strong>Website:</strong> <a href="https://chiyark.wixsite.com/mysite"
                                                                        className="text-blue-600 dark:text-blue-400 hover:underline">Personal
                                            Site</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">Education &
                                Background</h3>
                            <div className="text-blue-800 dark:text-blue-200 space-y-2">
                                <p><strong>Current:</strong> Graduate Student in Entomology, Seoul National University
                                </p>
                                <p><strong>Research Focus:</strong> Integrative taxonomy of Cerambycidae using
                                    morphological and molecular data</p>
                                <p><strong>Specialization:</strong> Larval and pupal morphology, DNA barcoding, digital
                                    documentation</p>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">LongiHUB
                                Project</h3>
                            <p className="text-green-800 dark:text-green-200">
                                As the founder and principal investigator of LongiHUB, I lead the collection,
                                identification,
                                and molecular verification of longhorn beetle specimens. This project represents years
                                of
                                fieldwork and laboratory research, creating the first comprehensive digital database of
                                Korean Cerambycidae larvae and pupae with verified molecular data.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-1 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Research
                                    Contributions</h3>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>• Development of integrated morphological-molecular approach for larval
                                        identification
                                    </li>
                                    <li>• Creation of comprehensive image database with high-resolution photography</li>
                                    <li>• DNA barcoding of Korean longhorn beetle species for accurate identification
                                    </li>
                                    <li>• Collaboration with international researchers on Southeast Asian expansion</li>
                                    <li>• Digital preservation of entomological specimens and data</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Collaboration</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                I welcome scientific collaborations and specimen exchanges with researchers worldwide.
                                If you are interested in longhorn beetle research, larval identification, or
                                contributing
                                to the LongiHUB database, please feel free to contact me.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}