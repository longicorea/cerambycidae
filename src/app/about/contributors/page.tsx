export default function ContributorsPage() {
    const contributors = [
        {
            name: "Seunghyun Lee (이승현)",
            role: "Project Director & Entomologist",
            contributions: ["Sample collection and identification", "Molecular verification", "Scientific validation"],
            institution: "Seoul National University"
        },
        {
            name: "Hyunkyu Jang (장현규)",
            role: "Collaborator & Developer",
            contributions: ["Web platform development", "Database management", "Technical consultation"],
            institution: "LongiHUB Development Team"
        },
        {
            name: "Woong Choi (최웅)",
            role: "Research Collaborator",
            contributions: ["Field collection assistance", "Specimen preparation", "Data validation"],
            institution: "Research Collaborator"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contributors</h1>

                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            The LongiHUB project is built through collaboration of experts from various fields.
                            Entomologists, developers, and data specialists work together to create this comprehensive
                            digital archive of longhorn beetle larvae and pupae.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-1 gap-8 mb-8">
                        {contributors.map((contributor, index) => (
                            <div key={index}
                                 className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="md:w-2/3">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{contributor.name}</h2>
                                        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{contributor.role}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{contributor.institution}</p>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Key
                                                Contributions</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {contributor.contributions.map((contribution, idx) => (
                                                    <li key={idx}
                                                        className="text-gray-700 dark:text-gray-300">{contribution}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-3">How to
                            Contribute</h2>
                        <p className="text-green-800 dark:text-green-200 mb-4">
                            We welcome contributions to the LongiHUB project in various forms.
                            Whether you have entomological expertise, development skills, or data management experience,
                            your contributions are valuable to our scientific community.
                        </p>
                        <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                            <p>• Specimen data collection and verification</p>
                            <p>• Website feature development and enhancement</p>
                            <p>• Translation and multilingual support</p>
                            <p>• Documentation and user guide creation</p>
                        </div>
                        <p className="text-green-800 dark:text-green-200 mt-4">
                            For collaboration inquiries, please contact Seunghyun Lee at{' '}
                            <a href="mailto:chiyark@snu.ac.kr"
                               className="text-green-900 dark:text-green-300 underline hover:text-green-700 dark:hover:text-green-400">
                                chiyark@snu.ac.kr
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}