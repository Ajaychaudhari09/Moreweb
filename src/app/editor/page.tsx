"use client";

import dynamic from "next/dynamic";

// ✅ Only define dynamic import once
const EditorDevPage = dynamic(() => import("./EditorDevPage"), { ssr: false });

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    // 🚫 In production → block access
    return <h1>404 - Not Found</h1>;
  }

  // ✅ In development → load editor
  return <EditorDevPage />;
}
