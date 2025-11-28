"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  text: string;
  level: 2 | 3;
};

export default function TOC() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Query returns nodes in DOM order already
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
    <nav aria-label="Table of Contents" className="space-y-2 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Table of Contents</p>
      {items.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block hover:text-blue-600 ${
            h.level === 3
              ? "ml-3 text-gray-600 dark:text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
