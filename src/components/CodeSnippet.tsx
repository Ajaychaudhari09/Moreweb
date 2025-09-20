// src/components/CodeSnippet.tsx
export default function CodeSnippet({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  return (
    <pre className="bg-gray-900 text-white p-4 rounded-md overflow-auto my-4">
      <code className={`language-${language}`}>{children}</code>
    </pre>
  );
}
