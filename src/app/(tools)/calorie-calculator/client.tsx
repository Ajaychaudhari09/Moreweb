'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateCalories } from '@/lib/utils';
import type { CalorieResult } from '@/types';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'maintain' | 'mildWeightLoss' | 'weightLoss' | 'extremeWeightLoss' | 'mildWeightGain' | 'weightGain' | 'extremeWeightGain';

const activityDescriptions = {
  sedentary: 'Desk job, little to no exercise',
  light: '1-3 days/week light exercise or sports',
  moderate: '3-5 days/week moderate exercise',
  active: '6-7 days/week hard exercise',
  veryActive: 'Very hard exercise, physical job, or 2x/day training'
};

const goalDescriptions = {
  maintain: 'Maintain current weight',
  mildWeightLoss: 'Lose 0.25kg (0.5lb) per week',
  weightLoss: 'Lose 0.5kg (1lb) per week',
  extremeWeightLoss: 'Lose 1kg (2lb) per week',
  mildWeightGain: 'Gain 0.25kg (0.5lb) per week',
  weightGain: 'Gain 0.5kg (1lb) per week',
  extremeWeightGain: 'Gain 1kg (2lb) per week'
};

export default function CalorieCalculator() {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    const ageNum = Number.parseFloat(age);
    const weightNum = Number.parseFloat(weight);
    const heightNum = Number.parseFloat(height);

    if (!age || ageNum <= 0 || ageNum > 120) newErrors.age = 'Please enter a valid age (1-120)';
    if (!weight || weightNum <= 0 || weightNum > 1000) newErrors.weight = 'Please enter a valid weight (1-1000kg)';
    if (!height || heightNum <= 0 || heightNum > 300) newErrors.height = 'Please enter a valid height (1-300cm)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    const ageNum = Number.parseFloat(age);
    const weightNum = Number.parseFloat(weight);
    const heightNum = Number.parseFloat(height);
    const calorieResult = calculateCalories(ageNum, weightNum, heightNum, gender, activityLevel, goal);
    setResult(calorieResult);
  };

  const reset = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setGender('male');
    setActivityLevel('sedentary');
    setGoal('maintain');
    setResult(null);
    setErrors({});
  };

  const targetCalories = result?.goals[goal] || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Daily Calorie Calculator
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Calculate your daily calorie needs using the Mifflin-St Jeor equation with personalized activity and goal settings.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Calculator Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Enter Your Details</h2>
          <p className="text-sm text-gray-600 mb-6">All fields are required for accurate calculations</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCalculate();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                  Age (years)
                </label>
                <Input
                  id="age"
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className={errors.age ? 'border-red-300' : ''}
                  required
                />
                {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
                  Weight (kg)
                </label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={1000}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70.5"
                  className={errors.weight ? 'border-red-300' : ''}
                  required
                />
                {errors.weight && <p className="mt-1 text-xs text-red-600">{errors.weight}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="height">
                  Height (cm)
                </label>
                <Input
                  id="height"
                  type="number"
                  min={1}
                  max={300}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  className={errors.height ? 'border-red-300' : ''}
                  required
                />
                {errors.height && <p className="mt-1 text-xs text-red-600">{errors.height}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <fieldset className="border border-gray-200 rounded-md p-4">
                <legend className="text-sm font-medium text-gray-700 px-2">Gender</legend>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Female</span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="activity">
                  Activity Level
                </label>
                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(activityDescriptions).map(([key, description]) => (
                    <option key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="goal">
                Goal
              </label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.entries(goalDescriptions).map(([key, description]) => (
                  <option key={key} value={key}>
                    {description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 sm:flex-none sm:px-8">
                Calculate Calories
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                className="flex-1 sm:flex-none sm:px-8"
              >
                Reset
              </Button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        {result && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Results</h2>
            
            {/* Main Result */}
            <div className="text-center mb-6 p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600">{targetCalories}</div>
              <div className="text-lg font-medium text-gray-900 mt-1">Daily Calories</div>
              <div className="text-sm text-gray-600">{goalDescriptions[goal]}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BMR and Activity Levels */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Calorie Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <div>
                      <div className="font-medium text-gray-900">BMR</div>
                      <div className="text-xs text-gray-600">Calories at rest</div>
                    </div>
                    <div className="text-lg font-semibold text-blue-600">{result.bmr}</div>
                  </div>
                  
                  {[
                    { key: 'sedentary' as const, label: 'Sedentary', value: result.sedentary },
                    { key: 'light' as const, label: 'Light Activity', value: result.light },
                    { key: 'moderate' as const, label: 'Moderate Activity', value: result.moderate },
                    { key: 'active' as const, label: 'Active', value: result.active },
                    { key: 'veryActive' as const, label: 'Very Active', value: result.veryActive }
                  ].map(({ key, label, value }) => (
                    <div
                      key={key}
                      className={`flex justify-between items-center p-2 rounded-md text-sm ${
                        key === activityLevel ? 'bg-green-100 font-medium' : 'bg-gray-50'
                      }`}
                    >
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Macronutrients */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Daily Macronutrients</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                    <div>
                      <div className="font-medium text-red-800">Protein</div>
                      <div className="text-xs text-red-600">{result.macros.protein.min}-{result.macros.protein.max}g</div>
                    </div>
                    <div className="text-lg font-semibold text-red-600">
                      {Math.round((result.macros.protein.min + result.macros.protein.max) / 2)}g
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                    <div>
                      <div className="font-medium text-yellow-800">Fat</div>
                      <div className="text-xs text-yellow-600">{result.macros.fat.min}-{result.macros.fat.max}g</div>
                    </div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {Math.round((result.macros.fat.min + result.macros.fat.max) / 2)}g
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <div>
                      <div className="font-medium text-blue-800">Carbs</div>
                      <div className="text-xs text-blue-600">{result.macros.carbs.min}-{result.macros.carbs.max}g</div>
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {Math.round((result.macros.carbs.min + result.macros.carbs.max) / 2)}g
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Educational Content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
            <p className="text-gray-700 text-sm mb-4">
              This calculator uses the Mifflin-St Jeor equation, the most accurate method for estimating BMR in healthy adults.
            </p>
            <h4 className="font-medium text-gray-900 mb-2">The Formula</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Men:</strong> BMR = 10 × weight + 6.25 × height - 5 × age + 5</li>
              <li><strong>Women:</strong> BMR = 10 × weight + 6.25 × height - 5 × age - 161</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              Total daily calories = BMR × activity factor + goal adjustment
            </p>
          </article>

          <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Macronutrient Ranges</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-red-400 pl-3">
                <div className="font-medium text-gray-900 text-sm">Protein: 20-30%</div>
                <div className="text-xs text-gray-600">Muscle maintenance, satiety</div>
              </div>
              <div className="border-l-4 border-yellow-400 pl-3">
                <div className="font-medium text-gray-900 text-sm">Fat: 20-30%</div>
                <div className="text-xs text-gray-600">Hormone production, absorption</div>
              </div>
              <div className="border-l-4 border-blue-400 pl-3">
                <div className="font-medium text-gray-900 text-sm">Carbs: 40-60%</div>
                <div className="text-xs text-gray-600">Primary energy source</div>
              </div>
            </div>
          </article>
        </section>

        {/* Tips Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-2">Weight Loss</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Create 500-750 calorie daily deficit</li>
              <li>• Prioritize protein intake</li>
              <li>• Include strength training</li>
              <li>• Stay hydrated</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-2">Weight Gain</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Add 300-500 calories daily</li>
              <li>• Choose nutrient-dense foods</li>
              <li>• Eat frequently</li>
              <li>• Include resistance training</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:col-span-2 lg:col-span-1">
            <h4 className="font-medium text-gray-900 mb-2">Important Notes</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Results are estimates</li>
              <li>• Individual variation ±15%</li>
              <li>• Adjust based on progress</li>
              <li>• Consult professionals</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        </div>
      </footer>
    </div>
  );
}
