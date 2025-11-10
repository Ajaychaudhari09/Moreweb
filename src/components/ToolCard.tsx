import Link from 'next/link';
import { Scale, Calculator, Dumbbell, CreditCard, FileText, Edit, Calendar, Utensils, Sparkles } from 'lucide-react';
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

const toolGradients = {
  'bmi-calculator': 'from-blue-500 to-cyan-500',
  'calorie-calculator': 'from-orange-500 to-red-500',
  'exercise-generator': 'from-green-500 to-teal-500',
  'emi-calculator': 'from-purple-500 to-pink-500',
  'resume-maker': 'from-indigo-500 to-blue-500',
  'text-editor': 'from-gray-500 to-slate-500',
  'date-time-calculator': 'from-yellow-500 to-orange-500',
  'diet-generator': 'from-emerald-500 to-green-500',
};

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = toolIcons[tool.id] || toolIcons.default;
  const gradient = toolGradients[tool.id as keyof typeof toolGradients] || 'from-pink-500 to-purple-600';

  return (
    <Link href={tool.href} className="block h-full">
      <div className="tool-card group cursor-pointer h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className={`flex h-20 w-20 mx-auto mb-6 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
            <Icon className="h-10 w-10 text-white" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:gradient-text transition-all duration-300 leading-tight">
            {tool.name}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-6 flex-1">
            {tool.description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="text-center mb-4">
            <div className="btn-vibrant inline-flex items-center gap-2 px-8 py-3 rounded-full group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Try Now</span>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Free Tool
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

