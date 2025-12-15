"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'maintain' | 'mildWeightLoss' | 'weightLoss' | 'extremeWeightLoss' | 'mildWeightGain' | 'weightGain' | 'extremeWeightGain';

interface CalorieResult {
    bmr: number;
    tdee: number;
    goals: Record<Goal, number>;
    macros: {
        protein: { min: number; max: number };
        fat: { min: number; max: number };
        carbs: { min: number; max: number };
    };
    zigzag: {
        day: string;
        calories: number;
    }[];
}

const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
};

const goalAdjustments: Record<Goal, number> = {
    maintain: 0,
    mildWeightLoss: -250,
    weightLoss: -500,
    extremeWeightLoss: -1000,
    mildWeightGain: 250,
    weightGain: 500,
    extremeWeightGain: 1000,
};

const activityDescriptions = {
    sedentary: 'Sedentary: little or no exercise',
    light: 'Light: exercise 1-3 times/week',
    moderate: 'Moderate: exercise 4-5 times/week',
    active: 'Active: daily exercise or intense exercise 3-4 times/week',
    veryActive: 'Very Active: intense exercise 6-7 times/week'
};

const goalDescriptions = {
    maintain: 'Maintain weight',
    mildWeightLoss: 'Mild weight loss (0.25 kg/week)',
    weightLoss: 'Weight loss (0.5 kg/week)',
    extremeWeightLoss: 'Extreme weight loss (1 kg/week)',
    mildWeightGain: 'Mild weight gain (0.25 kg/week)',
    weightGain: 'Weight gain (0.5 kg/week)',
    extremeWeightGain: 'Extreme weight gain (1 kg/week)'
};

function calculateZigzag(tdee: number): { day: string; calories: number }[] {
    // Zigzag around maintenance (or target)
    // Scheme: High days = +15%, Low days = Compensate.
    const high = Math.round(tdee * 1.15);
    // 7 * tdee = 2 * high + 5 * low
    // 5 * low = 7 * tdee - 2 * high
    const low = Math.round((tdee * 7 - high * 2) / 5);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(d => ({
        day: d,
        calories: (d === 'Sunday' || d === 'Saturday') ? high : low
    }));
}

function calculateCalories(
    age: number,
    weight: number,
    height: number,
    gender: Gender,
    activityLevel: ActivityLevel,
    goal: Goal
): CalorieResult {
    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    // Macro ranges (Protein 20-30%, Fat 20-30%, Carbs 40-60%) for TDEE
    const proteinMin = Math.round((tdee * 0.2) / 4);
    const proteinMax = Math.round((tdee * 0.3) / 4);
    const fatMin = Math.round((tdee * 0.2) / 9);
    const fatMax = Math.round((tdee * 0.3) / 9);
    const carbsMin = Math.round((tdee * 0.4) / 4);
    const carbsMax = Math.round((tdee * 0.6) / 4);

    const goals: Record<Goal, number> = {
        maintain: tdee,
        mildWeightLoss: Math.round(tdee - 250),
        weightLoss: Math.round(tdee - 500),
        extremeWeightLoss: Math.round(tdee - 1000),
        mildWeightGain: Math.round(tdee + 250),
        weightGain: Math.round(tdee + 500),
        extremeWeightGain: Math.round(tdee + 1000),
    };

    const zigzag = calculateZigzag(tdee);

    return {
        bmr: Math.round(bmr),
        tdee,
        goals,
        macros: {
            protein: { min: proteinMin, max: proteinMax },
            fat: { min: fatMin, max: fatMax },
            carbs: { min: carbsMin, max: carbsMax },
        },
        zigzag
    };
}

export default function CalorieCalculator() {
    const [age, setAge] = useState<string>('25');
    const [weight, setWeight] = useState<string>('70');
    const [height, setHeight] = useState<string>('175');
    const [gender, setGender] = useState<Gender>('male');
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
    const [result, setResult] = useState<CalorieResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
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
        setLoading(true);

        // Simulating calculation delay for better UX
        setTimeout(() => {
            const ageNum = Number.parseFloat(age);
            const weightNum = Number.parseFloat(weight);
            const heightNum = Number.parseFloat(height);
            // Default goal 'maintain' passed but object returns all
            const calorieResult = calculateCalories(ageNum, weightNum, heightNum, gender, activityLevel, 'maintain');

            setResult(calorieResult);
            setLoading(false);
            setStep(2);
        }, 600);
    };

    const reset = () => {
        setAge('');
        setWeight('');
        setHeight('');
        setGender('male');
        setActivityLevel('sedentary');
        setResult(null);
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-xs">
                <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Calorie Calculator
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Scientific estimation of your daily calorie needs for weight loss, maintenance, or gain.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8">
                {step === 1 && (
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden md:p-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Your Stats</h2>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="25"
                                                className={`pr-8 ${errors.age ? 'border-red-300' : ''}`}
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-gray-400">yr</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <div className="flex bg-gray-100 p-1 rounded-md">
                                            {(['male', 'female'] as const).map((g) => (
                                                <button
                                                    key={g}
                                                    onClick={() => setGender(g)}
                                                    className={`flex-1 text-sm py-1.5 rounded-sm capitalize transition-all ${gender === g ? 'bg-white text-blue-600 shadow-xs font-medium' : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                placeholder="175"
                                                className={`pr-8 ${errors.height ? 'border-red-300' : ''}`}
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-gray-400">cm</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder="70"
                                                className={`pr-8 ${errors.weight ? 'border-red-300' : ''}`}
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-gray-400">kg</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={activityLevel}
                                        onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                                    >
                                        {Object.entries(activityDescriptions).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <Button onClick={handleCalculate} className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                                        {loading ? 'Calculating...' : 'Calculate'}
                                    </Button>
                                    <Button variant="outline" onClick={reset}>Clear</Button>
                                </div>
                            </div>

                            {/* Interactive Info Panel / Decorator */}
                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 text-sm text-slate-600 flex flex-col justify-center">
                                <h3 className="font-semibold text-slate-800 mb-2">Did you know?</h3>
                                <p className="mb-4">
                                    The <strong>Mifflin-St Jeor</strong> equation is considered one of the most accurate BMR formulas for healthy individuals.
                                </p>
                                <p>
                                    Your BMR (Basal Metabolic Rate) is essentially the number of calories your body burns if you stayed in bed all day. Activity multipliers are then applied to find your TDEE (Total Daily Energy Expenditure).
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Results Section */}
                {step === 2 && result && !loading && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
                            <Button variant="outline" onClick={() => setStep(1)}>Recalculate</Button>
                        </div>

                        {/* Primary Result Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Maintain Weight</span>
                                <span className="text-4xl font-extrabold text-gray-900">{result.tdee.toLocaleString()}</span>
                                <span className="text-sm text-gray-500 mt-1">Calories / day</span>
                                <div className="mt-4 text-xs bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
                                    Base Requirement (100% TDEE)
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                                <div className="flex justify-between items-center border-b pb-3">
                                    <div>
                                        <div className="font-semibold text-gray-900">Mild Weight Loss</div>
                                        <div className="text-xs text-gray-500">0.25 kg/week</div>
                                    </div>
                                    <div className="text-xl font-bold text-green-600">{result.goals.mildWeightLoss}</div>
                                </div>
                                <div className="flex justify-between items-center border-b pb-3">
                                    <div>
                                        <div className="font-semibold text-gray-900">Weight Loss</div>
                                        <div className="text-xs text-gray-500">0.5 kg/week</div>
                                    </div>
                                    <div className="text-xl font-bold text-green-600">{result.goals.weightLoss}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-gray-900">Extreme Weight Loss</div>
                                        <div className="text-xs text-gray-500">1 kg/week</div>
                                    </div>
                                    <div className="text-xl font-bold text-green-600">{result.goals.extremeWeightLoss}</div>
                                </div>
                            </div>
                        </div>

                        {/* Guidance Section */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-blue-900 mb-3">Nutrition Guidance</h3>
                            <div className="prose prose-sm text-blue-800 max-w-none">
                                <p>
                                    To <strong>maintain your current weight</strong>, you should consume approximately <strong>{result.tdee.toLocaleString()} calories</strong> per day.
                                </p>
                                <ul className="mt-2 space-y-1 list-disc list-inside">
                                    <li>
                                        To <strong>lose weight</strong> (0.5 kg/week), you need a calorie deficit of ~500 kcal per day. You should target <strong>{result.goals.weightLoss.toLocaleString()} calories</strong> daily.
                                    </li>
                                    <li>
                                        To <strong>gain weight</strong> (0.5 kg/week), you need a calorie surplus of ~500 kcal per day. You should target <strong>{result.goals.weightGain.toLocaleString()} calories</strong> daily.
                                    </li>
                                </ul>
                                <p className="mt-4 text-xs text-blue-600">
                                    * These values are estimates. Everyone's metabolism is different. Monitor your weight weekly and adjust your intake by ±100-200 calories if not seeing desired results.
                                </p>
                            </div>
                        </div>

                        {/* Detailed Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <Tabs defaultValue="table" className="w-full">
                                <div className="border-b px-6 pt-4">
                                    <TabsList className="grid w-full max-w-md grid-cols-3">
                                        <TabsTrigger value="table">All Goals</TabsTrigger>
                                        <TabsTrigger value="zigzag">Zigzag Cycle</TabsTrigger>
                                        <TabsTrigger value="macros">Macronutrients</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="table" className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Weight Control Table</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Goal</th>
                                                    <th className="px-4 py-3">Weight Change</th>
                                                    <th className="px-4 py-3 rounded-tr-lg text-right">Calories</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr>
                                                    <td className="px-4 py-3 font-medium">Extreme Weight Loss</td>
                                                    <td className="px-4 py-3 text-gray-500">-1 kg/week</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-red-600">{result.goals.extremeWeightLoss}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium">Weight Loss</td>
                                                    <td className="px-4 py-3 text-gray-500">-0.5 kg/week</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-orange-600">{result.goals.weightLoss}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium">Mild Weight Loss</td>
                                                    <td className="px-4 py-3 text-gray-500">-0.25 kg/week</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-yellow-600">{result.goals.mildWeightLoss}</td>
                                                </tr>
                                                <tr className="bg-green-50/50">
                                                    <td className="px-4 py-3 font-medium text-green-900">Maintain Weight</td>
                                                    <td className="px-4 py-3 text-green-700">-</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-green-700">{result.goals.maintain}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium">Mild Weight Gain</td>
                                                    <td className="px-4 py-3 text-gray-500">+0.25 kg/week</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{result.goals.mildWeightGain}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium">Weight Gain</td>
                                                    <td className="px-4 py-3 text-gray-500">+0.5 kg/week</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{result.goals.weightGain}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-medium">Extreme Weight Gain</td>
                                                    <td className="px-4 py-3 text-gray-500">+1 kg/week</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">{result.goals.extremeWeightGain}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="zigzag" className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">Zigzag Calorie Cycling</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Zigzag calorie cycling (or "calorie shifting") involves changing your daily calorie intake throughout the week. This approach can help prevent metabolic slowdown and plateaus.
                                            </p>
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 text-gray-700 border-b">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left">Day</th>
                                                            <th className="px-4 py-2 text-right">Calories</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {result.zigzag.map((z, i) => (
                                                            <tr key={i} className={z.calories > result.tdee ? 'bg-orange-50' : 'bg-white'}>
                                                                <td className="px-4 py-2 font-medium">{z.day}</td>
                                                                <td className="px-4 py-2 text-right font-mono">{z.calories}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-64 bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm">
                                            <h4 className="font-semibold text-yellow-800 mb-2">How it works</h4>
                                            <p className="text-yellow-700 mb-2">
                                                This schedule alternates <strong>High Calorie</strong> days (Weekends) with <strong>Lower Calorie</strong> days (Weekdays).
                                            </p>
                                            <p className="text-yellow-700">
                                                The weekly total average equals your maintenance calories, preventing weight gain while keeping metabolism active.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="macros" className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Balanced Macronutrients</h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Suggested breakdown for a balanced diet based on your maintenance calories.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-center">
                                            <div className="text-blue-600 font-bold mb-1">Carbohydrates</div>
                                            <div className="text-2xl font-bold text-gray-900">{Math.round((result.macros.carbs.min + result.macros.carbs.max) / 2)}g</div>
                                            <div className="text-xs text-gray-500 mt-1">45-65% of energy</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-center">
                                            <div className="text-green-600 font-bold mb-1">Protein</div>
                                            <div className="text-2xl font-bold text-gray-900">{Math.round((result.macros.protein.min + result.macros.protein.max) / 2)}g</div>
                                            <div className="text-xs text-gray-500 mt-1">10-35% of energy</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-center">
                                            <div className="text-yellow-600 font-bold mb-1">Fats</div>
                                            <div className="text-2xl font-bold text-gray-900">{Math.round((result.macros.fat.min + result.macros.fat.max) / 2)}g</div>
                                            <div className="text-xs text-gray-500 mt-1">20-35% of energy</div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
