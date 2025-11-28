import Link from 'next/link';
import { Scale, Calculator, Dumbbell, CreditCard, FileText, Edit, Calendar, Utensils, Sparkles, ArrowRight } from 'lucide-react';
import type { Tool } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="h-full flex flex-col border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
      <CardHeader className="flex flex-col items-center pt-8 pb-2">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md group-hover:scale-105 transition-transform duration-300 mb-4`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-center group-hover:text-primary transition-colors">
          <Link href={tool.href} className="after:absolute after:inset-0 focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {tool.name}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="flex-1 text-center px-6">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {tool.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center pb-6 gap-4">
        <Button className="w-full max-w-[140px] gap-2 group-hover:bg-primary/90 text-white pointer-events-none">
          <Sparkles className="h-4 w-4" />
          Try Now
        </Button>
        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 inline-block animate-pulse"></span>
          Free Tool
        </Badge>
      </CardFooter>
    </Card>
  );
}

