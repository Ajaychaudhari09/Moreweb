// src/lib/utils.ts

/**
 * -------------------------------------------------------------
 * ✅ UTILITY: cn()
 * Tailwind className merge helper (simple version)
 * -------------------------------------------------------------
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(" ");
}

import type { BlogCategory } from "@/types";

/**
 * -------------------------------------------------------------
 * ✅ UTILITY: round2()
 * Rounds a number to 2 decimal places
 * -------------------------------------------------------------
 */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * ---------------------------------------------------------
 * ✅ CATEGORY NORMALIZER
 * ----------------------------------------------------------
 */
export function normalizeCategory(cat: string | undefined): BlogCategory | null {
  if (!cat) return null;
  const lc = cat.trim().toLowerCase();

  const MAP: Record<string, BlogCategory> = {
    ai: "AI",
    coding: "coding",
    drama: "drama",
    film: "film",
    general: "general",
    shopping: "shopping",
    health: "health",
    news: "news",
  };

  return MAP[lc] ?? null;
}

/* ============================================================================
   ✅ EMI CALCULATOR
   Reducing-Balance EMI + Full Amortization Schedule  
   EMI Formula:
     EMI = P * r * (1 + r)^N / ((1 + r)^N - 1)
     r = monthly interest rate = annual / (12 * 100)
     N = months = years * 12
============================================================================ */

import type { EMIResult, EMIScheduleItem, CalorieResult } from "@/types";

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): EMIResult | null {
  // ✅ Guard invalid inputs
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(tenureYears)
  )
    return null;

  if (principal <= 0 || annualRate < 0 || tenureYears <= 0) return null;

  const months = Math.round(tenureYears * 12);
  const r = annualRate / 12 / 100;

  // ✅ EMI Formula (with zero-interest support)
  const emi =
    r > 0
      ? (principal * r * Math.pow(1 + r, months)) /
      (Math.pow(1 + r, months) - 1)
      : principal / months;

  const schedule: EMIScheduleItem[] = [];

  let balance = principal;
  let totalPaid = 0;

  for (let m = 1; m <= months; m++) {
    const interest = r > 0 ? balance * r : 0;
    let principalPay = emi - interest;

    if (principalPay > balance) principalPay = balance;

    const payment = principalPay + interest;

    balance = Math.max(0, balance - principalPay);
    totalPaid += payment;

    schedule.push({
      month: m,
      payment: round2(payment),
      principal: round2(principalPay),
      interest: round2(interest),
      balance: round2(balance),
    });

    if (balance <= 0.01) break;
  }

  return {
    monthlyEMI: round2(emi),
    totalAmount: round2(totalPaid),
    totalInterest: round2(totalPaid - principal),
    schedule,
  };
}

/* ============================================================================
   ✅ CALORIE CALCULATOR (Mifflin–St Jeor Formula)
   - Uses BMR + Activity multipliers to compute TDEE
   - Goal-based daily calories
   - Macro breakdown (protein/fat/carbs)
============================================================================ */

export function calculateCalories(
  age: number,
  weight: number,
  height: number,
  gender: "male" | "female",
  activityLevel:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "veryActive",
  goal:
    | "maintain"
    | "mildWeightLoss"
    | "weightLoss"
    | "extremeWeightLoss"
    | "mildWeightGain"
    | "weightGain"
    | "extremeWeightGain"
): CalorieResult {
  // ✅ BMR
  const bmr =
    gender === "male"
      ? Math.round(10 * weight + 6.25 * height - 5 * age + 5)
      : Math.round(10 * weight + 6.25 * height - 5 * age - 161);

  // ✅ Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  } as const;

  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

  // ✅ Goal adjustments
  const goalAdjustments = {
    maintain: 0,
    mildWeightLoss: -250,
    weightLoss: -500,
    extremeWeightLoss: -1000,
    mildWeightGain: 250,
    weightGain: 500,
    extremeWeightGain: 1000,
  } as const;

  const goalCalories = tdee + goalAdjustments[goal];

  // ✅ Macronutrient breakdown
  const macros = {
    protein: {
      min: Math.round((goalCalories * 0.2) / 4),
      max: Math.round((goalCalories * 0.3) / 4),
    },
    fat: {
      min: Math.round((goalCalories * 0.2) / 9),
      max: Math.round((goalCalories * 0.3) / 9),
    },
    carbs: {
      min: Math.round((goalCalories * 0.4) / 4),
      max: Math.round((goalCalories * 0.6) / 4),
    },
  };

  return {
    bmr,
    tdee,
    sedentary: Math.round(bmr * 1.2),
    light: Math.round(bmr * 1.375),
    moderate: Math.round(bmr * 1.55),
    active: Math.round(bmr * 1.725),
    veryActive: Math.round(bmr * 1.9),

    goals: {
      maintain: tdee,
      mildWeightLoss: tdee - 250,
      weightLoss: tdee - 500,
      extremeWeightLoss: tdee - 1000,
      mildWeightGain: tdee + 250,
      weightGain: tdee + 500,
      extremeWeightGain: tdee + 1000,
    },

    macros,
  };
}
