import type { Metadata } from "next";
import BMICalculator from "./client";

export const metadata: Metadata = {
  title: "BMI Calculator | Free Body Mass Index & Ideal Weight Tool",
  description:
    "Free online BMI Calculator to check your Body Mass Index using metric or US units. Includes BMI Prime, Ponderal Index, ideal weight range, FAQ, and downloadable PDF report.",
  keywords: [
    "BMI calculator",
    "body mass index",
    "healthy weight",
    "health calculator",
    "ideal weight",
    "BMI Prime",
    "Ponderal Index",
    "MoreFusion Tools"
  ],
  alternates: {
    canonical: "https://morefusion.in/tools/bmi-calculator",
  },
  openGraph: {
    title: "BMI Calculator | Free Online Health Tool",
    description: "Instant BMI calculation, ideal weight range, PDF download, and health category insights.",
    url: "https://morefusion.in/tools/bmi-calculator",
    type: "website",
  },
};

export default function BMICalculatorPage() {
  return <BMICalculator />;
}
