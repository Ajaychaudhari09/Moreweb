
import Link from "next/link";

export default function AuthorBox({
  author,
}: {
  author: string;
}) {
  return (
    <div className="mt-14 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-sm">

      {/* Top section */}
      <div className="flex items-center gap-5">
      

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {author}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
            Writes technology guides, AI tutorials, productivity tips and
            in-depth analysis for MoreFusion — helping creators build smarter.
          </p>

          <div className="flex gap-4 mt-3">
            <Link
              href="https://morefusion.in"
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              Website
            </Link>
            <Link
              href="https://twitter.com/"
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
