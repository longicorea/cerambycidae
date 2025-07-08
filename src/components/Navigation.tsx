import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="h-20 bg-white border-b border-gray-200 shadow-sm" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-row items-center w-full ">
        <div className="flex flex-row justify-between items-center w-full " >
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              IMMATURE DB
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/explore" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Explore
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}