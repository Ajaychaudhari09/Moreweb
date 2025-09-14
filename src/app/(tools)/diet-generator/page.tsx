"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define meal plan structure
interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  total_calories: number;
}

// Define user preferences structure
interface Preferences {
  goal: string;
  diet_type: string;
  calories: string;
  restrictions: string;
}

export default function DietGeneratorPage() {
  const [preferences, setPreferences] = useState<Preferences>({
    goal: "weight_loss",
    diet_type: "balanced",
    calories: "",
    restrictions: "",
  });

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const generateDiet = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const samplePlan: MealPlan = {
        breakfast: "Oatmeal with berries and nuts (350 calories)",
        lunch: "Grilled chicken salad with quinoa (450 calories)",
        dinner: "Baked salmon with vegetables (400 calories)",
        snacks: "Greek yogurt and almonds (200 calories)",
        total_calories: 1400,
      };

      setMealPlan(samplePlan);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Diet Generator</h1>
          <p className="text-muted-foreground">
            Generate personalized meal plans based on your goals and preferences
          </p>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goal */}
            <div>
              <label className="block text-sm font-medium mb-2">Goal</label>
              <select
                value={preferences.goal}
                onChange={(e) =>
                  setPreferences({ ...preferences, goal: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="maintain">Maintain Weight</option>
                <option value="muscle_gain">Muscle Gain</option>
              </select>
            </div>

            {/* Diet Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Diet Type</label>
              <select
                value={preferences.diet_type}
                onChange={(e) =>
                  setPreferences({ ...preferences, diet_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="balanced">Balanced</option>
                <option value="low_carb">Low Carb</option>
                <option value="high_protein">High Protein</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Ketogenic</option>
              </select>
            </div>

            {/* Calories */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Calories (per day)
              </label>
              <Input
                type="number"
                placeholder="e.g., 1500"
                value={preferences.calories}
                onChange={(e) =>
                  setPreferences({ ...preferences, calories: e.target.value })
                }
              />
            </div>

            {/* Restrictions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Dietary Restrictions
              </label>
              <Input
                placeholder="e.g., nuts, dairy, gluten"
                value={preferences.restrictions}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    restrictions: e.target.value,
                  })
                }
              />
            </div>

            {/* Generate Button */}
            <Button onClick={generateDiet} className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Diet Plan"}
            </Button>

            {/* Meal Plan Result */}
            {mealPlan && (
              <div className="mt-8 p-6 bg-muted rounded-lg animate-bounce-in">
                <h3 className="text-lg font-semibold mb-4">
                  Your Daily Meal Plan
                </h3>

                <div className="space-y-4">
                  <div className="p-3 bg-background rounded">
                    <h4 className="font-medium text-orange-500">🌅 Breakfast</h4>
                    <p className="text-sm">{mealPlan.breakfast}</p>
                  </div>

                  <div className="p-3 bg-background rounded">
                    <h4 className="font-medium text-yellow-500">☀️ Lunch</h4>
                    <p className="text-sm">{mealPlan.lunch}</p>
                  </div>

                  <div className="p-3 bg-background rounded">
                    <h4 className="font-medium text-purple-500">🌙 Dinner</h4>
                    <p className="text-sm">{mealPlan.dinner}</p>
                  </div>

                  <div className="p-3 bg-background rounded">
                    <h4 className="font-medium text-green-500">🥨 Snacks</h4>
                    <p className="text-sm">{mealPlan.snacks}</p>
                  </div>

                  <div className="p-3 bg-primary/10 rounded border-l-4 border-primary">
                    <h4 className="font-medium">📊 Total Daily Calories</h4>
                    <p className="text-lg font-bold">
                      {mealPlan.total_calories} calories
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
