export default function PictorialKeyPupaePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pictorial Key - Pupae</h1>

                    <div className="prose prose-lg max-w-none">


                        <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-300 mb-3">Key Features
                                for Pupal Identification
                            </h2>
                            <p className="text-slate-800 dark:text-slate-200 mb-4">
                                Primary morphological characteristics used in pupal identification of cerambycid beetles
                            </p>
                            <img
                                src="https://my-cdn-worker.longicorea.workers.dev/images/pictorial_key/pupa.webp"
                                alt="Key Features for Pupal Identification"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />


                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}