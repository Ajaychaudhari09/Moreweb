import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children, ...props }) => (
      <h1
        className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-12"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-5 mt-10"
        {...props}
      >
        {children}
      </h2>
    ),

    // Paragraphs with customizable text color via frontmatter
    p: ({ children, ...props }) => (
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6" {...props}>
        {children}
      </p>
    ),

    // Links with accent color
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
        {...props}
      >
        {children}
      </a>
    ),

    // Inline code
    code: ({ children, ...props }) => (
      <code
        className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    ),

    // Block code
    pre: ({ children, ...props }) => (
      <pre
        className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto mb-8"
        {...props}
      >
        {children}
      </pre>
    ),

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 italic p-4 mb-8"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Horizontal separator with icon
    hr: (props) => (
      <div className="flex items-center my-12" {...props}>
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
        <span className="mx-4 text-gray-500 dark:text-gray-400">•</span>
        <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
      </div>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-6" {...props}>
        {children}
      </ol>
    ),

    // Preserve any custom components
    ...components,
  };
}
