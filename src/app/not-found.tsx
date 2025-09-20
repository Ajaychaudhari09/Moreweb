import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The page you are looking for doesnt exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Browse Blog
          </Link>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Popular Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link href="/bmi-calculator" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              BMI Calculator
            </Link>
            <Link href="/resume-maker" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Resume Maker
            </Link>
            <Link href="/emi-calculator" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              EMI Calculator
            </Link>
            <Link href="/calorie-calculator" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Calorie Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}