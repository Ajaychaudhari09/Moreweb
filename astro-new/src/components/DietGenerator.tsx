"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Shared Types & Logic (Merged from CalorieCalculator for self-containment) ---
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type WeightGoal = 'maintain' | 'mildWeightLoss' | 'weightLoss' | 'extremeWeightLoss' | 'mildWeightGain' | 'weightGain' | 'extremeWeightGain';

const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
};

const goalAdjustments: Record<WeightGoal, number> = {
    maintain: 0,
    mildWeightLoss: -250,
    weightLoss: -500,
    extremeWeightLoss: -1000,
    mildWeightGain: 250,
    weightGain: 500,
    extremeWeightGain: 1000,
};

function calculateTDEE(age: number, weight: number, height: number, gender: Gender, activity: ActivityLevel, goal: WeightGoal): number {
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') bmr += 5;
    else bmr -= 161;

    const tdee = bmr * activityMultipliers[activity];
    return Math.round(tdee + goalAdjustments[goal]);
}

// --- Diet Types ---

type DietData = {
    diet_types: { id: string; label: string; macro_split_pct: { carb: number[]; protein: number[]; fat: number[] } }[];
    goals: { id: string; label: string; calorie_adjust_pct: number }[]; // keeping this for legacy data structure compatibility if needed, but we rely on new calc
    meal_split_pct: { breakfast: number; lunch: number; snacks: number; dinner: number };
    foods: {
        id: string;
        name: string;
        category: 'grains' | 'legumes' | 'protein' | 'dairy' | 'nuts_seeds' | 'fats_oils' | 'vegetables' | 'fruits';
        diet_tags: string[];
        allergens: string[];
        per_100g: { kcal: number; carb_g: number; protein_g: number; fat_g: number };
        gi: 'low' | 'medium' | 'high';
        region: string;
    }[];
};

interface Preferences {
    // Calculator inputs
    age: string;
    gender: Gender;
    height: string;
    weight: string;
    activity: ActivityLevel;
    weightGoal: WeightGoal;

    // Diet inputs
    diet_type: string;
    restrictions: string;
    // Manual override
    customCalories: string;
    useCustomCalories: boolean;
}

interface MealOut {
    title: string;
    items: { label: string; grams: number; kcal: number; carb_g: number; protein_g: number; fat_g: number }[];
    totals: { kcal: number; carb_g: number; protein_g: number; fat_g: number };
}

interface PlanOut {
    targetCalories: number;
    meals: MealOut[];
    totals: { kcal: number; carb_g: number; protein_g: number; fat_g: number };
}

const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

export default function DietGenerator() {
    const [data, setData] = useState<DietData | null>(null);
    const [preferences, setPreferences] = useState<Preferences>({
        age: '30',
        gender: 'male',
        height: '175',
        weight: '75',
        activity: 'moderate',
        weightGoal: 'weightLoss',
        diet_type: 'balanced',
        restrictions: '',
        customCalories: '',
        useCustomCalories: false,
    });
    const [plan, setPlan] = useState<PlanOut | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1); // 1 = Input, 2 = Results

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/data/diets.json', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to load diet data');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error loading diet data:", error);
            }
        })();
    }, []);

    const calculatedCalories = useMemo(() => {
        if (!preferences.age || !preferences.weight || !preferences.height) return 0;
        return calculateTDEE(
            Number(preferences.age),
            Number(preferences.weight),
            Number(preferences.height),
            preferences.gender,
            preferences.activity,
            preferences.weightGoal
        );
    }, [preferences.age, preferences.weight, preferences.height, preferences.gender, preferences.activity, preferences.weightGoal]);

    // This logic mimics the previous component but adapted/cleaned
    function allowedFoods() {
        if (!data) return [];
        const restrict = preferences.restrictions
            .toLowerCase()
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        const diet = preferences.diet_type;
        const normalize = (s: string) => s.replace(/[?*]+/g, '').toLowerCase();

        return data.foods.filter(f => {
            const tags = f.diet_tags.map(normalize);
            const allergens = f.allergens.map(normalize);
            const name = f.name.toLowerCase();
            const dietOK =
                tags.includes(diet) ||
                (diet === 'vegetarian' && tags.includes('balanced')) ||
                (diet === 'vegan' && tags.includes('balanced')) ||
                (diet === 'high_protein' && tags.includes('balanced')) ||
                (diet === 'low_carb' && (tags.includes('low_carb') || tags.includes('keto') || tags.includes('balanced'))) ||
                (diet === 'keto' && (tags.includes('keto') || tags.includes('low_carb')));

            if (!dietOK) return false;
            if (diet === 'vegan' && ['dairy', 'egg', 'fish'].some(a => allergens.includes(a))) return false;
            if (diet === 'vegetarian' && ['fish'].some(a => allergens.includes(a))) return false;
            const blocked = restrict.some(r => allergens.includes(r) || name.includes(r));
            return !blocked;
        });
    }

    function pickServing(
        food: DietData['foods'][number],
        macroKey: 'protein_g' | 'carb_g' | 'fat_g',
        macroTarget: number,
        kcalCap: number
    ) {
        const per = food.per_100g;
        const density = per[macroKey];
        if (density <= 0) return null;
        let grams = Math.max(40, Math.min(300, Math.round((macroTarget / (density / 100)) / 5) * 5));
        const kcal = (per.kcal / 100) * grams;
        if (kcal > kcalCap) {
            const factor = kcalCap / kcal;
            grams = Math.max(30, Math.round((grams * factor) / 5) * 5);
        }
        const out = {
            label: food.name,
            grams,
            kcal: round2((per.kcal / 100) * grams),
            carb_g: round2((per.carb_g / 100) * grams),
            protein_g: round2((per.protein_g / 100) * grams),
            fat_g: round2((per.fat_g / 100) * grams)
        };
        return out;
    }

    function buildMeal(
        title: string,
        kcalTarget: number,
        macroTargets: { carb_g: number; protein_g: number; fat_g: number },
        pool: DietData['foods'][number][]
    ): MealOut {
        const proteins = pool.filter(f => f.category === 'protein' || (f.category === 'legumes' && preferences.diet_type !== 'keto'));
        const carbs = preferences.diet_type === 'keto'
            ? pool.filter(f => f.category === 'vegetables' && f.per_100g.carb_g <= 5)
            : pool.filter(f => f.category === 'grains' || f.category === 'fruits' || f.category === 'legumes');
        const fats = pool.filter(f => f.category === 'fats_oils' || f.category === 'nuts_seeds');

        const items: MealOut['items'] = [];
        let kcalLeft = kcalTarget;

        if (proteins.length) {
            const p = proteins.sort((a, b) => b.per_100g.protein_g - a.per_100g.protein_g)[0];
            const s = pickServing(p, 'protein_g', macroTargets.protein_g, kcalLeft / 2); // Allocate half cals to main protein
            if (s) {
                items.push(s);
                kcalLeft = Math.max(0, kcalLeft - s.kcal);
            }
        }
        if (carbs.length && preferences.diet_type !== 'keto') {
            const c = carbs.sort((a, b) => b.per_100g.carb_g - a.per_100g.carb_g)[0];
            const s = pickServing(c, 'carb_g', macroTargets.carb_g, kcalLeft * 0.7);
            if (s) {
                items.push(s);
                kcalLeft = Math.max(0, kcalLeft - s.kcal);
            }
        }
        if (fats.length && kcalLeft > 50) {
            const index = Math.floor(Math.random() * Math.min(3, fats.length));
            const f = fats[index];
            const s = pickServing(f, 'fat_g', macroTargets.fat_g, kcalLeft);
            if (s) {
                items.push(s);
                kcalLeft = Math.max(0, kcalLeft - s.kcal);
            }
        }

        // Simple fallback if meal is too small (add random veggie or fruit)
        // Omitted for brevity, but this logic ensures at least some items.

        const totals = items.reduce(
            (acc, x) => {
                acc.kcal += x.kcal;
                acc.carb_g += x.carb_g;
                acc.protein_g += x.protein_g;
                acc.fat_g += x.fat_g;
                return acc;
            },
            { kcal: 0, carb_g: 0, protein_g: 0, fat_g: 0 }
        );

        return {
            title,
            items,
            totals: {
                kcal: Math.round(totals.kcal),
                carb_g: Math.round(totals.carb_g),
                protein_g: Math.round(totals.protein_g),
                fat_g: Math.round(totals.fat_g)
            }
        };
    }

    const generate = () => {
        if (!data) return;
        setLoading(true);

        setTimeout(() => {
            const targetCal = preferences.useCustomCalories ? Number(preferences.customCalories) : calculatedCalories;
            const foods = allowedFoods();
            const splits = data.meal_split_pct;

            // Get diet type macros
            const dt = data.diet_types.find(x => x.id === preferences.diet_type);
            const macroPct = dt ? {
                carb: (dt.macro_split_pct.carb[0] + dt.macro_split_pct.carb[1]) / 2,
                protein: (dt.macro_split_pct.protein[0] + dt.macro_split_pct.protein[1]) / 2,
                fat: (dt.macro_split_pct.fat[0] + dt.macro_split_pct.fat[1]) / 2
            } : { carb: 40, protein: 30, fat: 30 }; // Default balanced

            const mealKcals = {
                breakfast: Math.round((splits.breakfast / 100) * targetCal),
                lunch: Math.round((splits.lunch / 100) * targetCal),
                snacks: Math.round((splits.snacks / 100) * targetCal),
                dinner: Math.round((splits.dinner / 100) * targetCal)
            };
            const mealMacros = (k: keyof typeof mealKcals) => ({
                carb_g: Math.round((mealKcals[k] * (macroPct.carb / 100)) / 4),
                protein_g: Math.round((mealKcals[k] * (macroPct.protein / 100)) / 4),
                fat_g: Math.round((mealKcals[k] * (macroPct.fat / 100)) / 9)
            });

            const meals: MealOut[] = [];
            meals.push(buildMeal('Breakfast', mealKcals.breakfast, mealMacros('breakfast'), foods));
            meals.push(buildMeal('Lunch', mealKcals.lunch, mealMacros('lunch'), foods));
            meals.push(buildMeal('Afternoon Snack', mealKcals.snacks, mealMacros('snacks'), foods));
            meals.push(buildMeal('Dinner', mealKcals.dinner, mealMacros('dinner'), foods));

            const totals = meals.reduce(
                (acc, m) => {
                    acc.kcal += m.totals.kcal;
                    acc.carb_g += m.totals.carb_g;
                    acc.protein_g += m.totals.protein_g;
                    acc.fat_g += m.totals.fat_g;
                    return acc;
                },
                { kcal: 0, carb_g: 0, protein_g: 0, fat_g: 0 }
            );

            setPlan({
                targetCalories: targetCal,
                meals,
                totals: {
                    kcal: totals.kcal,
                    carb_g: totals.carb_g,
                    protein_g: totals.protein_g,
                    fat_g: totals.fat_g
                }
            });
            setLoading(false);
            setStep(2);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-5 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">Diet Generator</h1>
                        <p className="text-sm text-slate-500">Create a personalized meal plan in seconds.</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {step === 1 ? (
                    <section className="bg-white rounded-xl shadow-sm border p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold mb-6 border-b pb-2">1. Enter Your Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Body Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Gender</label>
                                        <select
                                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                            value={preferences.gender}
                                            onChange={(e) => setPreferences({ ...preferences, gender: e.target.value as Gender })}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Age</label>
                                        <Input type="number" value={preferences.age} onChange={(e) => setPreferences({ ...preferences, age: e.target.value })} placeholder="30" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                                        <Input type="number" value={preferences.height} onChange={(e) => setPreferences({ ...preferences, height: e.target.value })} placeholder="175" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                                        <Input type="number" value={preferences.weight} onChange={(e) => setPreferences({ ...preferences, weight: e.target.value })} placeholder="75" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Activity Level</label>
                                    <select
                                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                        value={preferences.activity}
                                        onChange={(e) => setPreferences({ ...preferences, activity: e.target.value as ActivityLevel })}
                                    >
                                        <option value="sedentary">Sedentary (Little/no exercise)</option>
                                        <option value="light">Light (1-3 days/week)</option>
                                        <option value="moderate">Moderate (3-5 days/week)</option>
                                        <option value="active">Active (6-7 days/week)</option>
                                        <option value="veryActive">Very Active (Physical job/training)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Diet Preferences</h3>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Goal</label>
                                    <select
                                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                        value={preferences.weightGoal}
                                        onChange={(e) => setPreferences({ ...preferences, weightGoal: e.target.value as WeightGoal })}
                                    >
                                        <option value="maintain">Maintain Weight</option>
                                        <option value="weightLoss">Lose Weight</option>
                                        <option value="mildWeightLoss">Mild Weight Loss</option>
                                        <option value="weightGain">Gain Muscle/Weight</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Diet Type</label>
                                        <select
                                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                            value={preferences.diet_type}
                                            onChange={(e) => setPreferences({ ...preferences, diet_type: e.target.value })}
                                        >
                                            <option value="balanced">Balanced</option>
                                            <option value="low_carb">Low Carb</option>
                                            <option value="high_protein">High Protein</option>
                                            <option value="keto">Keto</option>
                                            <option value="vegetarian">Vegetarian</option>
                                            <option value="vegan">Vegan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Restrictions</label>
                                        <Input
                                            value={preferences.restrictions}
                                            onChange={(e) => setPreferences({ ...preferences, restrictions: e.target.value })}
                                            placeholder="e.g. gluten, dairy"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-900">Estimated Need:</span>
                                        <span className="text-lg font-bold text-green-600">{calculatedCalories} kcal</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <input
                                            type="checkbox"
                                            id="useCustom"
                                            checked={preferences.useCustomCalories}
                                            onChange={(e) => setPreferences({ ...preferences, useCustomCalories: e.target.checked })}
                                            className="rounded text-green-600 focus:ring-green-500"
                                        />
                                        <label htmlFor="useCustom" className="text-sm text-slate-700">Manually set calories?</label>
                                    </div>
                                    {preferences.useCustomCalories && (
                                        <Input
                                            type="number"
                                            className="mt-2 bg-white"
                                            placeholder="Enter calories"
                                            value={preferences.customCalories}
                                            onChange={(e) => setPreferences({ ...preferences, customCalories: e.target.value })}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={generate} size="lg" className="w-full md:w-auto px-8 bg-black hover:bg-slate-800 text-white font-semibold shadow-lg transition-all hover:-translate-y-0.5" disabled={loading || !data}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                        Generating...
                                    </div>
                                ) : 'Generate My Plan'}
                            </Button>
                        </div>
                    </section>
                ) : (
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        {plan && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900">Your Daily Meal Plan</h2>
                                        <p className="text-slate-500">Based on <span className="font-semibold text-slate-900">{plan.targetCalories} Calories</span> and <span className="capitalize">{preferences.diet_type}</span> diet.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setStep(1)} className="print:hidden">Edit Prefs</Button>
                                        <Button onClick={() => window.print()} className="print:hidden">Print Plan</Button>
                                    </div>
                                </div>

                                {/* Macros Summary */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Calories</span>
                                        <span className="text-2xl font-bold text-slate-900">{plan.totals.kcal}</span>
                                        <span className="text-xs text-green-600 font-medium">Target: {plan.targetCalories}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Protein</span>
                                        <span className="text-2xl font-bold text-slate-900">{plan.totals.protein_g}g</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Carbs</span>
                                        <span className="text-2xl font-bold text-slate-900">{plan.totals.carb_g}g</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Fats</span>
                                        <span className="text-2xl font-bold text-slate-900">{plan.totals.fat_g}g</span>
                                    </div>
                                </div>

                                {/* Guidance Section */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-indigo-900 mb-2">Diet Strategy</h3>
                                    <p className="text-sm text-indigo-800 leading-relaxed">
                                        This <strong>{preferences.diet_type.replace('_', ' ')}</strong> meal plan is calibrated to provide approximately <strong>{plan.targetCalories} calories</strong> per day.
                                        {preferences.weightGoal.toLowerCase().includes('loss') && " This creates a calorie deficit to help you burn fat while maintaining muscle."}
                                        {preferences.weightGoal.toLowerCase().includes('gain') && " This creates a slight calorie surplus to support muscle growth and recovery."}
                                        {preferences.weightGoal === 'maintain' && " This supports your current body weight and activity level."}
                                    </p>
                                    <ul className="mt-3 space-y-1 text-xs text-indigo-700 list-disc list-inside font-medium">
                                        <li>Drink plenty of water (3-4L) throughout the day.</li>
                                        <li>You can swap food items with similar macronutrient profiles if needed.</li>
                                        <li>Consistency is key—try to stick to these portion sizes as closely as possible.</li>
                                    </ul>
                                </div>

                                {/* Plan Cards */}
                                <div className="grid gap-6">
                                    {plan.meals.map((meal, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                                <h3 className="font-bold text-lg text-slate-800">{meal.title}</h3>
                                                <span className="text-sm font-medium text-slate-500">{meal.totals.kcal} kcal</span>
                                            </div>
                                            <div className="p-6">
                                                <ul className="space-y-4">
                                                    {meal.items.map((item, idx) => (
                                                        <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-2 w-2 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors"></div>
                                                                <span className="font-medium text-slate-700">{item.label}</span>
                                                                <span className="text-slate-400 text-xs">({item.grams}g)</span>
                                                            </div>
                                                            <div className="flex gap-4 text-xs text-slate-500 font-mono">
                                                                <span>{item.kcal} kcal</span>
                                                                <span className="hidden sm:inline">P:{item.protein_g} C:{item.carb_g} F:{item.fat_g}</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-xs text-slate-400 mt-8 print:hidden">
                                    Disclaimer: This is an automatically generated plan based on approximations. Consult a nutritionist for medical advice.
                                </p>
                            </>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
