export default function PupaPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pupa</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            The pupal stage represents the metamorphic transition from larva to adult in longhorn
                            beetles.
                            Our collection provides detailed documentation of pupal morphology and development
                            across various Cerambycidae species.
                        </p>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-cyan-900 dark:text-cyan-300 mb-3">Pupal cells of
                                Cerambycidae
                            </h2>
                            <p className="text-cyan-800 dark:text-cyan-200 mb-4">
                                Diverse forms of pupal chambers constructed by longhorn beetle larvae
                            </p>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/biology/pupa/STP3F16.webp"
                                alt="Pupal cells of Cerambycidae"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-cyan-800 dark:text-cyan-200">
                                <ul className="list-none space-y-1">
                                    <li><em>a. Oedecnema gebleri (Ganglbauer, 1887)</em> - Stem-girdling pupal cell
                                    </li>
                                    <li><em>b. Agapanthia (Amurobia) pilicornis (Fabricius, 1787)</em> - Hollowed stem
                                        chamber
                                    </li>
                                    <li><em>c. Oberea depressa (Gebler, 1825)</em> - Branch-tip pupal cell
                                    </li>
                                    <li><em>d. Apriona germarii (Hope, 1831)</em> - Large trunk excavation
                                    </li>
                                    <li><em>e. Saperda (Lopezcolonia) tetrastigma Bates, 1879</em> - Bark-enclosed
                                        chamber
                                    </li>
                                </ul>
                                <ul className="list-none space-y-1">
                                    <li><em>f. Parechthistatus gibber (Bates, 1873)</em> - Dead wood cavity
                                    </li>
                                    <li><em>g. Trichoferus campestris (Faldermann, 1835)</em> - Hardwood boring chamber
                                    </li>
                                    <li><em>h. Asemum striatum (Linné, 1758)</em> - Coniferous wood cell
                                    </li>
                                    <li><em>i. Rhabdoclytus acutivittis (Kraatz, 1879)</em> - Subcortical pupal chamber
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-teal-900 dark:text-teal-300 mb-3">Signs of
                                Cerambycidae pupal cells
                            </h2>
                            <p className="text-teal-800 dark:text-teal-200 mb-4">
                                External evidence of longhorn beetle pupal chamber construction
                            </p>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/biology/pupa/STP3F17.webp"
                                alt="Signs of Cerambycidae pupal cells"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-teal-800 dark:text-teal-200">
                                <ul className="list-none space-y-1">
                                    <li><em>a. Saperda (Lopezcolonia) tetrastigma Bates, 1879</em> - Swollen stem
                                        indicators
                                    </li>
                                    <li><em>b. Callidiellum rufipenne (Motschulsky, 1861)</em> - Bark emergence holes
                                    </li>
                                    <li><em>c. Monochamus alternatus Hope, 1842</em> - Pine sawyer exit signs
                                    </li>
                                    <li><em>d. Cerambycini sp. (Myanmar)</em> - Tropical hardwood cell marks
                                    </li>
                                    <li><em>e-1. Schwarzerium provostii (Fairmaire, 1887)</em> - Branch-tip
                                        modifications
                                    </li>
                                </ul>
                                <ul className="list-none space-y-1">
                                    <li><em>e-2. Leptoxenus ibidiiformis Bates, 1877</em> - Twig-boring evidence
                                    </li>
                                    <li><em>f. Sachalinobia koltzei (Heyden, 1887)</em> - Willow stem swellings
                                    </li>
                                    <li><em>g-h. Pyrestes haematicus Pascoe, 1857</em> - Multiple chamber configurations
                                    </li>
                                    <li><em>i. Agapanthia (Amurobia) amurensis Kraatz, 1879</em> - Stem-boring emergence
                                        traces
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}