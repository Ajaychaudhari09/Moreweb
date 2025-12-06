import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

/**
 * -----------------------------------------------------------------------------
 * BLOG TYPES (MD / MDX + Strapi-compatible)
 * -----------------------------------------------------------------------------
 * - Supports both `date` and `published_date` in frontmatter.
 * - `BlogPost.date` is the single normalized ISO string used everywhere.
 * - `category` is a strict union; keep folder names consistent.
 * - `readTime` is a number (render `${readTime} min read` in UI).
 * - `image` is optional cover image (alias "cover" in frontmatter is also common).
 * -----------------------------------------------------------------------------
 */

export type BlogCategory = "AI" | "coding" | "drama" | "film" | "general" | "shopping" | "health" | "news";

/**
 * Frontmatter shape accepted from MD/MDX files (and Strapi).
 * This is not used directly in components; it's a source shape
 * that your file loader (lib/blog.ts) will normalize into BlogPost.
 */
export interface BlogFrontmatter {
  title: string;
  slug: string;
  excerpt?: string;
  /** Optional; use as fallback if present */
  date?: string; // ISO
  /** Strapi-safe name; preferred when present */
  published_date?: string; // ISO
  author?: string;
  category: BlogCategory | string; // string allowed; normalize later
  tags?: string[];
  /** Optional cover image (alias commonly used: "cover") */
  image?: string;
  cover?: string;
  /** Optional last updated timestamp (ISO) */
  updatedAt?: string;
}

/**
 * Normalized blog object used across the app.
 * lib/blog.ts must produce this shape.
 */
export interface BlogPost {
  /** Stable composite ID like `${category}/${slug}` */
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Final normalized ISO date (from `published_date` -> `date` -> file mtime) */
  date: string;
  author: string;
  category: BlogCategory;
  tags: string[];
  image?: string | ImageMetadata; // cover image url or object
  content: string; // raw MD/MDX source (string)
  readTime: number; // minutes
  /** Optional fields for future features */
  updatedAt?: string; // ISO
  series?: string;
  _astroEntry?: CollectionEntry<'blog'>;
}

/**
 * -----------------------------------------------------------------------------
 * UI PROPS
 * -----------------------------------------------------------------------------
 */

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

/**
 * -----------------------------------------------------------------------------
 * TOOLS / UTILITIES TYPES
 * -----------------------------------------------------------------------------
 */

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
  href: string;
  category?: string;
  usageCount?: number;
}

/**
 * BMI
 */
export interface BMIInput {
  weight: number;
  height: number;
  unit: "metric" | "imperial";
}

export interface BMIResult {
  bmi: number;
  category: "Underweight" | "Normal Weight" | "Overweight" | "Obese";
  categoryColor: string;
  interpretation: string;
  recommendations: string[];
}

/**
 * Workout generator
 */
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

/**
 * Calories / Nutrition
 */
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
export type NutritionGoal =
  | "maintain"
  | "mildWeightLoss"
  | "weightLoss"
  | "extremeWeightLoss"
  | "mildWeightGain"
  | "weightGain"
  | "extremeWeightGain";

export interface CalorieInput {
  age: number;
  gender: "male" | "female";
  weight: number;
  height: number;
  activityLevel: ActivityLevel | string;
  goal: NutritionGoal | string;
  unit: "metric" | "imperial";
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

/**
 * EMI
 */
export interface EMIInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // years
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
