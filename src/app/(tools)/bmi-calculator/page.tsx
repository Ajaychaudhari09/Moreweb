"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
  healthTips: string[];
  idealWeightRange: {
    min: number;
    max: number;
  };
}

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const calculateBMI = () => {
    if (!height || !weight) return;

    let heightInM: number;
    let weightInKg: number;

    if (unit === "imperial") {
      const inches = parseFloat(height);
      heightInM = inches * 0.0254;
      weightInKg = parseFloat(weight) * 0.453592;
    } else {
      heightInM = parseFloat(height) / 100;
      weightInKg = parseFloat(weight);
    }

    const bmi = weightInKg / (heightInM * heightInM);

    let category = "";
    let color = "";
    let description = "";
    let healthTips: string[] = [];

    const idealWeightRange = {
      min: Math.round(18.5 * heightInM * heightInM * 10) / 10,
      max: Math.round(24.9 * heightInM * heightInM * 10) / 10,
    };

    if (bmi < 18.5) {
      category = "Underweight";
      color = "from-blue-400 to-cyan-400";
      description = "You may need to gain some weight for optimal health";
      healthTips = [
        "Increase caloric intake with nutrient-dense foods",
        "Include protein-rich foods in every meal",
        "Consider strength training to build muscle mass",
        "Consult a healthcare provider if needed",
      ];
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal Weight";
      color = "from-green-400 to-emerald-400";
      description = "Great! You have a healthy weight range";
      healthTips = [
        "Maintain current healthy lifestyle",
        "Continue regular physical activity",
        "Eat a balanced, nutritious diet",
        "Monitor weight regularly",
      ];
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      color = "from-yellow-400 to-orange-400";
      description = "Consider making some lifestyle changes";
      healthTips = [
        "Aim for gradual weight loss (1-2 lbs per week)",
        "Increase physical activity",
        "Focus on portion control",
        "Choose whole foods over processed ones",
      ];
    } else {
      category = "Obese";
      color = "from-red-400 to-pink-400";
      description =
        "It&apos;s important to focus on your health with professional guidance";
      healthTips = [
        "Consult healthcare provider for weight management plan",
        "Consider supervised weight loss program",
        "Focus on sustainable lifestyle changes",
        "Include both diet and exercise modifications",
      ];
    }

    const newResult: BMIResult = {
      bmi: Math.round(bmi * 10) / 10,
      category,
      color,
      description,
      healthTips,
      idealWeightRange:
        unit === "imperial"
          ? {
              min: Math.round(idealWeightRange.min * 2.20462 * 10) / 10,
              max: Math.round(idealWeightRange.max * 2.20462 * 10) / 10,
            }
          : idealWeightRange,
    };

    setResult(newResult);
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4 animate-bounce-in">
            BMI Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your Body Mass Index and get personalized health insights
            with recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Form */}
          <Card className="vibrant-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center gradient-text">
                Enter Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unit System */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Unit System
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="unit"
                      value="metric"
                      checked={unit === "metric"}
                      onChange={(e) =>
                        setUnit(e.target.value as "metric" | "imperial")
                      }
                      className="mr-2"
                    />
                    Metric (kg, cm)
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="unit"
                      value="imperial"
                      checked={unit === "imperial"}
                      onChange={(e) =>
                        setUnit(e.target.value as "metric" | "imperial")
                      }
                      className="mr-2"
                    />
                    Imperial (lbs, inches)
                  </label>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {unit === "metric" ? "Height (cm)" : "Height (inches)"}
                </label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unit === "metric" ? "e.g., 175" : "e.g., 69"}
                  min="1"
                  max={unit === "metric" ? "300" : "120"}
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
                  min="1"
                  max={unit === "metric" ? "500" : "1000"}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={calculateBMI}
                  disabled={!height || !weight}
                  className="btn-vibrant flex-1 h-12 text-lg font-bold"
                >
                  Calculate BMI
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="h-12 px-6"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          <div>
            {result ? (
              <Card className="vibrant-card animate-bounce-in">
                <CardContent className="text-center py-8">
                  <div
                    className={`text-6xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent mb-2`}
                  >
                    {result.bmi}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {result.category}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-4">
                    {result.description}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Healthy Weight Range
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      {result.idealWeightRange.min} - {result.idealWeightRange.max}{" "}
                      {unit === "metric" ? "kg" : "lbs"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="vibrant-card">
                <CardContent className="text-center py-16">
                  <div className="text-6xl mb-6">📊</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Calculate
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill in your details to get your BMI result and personalized
                    health recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Health Tips */}
        {result && (
          <Card className="vibrant-card animate-bounce-in">
            <CardHeader>
              <CardTitle className="text-xl font-bold gradient-text">
                Health Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.healthTips.map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This BMI calculator is for
                  informational purposes only and should not replace professional
                  medical advice. BMI doesn&apos;t account for muscle mass, bone
                  density, and other factors. Always consult with healthcare
                  professionals for personalized assessments.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
