"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

type Item = {
    id: string;
    text: string;
    level: 2 | 3;
};

export default function MobileTOC() {
    const [items, setItems] = useState<Item[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const headings = Array.from(
            document.querySelectorAll<HTMLElement>(".article-content h2, .article-content h3")
        );

        const mapped: Item[] = headings
            .filter((h) => h.id)
            .map((h) => ({
                id: h.id,
                text: h.innerText || "",
                level: h.tagName === "H2" ? 2 : 3,
            }));

        setItems(mapped);
    }, []);

    if (!items.length) return null;

    return (
        <div className="lg:hidden mb-8 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950"
            >
                <span className="flex items-center gap-2">
                    <List size={20} />
                    Table of Contents
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <nav className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <ul className="space-y-3">
                        {items.map((h) => (
                            <li key={h.id} className={`${h.level === 3 ? "pl-4" : ""}`}>
                                <a
                                    href={`#${h.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 leading-snug"
                                >
                                    {h.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
}
