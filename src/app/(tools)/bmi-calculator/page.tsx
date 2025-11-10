import type { Metadata } from 'next';
import BMICalculator from './client';

export const metadata: Metadata = {
  title: "BMI Calculator - Calculate Your Body Mass Index | MoreFusion",
  description: "Calculate your Body Mass Index (BMI) using metric or US units. Get instant results, categorize your BMI, and understand your healthy weight range with our free online BMI calculator.",
  keywords: ["BMI calculator", "body mass index", "health calculator", "weight calculator", "ideal weight", "metric BMI", "US BMI"],
};

export default function BMICalculatorPage() {
  return <BMICalculator />;
}
