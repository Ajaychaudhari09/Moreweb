import type { Metadata } from 'next';
import CalorieCalculator from './client';

export const metadata: Metadata = {
  title: "Calorie Calculator - Estimate Daily Calorie Needs | MoreFusion",
  description: "Estimate your daily calorie needs for weight maintenance, loss, or gain using the Mifflin-St Jeor equation. Get personalized macronutrient breakdowns with our free online calorie calculator.",
  keywords: ["calorie calculator", "daily calorie needs", "weight loss calculator", "weight gain calculator", "BMR calculator", "macronutrients", "Mifflin-St Jeor"],
};

export default function CalorieCalculatorPage() {
  return <CalorieCalculator />;
}
