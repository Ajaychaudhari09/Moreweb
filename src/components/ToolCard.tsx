import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
}

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.href}>
      <div className="tool-card group cursor-pointer">
        <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
          {tool.icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center group-hover:gradient-text transition-all duration-300">
          {tool.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          {tool.description}
        </p>
        <div className="mt-6 text-center">
          <div className="btn-vibrant inline-block px-6 py-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
            Try Now
          </div>
        </div>
      </div>
    </Link>
  );
}

// Named export for backward compatibility
export { ToolCard };
