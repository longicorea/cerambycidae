export default function LongiHubPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome to LongiHUB!</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            LongiHUB is a database for sharing high-resolution images of <strong>"LONGI"</strong>corn
                            beetles'
                            (하늘소, "<strong>H</strong>"aneulso) larvae (유충, "<strong>U</strong>"chung) and pupae
                            (번데기, "<strong>B</strong>"eondaegi).
                        </p>
                        

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Project Overview</h2>
                            <p className="text-blue-800 dark:text-blue-200 mb-4">
                                Most samples in this database were collected, photographed, preidentified, and
                                molecularly
                                verified by Seunghyun Lee, with invaluable contributions from collaborators such as
                                Hyunkyu Jang and Woong Choi.
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                While the current collection focuses exclusively on Korean specimens, our goal is to
                                expand coverage worldwide, beginning with samples from Southeast Asia.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Scientific Approach</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Each entry in LongiHUB clearly distinguishes between species verified through
                                    DNA barcoding and those identified through morphological or circumstantial evidence,
                                    which greatly reduced misidentifications.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Collaboration</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    We welcome any form of scientific collaboration. Our database serves as a platform
                                    for researchers worldwide to access verified longhorn beetle larval and pupal data.
                                </p>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">Contact & Feedback</h3>
                            <p className="text-green-800 dark:text-green-200">
                                If you encounter any error or suspect misidentification, please contact Seunghyun Lee
                                at{' '}
                                <a href="mailto:chiyark@snu.ac.kr"
                                   className="text-green-900 dark:text-green-300 underline hover:text-green-700 dark:hover:text-green-400">
                                    chiyark@snu.ac.kr
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}