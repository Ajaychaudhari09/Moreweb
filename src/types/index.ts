export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: 'AI' | 'coding' | 'drama' | 'film' | 'general' | 'shopping';
  tags: string[];
  image?: string;
  content: string;
  readTime: number;
}

export type BlogCategory =
  | 'AI'
  | 'coding'
  | 'drama'
  | 'film'
  | 'general'
  | 'shopping';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category?: string;
  usageCount?: number;
}

export interface CategoryFilterProps {
  categories: string[];
  currentCategory: string;
}

export interface BlogCardProps {
  post: BlogPost;
}

export interface ToolCardProps {
  tool: Tool;
}

/* Calculators and tools */

export interface BMIInput {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
}

export interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese';
  categoryColor: string;
  interpretation: string;
  recommendations: string[];
}

export interface Exercise {
  name: string;
  reps: string;
  description: string;
}

export interface Workout {
  warm_up: string[];
  exercises: Exercise[];
  cool_down: string[];
  total_time: string;
}

export interface WorkoutPreferences {
  fitness_level: string;
  workout_type: string;
  duration: string;
  equipment: string;
}

export interface CalorieInput {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: string;
  goal: string;
  unit: 'metric' | 'imperial';
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  sedentary: number;
  light: number;
  moderate: number;
  active: number;
  veryActive: number;
  goals: {
    maintain: number;
    mildWeightLoss: number;
    weightLoss: number;
    extremeWeightLoss: number;
    mildWeightGain: number;
    weightGain: number;
    extremeWeightGain: number;
  };
  macros: {
    protein: { min: number; max: number };
    fat: { min: number; max: number };
    carbs: { min: number; max: number };
  };
}

export interface EMIInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

export interface EMIScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EMIResult {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  schedule: EMIScheduleItem[];
}
