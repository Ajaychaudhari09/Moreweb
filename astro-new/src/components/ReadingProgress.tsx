"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const scrolled = doc.scrollTop;
      const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;
      setWidth(pct);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="reading-progress-wrap">
      <div className="reading-progress" style={{ width: `${width}%` }} />
    </div>
  );
}
