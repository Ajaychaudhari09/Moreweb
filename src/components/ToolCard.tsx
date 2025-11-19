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
      <article className="card group cursor-pointer h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center text-center">
                <div className={`card-icon mb-6 bg-linear-to-br ${gradient} group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
          </div>

          <h3 className="card-title mb-2 group-hover:gradient-text transition-colors duration-200">
            {tool.name}
          </h3>

          <p className="card-desc text-sm mb-4 px-2">
            {tool.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col items-center">
            <div className="card-cta">
              <button className="btn-primary focus-ring">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">Try Now</span>
              </button>
            </div>

          <div className="mt-4">
            <span className="tag tag--indigo">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 inline-block"></span>
              Free Tool
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

