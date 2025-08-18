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
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Contributors</h1>

                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-lg text-gray-700">
                            The LongiHUB project is built through collaboration of experts from various fields.
                            Entomologists, developers, and data specialists work together to create this comprehensive
                            digital archive of longhorn beetle larvae and pupae.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-1 gap-8 mb-8">
                        {contributors.map((contributor, index) => (
                            <div key={index}
                                 className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="md:w-2/3">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{contributor.name}</h2>
                                        <p className="text-blue-600 font-medium mb-2">{contributor.role}</p>
                                        <p className="text-sm text-gray-600 mb-4">{contributor.institution}</p>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-2">Key
                                                Contributions</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {contributor.contributions.map((contribution, idx) => (
                                                    <li key={idx} className="text-gray-700">{contribution}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="bg-green-50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-green-900 mb-3">How to Contribute</h2>
                        <p className="text-green-800 mb-4">
                            We welcome contributions to the LongiHUB project in various forms.
                            Whether you have entomological expertise, development skills, or data management experience,
                            your contributions are valuable to our scientific community.
                        </p>
                        <div className="space-y-2 text-sm text-green-700">
                            <p>• Specimen data collection and verification</p>
                            <p>• Website feature development and enhancement</p>
                            <p>• Translation and multilingual support</p>
                            <p>• Documentation and user guide creation</p>
                        </div>
                        <p className="text-green-800 mt-4">
                            For collaboration inquiries, please contact Seunghyun Lee at{' '}
                            <a href="mailto:chiyark@snu.ac.kr"
                               className="text-green-900 underline hover:text-green-700">
                                chiyark@snu.ac.kr
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}