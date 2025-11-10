'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  healthyRange: string;
  idealWeightMin: number;
  idealWeightMax: number;
  bmiPrime: number;
  ponderalIndex: number;
}

const categoryColors: Record<BMIResult['category'], string> = {
  Underweight: 'text-yellow-600',
  Normal: 'text-green-600',
  Overweight: 'text-orange-600',
  Obese: 'text-red-600',
};

export default function BMICalculator() {
  const [unit, setUnit] = useState<'us' | 'metric'>('metric');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // US inputs
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [pounds, setPounds] = useState<string>('');

  // Metric inputs
  const [cm, setCm] = useState<string>('');
  const [kg, setKg] = useState<string>('');

  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState<string>('');

  const parseNumber = (val: string): number => {
    const num = Number.parseFloat(val);
    return Number.isNaN(num) ? 0 : num;
  };

  const calcMarkerLeft = useMemo(() => {
    if (!result) return 0;
    // Scale 10–40 for visualization; clamp within.
    const min = 10;
    const max = 40;
    const v = Math.min(max, Math.max(min, result.bmi));
    return ((v - min) / (max - min)) * 100;
  }, [result]);

  const calculateBMI = () => {
    setError('');

    const ageNum = parseNumber(age);
    if (ageNum < 2 || ageNum > 120) {
      setError('Please enter an age between 2 and 120.');
      return;
    }

    let heightMeters = 0;
    let weightKg = 0;

    if (unit === 'us') {
      const totalInches = parseNumber(feet) * 12 + parseNumber(inches);
      heightMeters = totalInches * 0.0254;
      weightKg = parseNumber(pounds) * 0.45359237;
    } else {
      heightMeters = parseNumber(cm) / 100;
      weightKg = parseNumber(kg);
    }

    if (heightMeters <= 0) {
      setError('Please enter a valid height.');
      return;
    }
    if (weightKg <= 0) {
      setError('Please enter a valid weight.');
      return;
    }

    const bmiRaw = weightKg / (heightMeters * heightMeters);
    const bmi = Math.round(bmiRaw * 10) / 10;

    let category: BMIResult['category'] = 'Underweight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    const healthyRange = '18.5 - 25';

    const idealWeightMin = unit === 'us'
      ? Math.round(18.5 * heightMeters * heightMeters * 2.20462 * 10) / 10
      : Math.round(18.5 * heightMeters * heightMeters * 10) / 10;

    const idealWeightMax = unit === 'us'
      ? Math.round(25 * heightMeters * heightMeters * 2.20462 * 10) / 10
      : Math.round(25 * heightMeters * heightMeters * 10) / 10;

    const bmiPrime = Math.round((bmiRaw / 25) * 100) / 100;
    const ponderalIndex = Math.round((weightKg / (heightMeters ** 3)) * 10) / 10;

    setResult({
      bmi,
      category,
      healthyRange,
      idealWeightMin,
      idealWeightMax,
      bmiPrime,
      ponderalIndex,
    });
  };

  const reset = () => {
    setAge('');
    setGender('male');
    setFeet('');
    setInches('');
    setPounds('');
    setCm('');
    setKg('');
    setResult(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-blue-50 to-white">
      <header className="mx-auto max-w-6xl px-4 pt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          BMI Calculator
        </h1>
        <p className="mt-3 max-w-3xl text-gray-700">
          Calculate Body Mass Index (BMI) using metric or US units, see the healthy range, ideal weight, and additional indices like BMI Prime and Ponderal Index.
        </p>
      </header>

      {/* Tool + Results */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Tool */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Enter details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adults only. For children/teens, consult pediatric BMI charts.
            </p>

            <hr className="my-6 border-gray-200" />

            {/* Unit Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setUnit('metric'); setFeet(''); setInches(''); setPounds(''); setResult(null); }}
                className={`px-4 py-2 rounded-md text-sm font-medium border ${unit === 'metric' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                aria-pressed={unit === 'metric'}
              >
                Metric (cm, kg)
              </button>
              <button
                type="button"
                onClick={() => { setUnit('us'); setCm(''); setKg(''); setResult(null); }}
                className={`px-4 py-2 rounded-md text-sm font-medium border ${unit === 'us' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                aria-pressed={unit === 'us'}
              >
                US (ft/in, lbs)
              </button>
            </div>

            {/* Form */}
            <form
              className="mt-6 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                calculateBMI();
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="age">
                  Age (2–120)
                </label>
                <Input
                  id="age"
                  type="number"
                  min={2}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  required
                />
              </div>

              <fieldset className="border border-gray-200 rounded-lg p-4">
                <legend className="px-1 text-sm font-medium text-gray-800">Gender</legend>
                <div className="mt-1 flex items-center gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-800">Male</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-800">Female</span>
                  </label>
                </div>
              </fieldset>

              {unit === 'metric' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="height-cm">
                      Height (cm)
                    </label>
                    <Input
                      id="height-cm"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={cm}
                      onChange={(e) => setCm(e.target.value)}
                      placeholder="e.g. 172"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="weight-kg">
                      Weight (kg)
                    </label>
                    <Input
                      id="weight-kg"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={kg}
                      onChange={(e) => setKg(e.target.value)}
                      placeholder="e.g. 68.5"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="height-ft">
                      Height (ft)
                    </label>
                    <Input
                      id="height-ft"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="e.g. 5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="height-in">
                      Height (in)
                    </label>
                    <Input
                      id="height-in"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={11}
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="e.g. 10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1" htmlFor="weight-lbs">
                      Weight (lbs)
                    </label>
                    <Input
                      id="weight-lbs"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={pounds}
                      onChange={(e) => setPounds(e.target.value)}
                      placeholder="e.g. 150"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" className="px-6">
                  Calculate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  className="px-6"
                >
                  Reset
                </Button>
              </div>
            </form>

            {/* Visual scale */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">BMI scale (10–40)</h3>
              <div className="relative">
                <div className="flex h-3 w-full overflow-hidden rounded-full ring-1 ring-gray-200">
                  <div style={{ width: '28.3%' }} className="bg-yellow-400" aria-hidden />
                  <div style={{ width: '21.7%' }} className="bg-green-500" aria-hidden />
                  <div style={{ width: '16.7%' }} className="bg-orange-400" aria-hidden />
                  <div style={{ width: '33.3%' }} className="bg-red-500" aria-hidden />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-gray-600">
                  <span>10</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
                {result && (
                  <div
                    className="absolute -top-1.5"
                    style={{ left: `calc(${calcMarkerLeft}% - 6px)` }}
                    aria-label={`Your BMI marker at ${result.bmi}`}
                    role="img"
                  >
                    <div className="h-6 w-0.5 bg-gray-900 mx-auto" />
                    <div className="mt-1 text-[11px] text-gray-800 text-center font-medium">{result.bmi}</div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-yellow-400 rounded-sm" />Underweight</span>
                <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-green-500 rounded-sm" />Normal</span>
                <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-orange-400 rounded-sm" />Overweight</span>
                <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-red-500 rounded-sm" />Obese</span>
              </div>
            </div>
          </div>

          {/* Right: Results + Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              Numbers update after calculation; values are estimates for planning.
            </p>

            <hr className="my-6 border-gray-200" />

            {!result ? (
              <p className="text-gray-700">
                Enter height and weight, then select Calculate to see BMI, category, ideal weight range, and additional indices.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="text-5xl font-extrabold text-gray-900">{result.bmi}</div>
                <div className={`text-2xl font-semibold ${categoryColors[result.category]}`}>
                  {result.category}
                </div>
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <dt className="text-sm text-gray-600">Healthy BMI range</dt>
                    <dd className="text-base font-medium text-gray-900">{result.healthyRange} kg/m²</dd>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <dt className="text-sm text-gray-600">Ideal weight</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {result.idealWeightMin} – {result.idealWeightMax} {unit === 'us' ? 'lbs' : 'kg'}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <dt className="text-sm text-gray-600">BMI Prime</dt>
                    <dd className="text-base font-medium text-gray-900">{result.bmiPrime}</dd>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <dt className="text-sm text-gray-600">Ponderal Index</dt>
                    <dd className="text-base font-medium text-gray-900">{result.ponderalIndex}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="mx-auto max-w-6xl px-4 mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900">What BMI indicates</h3>
            <p className="mt-3 text-gray-700">
              BMI compares weight to height to estimate whether body mass is in a range broadly associated with lower health risk. It does not directly measure body fat or account for muscle mass, bone density, or fat distribution.
            </p>
            <h4 className="mt-6 text-xl font-semibold text-gray-900">Categories</h4>
            <ul className="mt-2 list-disc list-inside text-gray-700 space-y-2">
              <li><span className="font-medium">Underweight:</span> potential nutrient deficiency or other concerns.</li>
              <li><span className="font-medium">Normal:</span> generally associated with lower chronic disease risk.</li>
              <li><span className="font-medium">Overweight:</span> higher risk of metabolic and cardiovascular conditions.</li>
              <li><span className="font-medium">Obese:</span> substantially increased risk; medical guidance recommended.</li>
            </ul>
            <h4 className="mt-6 text-xl font-semibold text-gray-900">Beyond BMI</h4>
            <p className="mt-2 text-gray-700">
              Use BMI alongside waist circumference, activity levels, and clinical measures. BMI Prime contextualizes BMI relative to the upper healthy threshold, while the Ponderal Index considers height cubed to better reflect proportionality in taller or shorter individuals.
            </p>
          </article>

          <aside className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Tips</h3>
            <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
              <li>Measure height and weight carefully; small input errors shift BMI meaningfully.</li>
              <li>Recalculate after major changes in weight or training programs.</li>
              <li>Discuss results with a healthcare professional for personalized context.</li>
            </ul>
            <h3 className="mt-8 text-xl font-bold text-gray-900">FAQ</h3>
            <p className="mt-2 text-sm text-gray-700">
              BMI is for adults. For athletes or those with high muscle mass, body fat measures and professional assessment provide better insight.
            </p>
          </aside>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 my-14">
        <hr className="border-gray-200" />
      </footer>
    </main>
  );
}
