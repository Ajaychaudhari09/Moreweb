import Link from 'next/link';
import { Scale, Calculator, Dumbbell, CreditCard, FileText, Edit, Calendar, Utensils } from 'lucide-react';
import type { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
}

const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'bmi-calculator': Scale,
  'calorie-calculator': Calculator,
  'exercise-generator': Dumbbell,
  'emi-calculator': CreditCard,
  'resume-maker': FileText,
  'text-editor': Edit,
  'date-time-calculator': Calendar,
  'diet-generator': Utensils,
  default: FileText,
};

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = toolIcons[tool.id] || toolIcons.default;

  return (
    <Link href={tool.href}>
      <div className="tool-card group cursor-pointer">
        <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center group-hover:gradient-text transition-all duration-300">
          {tool.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-2">
          {tool.description}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          {tool.category} • {tool.usageCount?.toLocaleString() || 0} uses
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
