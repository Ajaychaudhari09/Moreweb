"use client";
import { useEffect } from "react";
import mediumZoom from "medium-zoom";

export default function ZoomProvider() {
  useEffect(() => {
    mediumZoom(".prose img", {
      background: "rgba(0, 0, 0, 0.85)",
      margin: 24,
    });
  }, []);

  return null;
}
