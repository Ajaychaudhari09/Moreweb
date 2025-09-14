'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateCalories } from '@/lib/utils';
import type { CalorieResult } from '@/types';

type Gender = 'male' | 'female';

export default function CalorieCalculatorPage() {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<Gender>('male');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    if (!age || parseFloat(age) <= 0 || parseFloat(age) > 120) newErrors.age = 'Please enter a valid age (1-120)';
    if (!weight || parseFloat(weight) <= 0) newErrors.weight = 'Please enter a valid weight';
    if (!height || parseFloat(height) <= 0) newErrors.height = 'Please enter a valid height';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const calorieResult = calculateCalories(ageNum, weightNum, heightNum, gender, 'sedentary', 'maintain');
    setResult(calorieResult);
  };

  const reset = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setGender('male');
    setResult(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Calorie Calculator</h1>
          <p className="text-muted-foreground">Calculate daily calories using the Mifflin‑St Jeor equation and common activity levels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calculate Daily Calorie Needs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Age (years) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className={errors.height ? 'border-red-500' : ''}
                />
                {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCalculate} className="flex-1">
                Calculate Calories
              </Button>
              <Button
                onClick={reset}
                className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Reset
              </Button>
            </div>

            {result && (
              <div className="mt-8 animate-bounce-in rounded-lg bg-muted p-6">
                <h3 className="mb-4 text-center text-lg font-semibold">Daily Calorie Needs</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">BMR (Basal Metabolic Rate)</span>
                      <span className="text-lg font-bold text-blue-500">{result.bmr} calories</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Calories burned at rest</p>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-lg bg-background p-3">
                      <div>
                        <span className="font-medium">Sedentary</span>
                        <p className="text-xs text-muted-foreground">Little or no exercise</p>
                      </div>
                      <span className="font-bold">{result.sedentary}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-background p-3">
                      <div>
                        <span className="font-medium">Light Activity</span>
                        <p className="text-xs text-muted-foreground">Light exercise 1-3 days/week</p>
                      </div>
                      <span className="font-bold">{result.light}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-background p-3">
                      <div>
                        <span className="font-medium">Moderate Activity</span>
                        <p className="text-xs text-muted-foreground">Moderate exercise 3-5 days/week</p>
                      </div>
                      <span className="font-bold">{result.moderate}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-background p-3">
                      <div>
                        <span className="font-medium">Active</span>
                        <p className="text-xs text-muted-foreground">Heavy exercise 6-7 days/week</p>
                      </div>
                      <span className="font-bold">{result.active}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-background p-3">
                      <div>
                        <span className="font-medium">Very Active</span>
                        <p className="text-xs text-muted-foreground">Very heavy exercise, physical job</p>
                      </div>
                      <span className="font-bold">{result.veryActive}</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded border bg-background p-3">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> Uses the Mifflin‑St Jeor equation; consult a professional for personalized nutrition advice. [7][10]
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
