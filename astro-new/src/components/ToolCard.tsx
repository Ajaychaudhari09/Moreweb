
import { Scale, Calculator, Dumbbell, CreditCard, FileText, Edit, Calendar, Utensils, ArrowRight } from 'lucide-react';
import type { Tool } from '@/types';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="group relative h-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 rounded-2xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

      <CardHeader className="relative pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2.5 py-0.5 rounded-full text-xs group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
            Free
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          <a href={tool.href} className="after:absolute after:inset-0 focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {tool.name}
          </a>
        </h3>
      </CardHeader>

      <CardContent className="relative px-6 pb-6">
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6">
          {tool.description}
        </p>

        <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Try Tool <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

