'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DietData = {
  diet_types: { id: string; label: string; macro_split_pct: { carb: number[]; protein: number[]; fat: number[] } }[];
  goals: { id: string; label: string; calorie_adjust_pct: number }[];
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
  goal: string;
  diet_type: string;
  calories: string;
  restrictions: string;
}

interface MealOut {
  title: string;
  items: { label: string; grams: number; kcal: number; carb_g: number; protein_g: number; fat_g: number }[];
  totals: { kcal: number; carb_g: number; protein_g: number; fat_g: number };
}

interface PlanOut {
  meals: MealOut[];
  totals: { kcal: number; carb_g: number; protein_g: number; fat_g: number };
}

const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

export default function DietGeneratorPage() {
  const [data, setData] = useState<DietData | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    goal: 'weight_loss',
    diet_type: 'balanced',
    calories: '',
    restrictions: ''
  });
  const [plan, setPlan] = useState<PlanOut | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/data/diets.json', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    })();
  }, []);

  const target = useMemo(() => {
    if (!data) return null;
    const base = Number(preferences.calories || 0);
    if (!base) return null;
    const g = data.goals.find(x => x.id === preferences.goal);
    const dt = data.diet_types.find(x => x.id === preferences.diet_type);
    if (!g || !dt) return null;

    const adjCal = Math.round(base * (1 + g.calorie_adjust_pct / 100));
    const pct = {
      carb: (dt.macro_split_pct.carb[0] + dt.macro_split_pct.carb[1]) / 2,
      protein: (dt.macro_split_pct.protein[0] + dt.macro_split_pct.protein[1]) / 2,
      fat: (dt.macro_split_pct.fat[0] + dt.macro_split_pct.fat[1]) / 2
    };
    const kcalFrom = {
      carb: (pct.carb / 100) * adjCal,
      protein: (pct.protein / 100) * adjCal,
      fat: (pct.fat / 100) * adjCal
    };
    const grams = {
      carb_g: Math.round(kcalFrom.carb / 4),
      protein_g: Math.round(kcalFrom.protein / 4),
      fat_g: Math.round(kcalFrom.fat / 9)
    };
    return { adjCal, pct, grams };
  }, [data, preferences]);

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
    const carbs =
      preferences.diet_type === 'keto'
        ? pool.filter(f => f.category === 'vegetables' && f.per_100g.carb_g <= 5)
        : pool.filter(f => f.category === 'grains' || f.category === 'fruits' || f.category === 'legumes');
    const fats = pool.filter(f => f.category === 'fats_oils' || f.category === 'nuts_seeds');

    const items: MealOut['items'] = [];
    let kcalLeft = kcalTarget;

    if (proteins.length) {
      const p = proteins.sort((a, b) => b.per_100g.protein_g - a.per_100g.protein_g)[0];
      const s = pickServing(p, 'protein_g', macroTargets.protein_g, kcalLeft);
      if (s) {
        items.push(s);
        kcalLeft = Math.max(0, kcalLeft - s.kcal);
      }
    }
    if (carbs.length && preferences.diet_type !== 'keto') {
      const c = carbs.sort((a, b) => b.per_100g.carb_g - a.per_100g.carb_g)[0];
      const s = pickServing(c, 'carb_g', macroTargets.carb_g, kcalLeft);
      if (s) {
        items.push(s);
        kcalLeft = Math.max(0, kcalLeft - s.kcal);
      }
    }
    if (preferences.diet_type === 'keto' && carbs.length) {
      const c = carbs.sort((a, b) => a.per_100g.carb_g - b.per_100g.carb_g)[0];
      const s = pickServing(c, 'carb_g', Math.min(macroTargets.carb_g, 10), kcalLeft);
      if (s) {
        items.push(s);
        kcalLeft = Math.max(0, kcalLeft - s.kcal);
      }
    }
    if (fats.length && kcalLeft > 30) {
      const f = fats.sort((a, b) => b.per_100g.fat_g - a.per_100g.fat_g)[0];
      const s = pickServing(f, 'fat_g', macroTargets.fat_g, kcalLeft);
      if (s) {
        items.push(s);
        kcalLeft = Math.max(0, kcalLeft - s.kcal);
      }
    }

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
    if (!data || !target) return;
    setLoading(true);
    const foods = allowedFoods();

    const splits = data.meal_split_pct;
    const mealKcals = {
      breakfast: Math.round((splits.breakfast / 100) * target.adjCal),
      lunch: Math.round((splits.lunch / 100) * target.adjCal),
      snacks: Math.round((splits.snacks / 100) * target.adjCal),
      dinner: Math.round((splits.dinner / 100) * target.adjCal)
    };
    const mealMacros = (k: keyof typeof mealKcals) => ({
      carb_g: Math.round((mealKcals[k] * (target.pct.carb / 100)) / 4),
      protein_g: Math.round((mealKcals[k] * (target.pct.protein / 100)) / 4),
      fat_g: Math.round((mealKcals[k] * (target.pct.fat / 100)) / 9)
    });

    const meals: MealOut[] = [];
    meals.push(buildMeal('Breakfast', mealKcals.breakfast, mealMacros('breakfast'), foods));
    meals.push(buildMeal('Lunch', mealKcals.lunch, mealMacros('lunch'), foods));
    meals.push(buildMeal('Snacks', mealKcals.snacks, mealMacros('snacks'), foods));
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
      meals,
      totals: {
        kcal: totals.kcal,
        carb_g: totals.carb_g,
        protein_g: totals.protein_g,
        fat_g: totals.fat_g
      }
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-3xl font-extrabold tracking-tight">Diet Generator</h1>
          <p className="text-gray-600">Plans computed from AMDR or keto splits and USDA-style composition per 100 g.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Your Preferences</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Goal</label>
              <select
                value={preferences.goal}
                onChange={(e) => setPreferences({ ...preferences, goal: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="maintain">Maintain Weight</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="muscle_gain">Muscle Gain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Diet Type</label>
              <select
                value={preferences.diet_type}
                onChange={(e) => setPreferences({ ...preferences, diet_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="balanced">Balanced</option>
                <option value="low_carb">Low Carb</option>
                <option value="high_protein">High Protein</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Ketogenic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Calories (per day)</label>
              <Input
                type="number"
                placeholder="e.g., 1800"
                value={preferences.calories}
                onChange={(e) => setPreferences({ ...preferences, calories: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Required for macro and servings sizing.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dietary Restrictions (comma separated)</label>
              <Input
                placeholder="e.g., nuts, dairy, gluten, soy, fish"
                value={preferences.restrictions}
                onChange={(e) => setPreferences({ ...preferences, restrictions: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Filters allergens and keywords.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={generate} disabled={loading || !data || !preferences.calories}>
              {loading ? 'Generating...' : 'Generate Diet Plan'}
            </Button>
            <Button variant="outline" onClick={() => setPlan(null)}>Clear</Button>
          </div>
        </section>

        {target && (
          <section className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-3">Targets</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded bg-emerald-50">
                <div className="text-emerald-700 font-semibold">Adjusted Calories</div>
                <div className="text-2xl font-bold">{target.adjCal}</div>
              </div>
              <div className="p-3 rounded bg-sky-50">
                <div className="text-sky-700 font-semibold">Macro Split (%)</div>
                <div>{target.pct.carb.toFixed(0)}% C / {target.pct.protein.toFixed(0)}% P / {target.pct.fat.toFixed(0)}% F</div>
              </div>
              <div className="p-3 rounded bg-fuchsia-50">
                <div className="text-fuchsia-700 font-semibold">Grams Target</div>
                <div>{target.grams.carb_g} g C / {target.grams.protein_g} g P / {target.grams.fat_g} g F</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">AMDR ranges underpin balanced macro splits; keto uses standard 5–10% carbs, 15–20% protein, 70–80% fat conventions.</p>
          </section>
        )}

        {plan && (
          <section className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="text-xl font-semibold">Your One-Day Meal Plan</h2>

            <div className="space-y-5">
              {plan.meals.map((m, i) => (
                <div key={i} className="rounded border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{m.title}</h3>
                    <div className="text-sm text-gray-700">
                      {m.totals.kcal} kcal • {m.totals.carb_g} g C • {m.totals.protein_g} g P • {m.totals.fat_g} g F
                    </div>
                  </div>
                  <ul className="mt-2 list-disc ml-6 text-sm space-y-1">
                    {m.items.map((it, j) => (
                      <li key={j}>
                        {it.label} — {it.grams} g ({it.kcal} kcal; {it.carb_g} g C, {it.protein_g} g P, {it.fat_g} g F)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-4 rounded bg-primary/10 border-l-4 border-primary">
              <div className="font-medium">Approximate Totals</div>
              <div className="text-sm">
                {plan.totals.kcal} kcal • {plan.totals.carb_g} g C • {plan.totals.protein_g} g P • {plan.totals.fat_g} g F
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Food composition values are approximations per 100 g from a USDA-style dataset; for higher precision, attach exact FoodData Central IDs and compute from those entries. 
            </div>
          </section>
        )}

        {!plan && (
          <section className="text-sm text-gray-600">
            Enter calories, choose diet type and goal, then generate a plan based on macro targets and per-meal splits.
          </section>
        )}
      </main>
    </div>
  );
}
