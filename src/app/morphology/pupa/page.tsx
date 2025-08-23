export default function MorphologyPupaPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pupal Morphology</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            Pupal morphology represents the transitional stage between larva and adult, offering
                            unique diagnostic features for cerambycid identification. Our studies document
                            species-specific pupal characteristics essential for taxonomic research.
                        </p>

                        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-pink-900 dark:text-pink-300 mb-3">Sexual
                                difference of Cerambycinae Pupae
                            </h2>
                            <p className="text-pink-800 dark:text-pink-200 mb-4">
                                Sexual dimorphism in Cerambycinae pupae showing distinctive male and female
                                characteristics
                            </p>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/morphology/pupa/STP3F7.webp"
                                alt="Sexual difference of Cerambycinae Pupae"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />

                            <div className="grid md:grid-cols-1 gap-4 text-sm text-pink-800 dark:text-pink-200">
                                <ul className="list-none space-y-1">
                                    <li><em>a-b. Chlorophorus simillimus (Kraatz, 1879)</em> - Male (a) vs Female (b)
                                        antenna length differences
                                    </li>
                                    <li><em>c-d. Allotraeus sphaerioninus Bates, 1877</em> - Sexual dimorphism in head
                                        capsule width
                                    </li>
                                    <li><em>e-f. Anoplistes halodendri (Pallas, 1773)</em> - Abdominal segment
                                        variations between sexes
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-indigo-900 dark:text-indigo-300 mb-3">Ventral
                                habitus of Cerambycoid Pupae
                            </h2>
                            <p className="text-indigo-800 dark:text-indigo-200 mb-4">
                                Ventral view of cerambycoid pupae showing characteristic features across subfamilies and
                                families
                            </p>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/morphology/pupa/STP3F8.webp"
                                alt="Ventral habitus of Cerambycoid Pupae"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-800 dark:text-indigo-200">
                                <ul className="list-none space-y-1">
                                    <li><strong>Disteniidae</strong></li>
                                    <li><em>a. Distenia gracilis (Blessig, 1872)</em> - Elongated ventral profile
                                    </li>
                                    <li><strong>Lepturinae</strong></li>
                                    <li><em>b. Rhagium inquisitor rugipenne Reitter, 1898</em> - Flattened form
                                    </li>
                                    <li><em>c. Lepturini sp.</em> - Flower longhorn ventral view
                                    </li>
                                    <li><em>d. Sachalinobia koltzei (Heyden, 1887)</em> - Intermediate size
                                    </li>
                                    <li><em>e. Leptura thoracica Creutzer, 1799</em> - Typical lepturine
                                    </li>
                                    <li><strong>Spondylidinae</strong></li>
                                    <li><em>f. Arhopalus rusticus (Linné, 1758)</em> - Robust thoracic region
                                    </li>
                                    <li><em>g. Asemum striatum (Linné, 1758)</em> - Cylindrical profile
                                    </li>
                                    <li><em>h. Atimia nadezhdae Tsherepanov, 1973</em> - Compact form
                                    </li>
                                    <li><strong>Prioninae</strong></li>
                                    <li><em>i. Psephactus remiger Harold, 1879</em> - Large head region
                                    </li>
                                    <li><em>j. Aegosoma sinicum White, 1853</em> - Massive body structure
                                    </li>
                                </ul>
                                <ul className="list-none space-y-1">
                                    <li><strong>Cerambycinae</strong></li>
                                    <li><em>k. Xylotrechus subscalaris Pic, 1917</em> - Wood borer form
                                    </li>
                                    <li><em>l. Margites fulvidus (Pascoe, 1858)</em> - Compact cerambycine
                                    </li>
                                    <li><em>m. Molorchus nitidus Obika, 1973</em> - Small body size
                                    </li>
                                    <li><em>n. Phymatodes sp.</em> - Typical cerambycine
                                    </li>
                                    <li><em>o. Allotraeus sphaerioninus Bates, 1877</em> - Intermediate form
                                    </li>
                                    <li><em>p. Rosalia coelestis Semenov, 1911</em> - Large cerambycine
                                    </li>
                                    <li><strong>Lamiinae</strong></li>
                                    <li><em>q. Parechthistatus gibber (Bates, 1873)</em> - Branch-boring form
                                    </li>
                                    <li><em>r. Olenecamptus sp.</em> - Typical lamiinae
                                    </li>
                                    <li><em>s. Acanthocinus sachalinensis Matsushita, 1933</em> - Pine borer
                                    </li>
                                    <li><em>t. Agapanthia amurensis Kraatz, 1879</em> - Stem borer
                                    </li>
                                    <li><em>u. Agelasta perplexa (Pascoe, 1858)</em> - Wood borer
                                    </li>
                                    <li><em>v. Praolia citrinipes Bates, 1884</em> - Small lamiinae
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-teal-900 dark:text-teal-300 mb-3">Dorsal habitus
                                and characteristic microstructures
                            </h2>
                            <p className="text-teal-800 dark:text-teal-200 mb-4">
                                Dorsal view of cerambycid pupae displaying species-specific surface microstructures and
                                morphological features
                            </p>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/morphology/pupa/STP3F9.webp"
                                alt="Dorsal habitus of Cerambycidae and characteristic microstructures"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-teal-800 dark:text-teal-200">
                                <ul className="list-none space-y-1">
                                    <li><em>a. Arhopalus rusticus (Linné, 1758)</em> - Smooth integument surface
                                    </li>
                                    <li><em>b. Leptura (Macroleptura) thoracica Creutzer, 1799</em> - Lepturine dorsal
                                        profile
                                    </li>
                                    <li><em>c. Callipogon (Eoxenus) relictus Semenov, 1899</em> - Large prionine
                                        structure
                                    </li>
                                    <li><em>d. Chloridolum (Parachloridolum) japonicum (Harold, 1879)</em> - Distinctive
                                        surface patterns
                                    </li>
                                    <li><em>e. Phymatodes testaceus (Linné, 1758)</em> - Typical cerambycine dorsum
                                    </li>
                                </ul>
                                <ul className="list-none space-y-1">
                                    <li><em>f. Cyrtoclytus monticallisus Komiya, 1980</em> - Specialized microstructures
                                    </li>
                                    <li><em>g. Agelasta (Dissosira) perplexa (Pascoe, 1858)</em> - Lamiinae dorsal
                                        features
                                    </li>
                                    <li><em>h. Parechthistatus gibber (Bates, 1873)</em> - Surface sculpture patterns
                                    </li>
                                    <li><em>i. Sophronica obrioides (Bates, 1873)</em> - Fine integument details
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