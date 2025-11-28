"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ToolCard = dynamic(() => import("./ToolCard"), {
  loading: () => (
    <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

export default function ToolsPageClient({ allTools }: { allTools: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const CATEGORIES = ["All", ...new Set(allTools.map((t) => t.category))];
  const ITEMS_PER_PAGE = 6;

  // Debounced search for performance
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Filter tools
  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tool.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, debouncedSearch, allTools]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 max-w-6xl">

      {/* HEADER / TITLE */}
      <section className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Free Online Productivity Tools
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Smart tools for health, finance, career, and daily productivity—fast, accurate, and beautifully designed.
        </p>

        {/* SEARCH BAR */}
        <div className="relative max-w-lg mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search for tools..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-12 py-4 text-lg rounded-full shadow-md dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <nav className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm rounded-full transition border
              ${cat === selectedCategory
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* TOOLS GRID */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-12">
        {paginatedTools.length ? (
          paginatedTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
        ) : (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">
            No tools found.
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-12 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
