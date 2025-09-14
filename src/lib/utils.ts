// src/lib/utils.ts
import type { EMIResult, EMIScheduleItem, CalorieResult } from '@/types';

export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Reducing-balance EMI with full amortization schedule.
 * EMI = P * r * (1 + r)^N / ((1 + r)^N - 1), r = annualRate/12/100, N = years*12. [3][2]
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): EMIResult | null {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(tenureYears)) return null; // guard invalid inputs [3]
  if (principal <= 0 || annualRate < 0 || tenureYears <= 0) return null; // guard domain [3]

  const months = Math.round(tenureYears * 12);
  const r = annualRate / 12 / 100;

  const emi =
    r > 0
      ? (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
      : principal / months; // zero-rate fallback [3][2]

  const schedule: EMIScheduleItem[] = [];
  let balance = principal;
  let totalPaid = 0;

  for (let m = 1; m <= months; m += 1) {
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

  const totalAmount = totalPaid;
  const totalInterest = totalAmount - principal;

  return {
    monthlyEMI: round2(emi),
    totalAmount: round2(totalAmount),
    totalInterest: round2(totalInterest),
    schedule,
  };
}

/**
 * Calorie calculator (Mifflin–St Jeor) with activity multipliers & goals. [5][6]
 */
export function calculateCalories(
  age: number,
  weight: number,
  height: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive',
  goal:
    | 'maintain'
    | 'mildWeightLoss'
    | 'weightLoss'
    | 'extremeWeightLoss'
    | 'mildWeightGain'
    | 'weightGain'
    | 'extremeWeightGain'
): CalorieResult {
  const bmr =
    gender === 'male'
      ? Math.round(10 * weight + 6.25 * height - 5 * age + 5)
      : Math.round(10 * weight + 6.25 * height - 5 * age - 161); // Mifflin–St Jeor [5][6]

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  } as const;
  const tdee = Math.round(bmr * activityMultipliers[activityLevel]); // TDEE = BMR * activity [5]

  const goalAdjustments = {
    maintain: 0,
    mildWeightLoss: -250,
    weightLoss: -500,
    extremeWeightLoss: -1000,
    mildWeightGain: 250,
    weightGain: 500,
    extremeWeightGain: 1000,
  } as const;
  const goalCalories = tdee + goalAdjustments[goal]; // goal daily calories [5]

  const macros = {
    protein: { min: Math.round((goalCalories * 0.2) / 4), max: Math.round((goalCalories * 0.3) / 4) },
    fat: { min: Math.round((goalCalories * 0.2) / 9), max: Math.round((goalCalories * 0.3) / 9) },
    carbs: { min: Math.round((goalCalories * 0.4) / 4), max: Math.round((goalCalories * 0.6) / 4) },
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
