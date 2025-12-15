"use client";

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';

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
    Underweight: 'text-yellow-500',
    Normal: 'text-emerald-500',
    Overweight: 'text-orange-500',
    Obese: 'text-red-500',
};

type Unit = 'us' | 'metric';
type Gender = 'male' | 'female';

const parseNumber = (val: string): number => {
    const num = Number.parseFloat(val);
    return Number.isNaN(num) ? 0 : num;
};

function buildHealthInsight(
    result: BMIResult,
    ageStr: string,
    gender: Gender
) {
    const age = parseNumber(ageStr);
    const ageLabel =
        age > 0 ? (age < 30 ? 'younger adult' : age < 50 ? 'adult' : 'older adult') : 'adult';
    const genderLabel = gender === 'male' ? 'male' : 'female';

    switch (result.category) {
        case 'Underweight':
            return {
                headline: 'You are currently in the underweight range.',
                summary:
                    'A lower BMI can sometimes reflect a naturally smaller build, but it may also be associated with low energy availability, nutrient deficiencies, or underlying medical conditions.',
                bullets: [
                    'Consider a nutrition plan that gradually increases calories with balanced carbohydrates, proteins, and healthy fats.',
                    'Focus on strength-training to build lean muscle, especially as a ' +
                    ageLabel +
                    ' ' +
                    genderLabel +
                    '.',
                    'If you notice fatigue, hair loss, or frequent illness, speak with a healthcare professional.',
                ],
            };
        case 'Normal':
            return {
                headline: 'You are in the broadly healthy BMI range.',
                summary:
                    'Your BMI sits in a range generally associated with lower risk of many chronic conditions, especially when combined with regular activity, good sleep, and balanced nutrition.',
                bullets: [
                    'Maintain a consistent movement routine: a mix of resistance training and cardio is ideal.',
                    'Prioritise whole foods, lean protein, fibre, and adequate hydration to keep body composition favourable.',
                    'Recheck BMI every few months or after major changes to your training or lifestyle.',
                ],
            };
        case 'Overweight':
            return {
                headline: 'Your BMI is in the overweight range.',
                summary:
                    'In this range, long-term risk of conditions like type 2 diabetes and cardiovascular disease can begin to increase, especially with low activity levels or a family history of metabolic disease.',
                bullets: [
                    'Aim for slow, steady weight change rather than aggressive dieting (for most adults, 0.25–0.5 kg per week is a realistic target).',
                    'Increase daily movement (steps, light activity) in addition to structured exercise sessions.',
                    'Discuss screening for blood pressure, blood sugar, and cholesterol with your clinician, particularly if you have other risk factors.',
                ],
            };
        case 'Obese':
            return {
                headline: 'Your BMI is in the obese range.',
                summary:
                    'At this level, long-term health risks are significantly higher, but clinically supervised changes in nutrition, activity, and habits can meaningfully reduce risk at almost any stage.',
                bullets: [
                    'Work with a healthcare professional or registered dietitian to design a sustainable, personalised plan.',
                    'Start with low-impact activities (such as walking or cycling) and build intensity gradually to protect joints.',
                    'Ask your clinician whether additional assessments (blood tests, sleep apnoea screening, blood pressure monitoring) are appropriate.',
                ],
            };
        default:
            return {
                headline: '',
                summary: '',
                bullets: [],
            };
    }
}

export default function BMICalculator() {
    const [unit, setUnit] = useState<Unit>('metric');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<Gender>('male');

    // US inputs
    const [feet, setFeet] = useState<string>('');
    const [inches, setInches] = useState<string>('');
    const [pounds, setPounds] = useState<string>('');

    // Metric inputs
    const [cm, setCm] = useState<string>('');
    const [kg, setKg] = useState<string>('');

    const [result, setResult] = useState<BMIResult | null>(null);
    const [error, setError] = useState<string>('');

    const [shareMessage, setShareMessage] = useState<string>('');
    const [pdfMessage, setPdfMessage] = useState<string>('');

    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    const calcMarkerLeft = useMemo(() => {
        if (!result) return 0;
        // Scale 10–40 for visualization; clamp within.
        const min = 10;
        const max = 40;
        const v = Math.min(max, Math.max(min, result.bmi));
        return ((v - min) / (max - min)) * 100;
    }, [result]);

    const healthInsight = useMemo(
        () => (result ? buildHealthInsight(result, age, gender) : null),
        [result, age, gender]
    );

    const calculateBMI = () => {
        setError('');

        const ageNum = parseNumber(age);
        if (ageNum < 2 || ageNum > 120) {
            setError('Please enter an age between 2 and 120.');
            setResult(null);
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
            setResult(null);
            return;
        }
        if (weightKg <= 0) {
            setError('Please enter a valid weight.');
            setResult(null);
            return;
        }

        setLoading(true);

        // Simulate calculation delay for better UX
        setTimeout(() => {
            const bmiRaw = weightKg / (heightMeters * heightMeters);
            const bmi = Math.round(bmiRaw * 10) / 10;

            let category: BMIResult['category'] = 'Underweight';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';

            const healthyRange = '18.5 - 25';

            const idealWeightMin =
                unit === 'us'
                    ? Math.round(18.5 * heightMeters * heightMeters * 2.20462 * 10) / 10
                    : Math.round(18.5 * heightMeters * heightMeters * 10) / 10;

            const idealWeightMax =
                unit === 'us'
                    ? Math.round(25 * heightMeters * heightMeters * 2.20462 * 10) / 10
                    : Math.round(25 * heightMeters * heightMeters * 10) / 10;

            const bmiPrime = Math.round((bmiRaw / 25) * 100) / 100;
            const ponderalIndex =
                Math.round((weightKg / heightMeters ** 3) * 10) / 10;

            setResult({
                bmi,
                category,
                healthyRange,
                idealWeightMin,
                idealWeightMax,
                bmiPrime,
                ponderalIndex,
            });
            setLoading(false);
            setStep(2);
        }, 800);
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
        setShareMessage('');
        setPdfMessage('');
    };

    const handleDownloadPDF = async () => {
        if (!result) return;

        try {
            const jsPDF = (await import('jspdf')).default;
            const doc = new jsPDF();

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('BMI Assessment Report', 14, 20);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);

            const heightText =
                unit === 'metric'
                    ? `${cm || '-'} cm`
                    : `${feet || '-'} ft ${inches || '0'} in`;
            const weightText =
                unit === 'metric'
                    ? `${kg || '-'} kg`
                    : `${pounds || '-'} lbs`;

            doc.text(`Age: ${age || '-'}`, 14, 32);
            doc.text(
                `Gender: ${gender === 'male' ? 'Male' : 'Female'}`,
                14,
                40
            );
            doc.text(`Height: ${heightText}`, 14, 48);
            doc.text(`Weight: ${weightText}`, 14, 56);

            doc.text(
                `BMI: ${result.bmi.toFixed(1)} (${result.category})`,
                14,
                68
            );
            doc.text(
                `Healthy range: ${result.healthyRange} kg/m²`,
                14,
                76
            );
            doc.text(
                `Ideal weight: ${result.idealWeightMin} – ${result.idealWeightMax} ${unit === 'us' ? 'lbs' : 'kg'
                }`,
                14,
                84
            );
            doc.text(`BMI Prime: ${result.bmiPrime}`, 14, 92);
            doc.text(`Ponderal Index: ${result.ponderalIndex}`, 14, 100);

            if (healthInsight?.summary) {
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text('Brief health insight', 14, 114);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);

                const split = doc.splitTextToSize(
                    healthInsight.summary,
                    180
                );
                doc.text(split, 14, 122);
            }

            doc.save('bmi-report.pdf');
            setPdfMessage('PDF report downloaded.');
        } catch {
            setPdfMessage('Unable to generate PDF. Please try again.');
        } finally {
            setTimeout(() => setPdfMessage(''), 4000);
        }
    };

    const handleCopyLink = async () => {
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);
        url.searchParams.set('unit', unit);
        if (age) url.searchParams.set('age', age);
        url.searchParams.set('gender', gender);
        if (unit === 'metric') {
            if (cm) url.searchParams.set('cm', cm);
            if (kg) url.searchParams.set('kg', kg);
        } else {
            if (feet) url.searchParams.set('feet', feet);
            if (inches) url.searchParams.set('inches', inches);
            if (pounds) url.searchParams.set('pounds', pounds);
        }
        if (result) {
            url.searchParams.set('bmi', String(result.bmi));
            url.searchParams.set('category', result.category);
        }

        const link = url.toString();

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(link);
                setShareMessage('Shareable link copied to clipboard.');
            } else {
                setShareMessage(link);
            }
        } catch {
            setShareMessage(link);
        } finally {
            setTimeout(() => setShareMessage(''), 6000);
        }
    };

    const handlePrint = () => {
        if (!result) return;
        if (typeof window === 'undefined') return;
        window.print();
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top banner + hero (Synthesia-style) */}
            <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 pt-16 pb-24 text-white">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                <div className="relative mx-auto max-w-6xl px-4">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl ring-1 ring-white/20">
                        <Scale className="h-8 w-8 text-indigo-200" />
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Calculate your BMI and turn it into a practical health plan.
                    </h1>
                    <p className="mt-3 max-w-2xl text-lg text-indigo-100 md:text-xl">
                        Switch between metric and US units, get your BMI, see a
                        healthy weight range, and read tailored guidance for your
                        category — all in one place.
                    </p>
                    <div className="mt-5 grid gap-4 text-xs sm:grid-cols-3">
                        <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                            <p className="text-[11px] uppercase tracking-wide text-indigo-200">
                                Typical time
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                                Under 30 seconds
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                            <p className="text-[11px] uppercase tracking-wide text-indigo-200">
                                Recommended for
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                                Adults aged 18–65
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                            <p className="text-[11px] uppercase tracking-wide text-indigo-200">
                                Outputs
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                                BMI, range, ideal weight, BMI Prime & Ponderal Index
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tool + Results */}
            <section className="mx-auto max-w-4xl px-4 pb-14 pt-4">
                {step === 1 && (
                    <div className="relative rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-xl shadow-slate-200/80 backdrop-blur-md md:p-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="absolute inset-x-12 -top-10 -z-10 h-20 rounded-[40px] bg-slate-200/50 blur-3xl" />

                        <h2 className="text-xl font-semibold text-slate-900">
                            Enter your details
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Adults only. For children and teenagers, healthcare providers
                            use age- and sex-specific BMI charts.
                        </p>

                        <hr className="my-6 border-slate-200" />

                        {/* Unit Toggle */}
                        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs font-medium">
                            <button
                                type="button"
                                onClick={() => {
                                    setUnit('metric');
                                    setFeet('');
                                    setInches('');
                                    setPounds('');
                                    setResult(null);
                                    setError('');
                                }}
                                className={`rounded-md px-3 py-1.5 transition ${unit === 'metric'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'bg-transparent text-slate-500 hover:bg-white/50'
                                    }`}
                                aria-pressed={unit === 'metric'}
                            >
                                Metric (cm, kg)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setUnit('us');
                                    setCm('');
                                    setKg('');
                                    setResult(null);
                                    setError('');
                                }}
                                className={`rounded-md px-3 py-1.5 transition ${unit === 'us'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'bg-transparent text-slate-500 hover:bg-white/50'
                                    }`}
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
                                <label
                                    className="mb-1 block text-sm font-medium text-slate-700"
                                    htmlFor="age"
                                >
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
                                    className="border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <fieldset className="rounded-lg border border-slate-200 bg-slate-100/50 p-4">
                                <legend className="px-1 text-sm font-medium text-slate-700">
                                    Gender
                                </legend>
                                <div className="mt-2 flex items-center gap-6">
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={gender === 'male'}
                                            onChange={() => setGender('male')}
                                            className="h-4 w-4"
                                        />
                                        <span>Male</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={gender === 'female'}
                                            onChange={() => setGender('female')}
                                            className="h-4 w-4"
                                        />
                                        <span>Female</span>
                                    </label>
                                </div>
                            </fieldset>

                            {unit === 'metric' ? (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium text-slate-700"
                                            htmlFor="height-cm"
                                        >
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
                                            className="border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium text-slate-700"
                                            htmlFor="weight-kg"
                                        >
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
                                            className="border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium text-slate-700"
                                            htmlFor="height-ft"
                                        >
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
                                            className="border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium text-slate-700"
                                            htmlFor="height-in"
                                        >
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
                                            className="border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium text-slate-700"
                                            htmlFor="weight-lbs"
                                        >
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
                                            className="border-slate-200 bg-white/70 text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <p className="text-sm font-medium text-red-400">{error}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                                <Button type="submit" className="px-6 text-sm font-semibold" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                            Calculating...
                                        </div>
                                    ) : 'Calculate'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={reset}
                                    className="border-slate-300 px-6 text-sm text-slate-600 hover:bg-slate-100"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>

                        {/* Visual scale */}
                        <div className="mt-8">
                            <h3 className="mb-2 text-sm font-semibold text-slate-700">
                                BMI scale (10–40)
                            </h3>
                            <div className="relative">
                                <div className="flex h-3 w-full overflow-hidden rounded-full ring-1 ring-slate-200">
                                    <div
                                        style={{ width: '28.3%' }}
                                        className="bg-yellow-400"
                                        aria-hidden
                                    />
                                    <div
                                        style={{ width: '21.7%' }}
                                        className="bg-emerald-500"
                                        aria-hidden
                                    />
                                    <div
                                        style={{ width: '16.7%' }}
                                        className="bg-orange-400"
                                        aria-hidden
                                    />
                                    <div
                                        style={{ width: '33.3%' }}
                                        className="bg-red-500"
                                        aria-hidden
                                    />
                                </div>
                                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
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
                                        <div className="mx-auto h-6 w-0.5 bg-slate-800" />
                                        <div className="mt-1 text-center text-[11px] font-medium text-slate-800">
                                            {result.bmi}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-sm bg-yellow-400" />
                                    Underweight
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
                                    Normal
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-sm bg-orange-400" />
                                    Overweight
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-sm bg-red-500" />
                                    Obese
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && result && (
                    <div className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-xl shadow-slate-200/80 backdrop-blur-md md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Your Results</h2>
                                <p className="text-sm text-slate-500">Based on your provided metrics.</p>
                            </div>
                            <Button variant="outline" onClick={() => setStep(1)}>Recalculate</Button>
                        </div>

                        <hr className="my-6 border-slate-200" />

                        {!result ? (
                            <div className="space-y-4 text-sm text-slate-600">
                                <p>
                                    Enter your height and weight on the left, then select
                                    Calculate. You will see:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>Your BMI value and BMI category.</li>
                                    <li>
                                        A healthy BMI range and an estimated ideal weight
                                        interval.
                                    </li>
                                    <li>
                                        BMI Prime and Ponderal Index, which provide additional
                                        context.
                                    </li>
                                    <li>
                                        A written health insight plus options to download or
                                        share your report.
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <div className="text-sm font-medium uppercase tracking-wide text-slate-300">
                                        YOUR BMI
                                    </div>
                                    <div className="mt-1 flex items-baseline gap-4">
                                        <div className="text-5xl font-extrabold text-slate-900">
                                            {result.bmi}
                                        </div>
                                        <div
                                            className={`text-2xl font-semibold ${categoryColors[result.category]}`}
                                        >
                                            {result.category}
                                        </div>
                                    </div>
                                </div>

                                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                                    <div className="rounded-lg border border-slate-200 bg-slate-100/60 p-4">
                                        <dt className="text-xs text-slate-500">
                                            Healthy BMI range
                                        </dt>
                                        <dd className="mt-1 text-base font-medium text-slate-800">
                                            {result.healthyRange} kg/m²
                                        </dd>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Standard adult reference range used in many clinical
                                            guidelines.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-slate-100/60 p-4">
                                        <dt className="text-xs text-slate-500">Ideal weight</dt>
                                        <dd className="mt-1 text-base font-medium text-slate-800">
                                            {result.idealWeightMin} – {result.idealWeightMax}{' '}
                                            {unit === 'us' ? 'lbs' : 'kg'}
                                        </dd>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Approximate weight interval if BMI is kept within the
                                            healthy band.
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-slate-100/60 p-4">
                                        <dt className="text-xs text-slate-500">BMI Prime</dt>
                                        <dd className="mt-1 text-base font-medium text-slate-800">
                                            {result.bmiPrime}
                                        </dd>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Ratio of your BMI to the upper limit of the healthy
                                            BMI range (25 kg/m²).
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 bg-slate-100/60 p-4">
                                        <dt className="text-xs text-slate-500">
                                            Ponderal Index
                                        </dt>
                                        <dd className="mt-1 text-base font-medium text-slate-800">
                                            {result.ponderalIndex}
                                        </dd>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Weight divided by height cubed; can be more useful
                                            than BMI at very tall or short heights.
                                        </p>
                                    </div>
                                </dl>

                                {/* Health insight */}
                                {healthInsight && (
                                    <div className="mt-4 space-y-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                                        <h3 className="text-sm font-semibold text-blue-800">
                                            Health insight for your category
                                        </h3>
                                        <p className="text-sm text-blue-700">
                                            {healthInsight.headline}
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            {healthInsight.summary}
                                        </p>
                                        {healthInsight.bullets.length > 0 && (
                                            <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-blue-700">
                                                {healthInsight.bullets.map((tip) => (
                                                    <li key={tip}>{tip}</li>
                                                ))}
                                            </ul>
                                        )}
                                        <p className="mt-2 text-[11px] text-blue-600">
                                            This tool does not give a diagnosis or replace medical
                                            advice. If you have symptoms, existing conditions, or
                                            concerns, please discuss these numbers with a
                                            qualified healthcare professional.
                                        </p>
                                    </div>
                                )}

                                {/* Export & share actions */}
                                <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-100/70 p-4">
                                    <h3 className="text-sm font-semibold text-slate-700">
                                        Save or share your report
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Export a snapshot of your current inputs and BMI or
                                        share a link to this page with your numbers embedded in
                                        the URL.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleDownloadPDF}
                                            disabled={!result}
                                            className="border-slate-300 text-xs text-slate-600 hover:bg-slate-200"
                                        >
                                            Download PDF report
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCopyLink}
                                            disabled={!result}
                                            className="border-slate-300 text-xs text-slate-600 hover:bg-slate-200"
                                        >
                                            Copy shareable link
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handlePrint}
                                            disabled={!result}
                                            className="border-slate-300 text-xs text-slate-600 hover:bg-slate-200"
                                        >
                                            Print report
                                        </Button>
                                    </div>
                                    {(shareMessage || pdfMessage) && (
                                        <p className="mt-2 text-[11px] text-slate-600">
                                            {pdfMessage || shareMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Content Sections */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div className="grid gap-8 lg:grid-cols-3">
                    <article className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-6 md:p-8">
                        <h3 className="text-2xl font-bold text-slate-900">
                            What BMI indicates
                        </h3>
                        <p className="mt-3 text-sm text-slate-600">
                            BMI compares weight to height to estimate whether body mass is
                            in a range broadly associated with lower health risk. It does
                            not directly measure body fat or account for muscle mass, bone
                            density, or fat distribution.
                        </p>
                        <h4 className="mt-6 text-xl font-semibold text-slate-900">
                            Categories
                        </h4>
                        <ul className="mt-2 space-y-2 text-sm text-slate-600">
                            <li>
                                <span className="font-medium text-yellow-600">
                                    Underweight:
                                </span>{' '}
                                potential nutrient deficiency or other concerns.
                            </li>
                            <li>
                                <span className="font-medium text-emerald-600">
                                    Normal:
                                </span>{' '}
                                generally associated with lower chronic disease risk.
                            </li>
                            <li>
                                <span className="font-medium text-orange-600">
                                    Overweight:
                                </span>{' '}
                                higher risk of metabolic and cardiovascular conditions.
                            </li>
                            <li>
                                <span className="font-medium text-red-600">Obese:</span>{' '}
                                substantially increased risk; medical guidance recommended.
                            </li>
                        </ul>
                        <h4 className="mt-6 text-xl font-semibold text-slate-900">
                            Beyond BMI
                        </h4>
                        <p className="mt-2 text-sm text-slate-600">
                            Use BMI alongside waist circumference, physical activity,
                            family history, and clinical measures. BMI Prime
                            contextualises BMI relative to the upper healthy threshold,
                            while the Ponderal Index considers height cubed to better
                            reflect proportionality in taller or shorter individuals.
                        </p>
                    </article>

                    <aside className="rounded-2xl border border-slate-200 bg-white/70 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-900">
                            How to use this tool
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li>
                                Measure height and weight carefully; small input errors can
                                shift BMI meaningfully.
                            </li>
                            <li>
                                Recalculate after major changes in weight, training, or
                                health status.
                            </li>
                            <li>
                                Use the PDF or printout to support discussions with your
                                doctor, dietitian, or coach.
                            </li>
                        </ul>
                        <h3 className="mt-8 text-xl font-bold text-slate-900">FAQ</h3>
                        <p className="mt-2 text-xs text-slate-600">
                            BMI is designed for adults. For athletes or people with high
                            muscle mass, body fat measurements and professional
                            assessment provide better insight. Always interpret BMI in
                            the context of your overall health profile.
                        </p>
                    </aside>
                </div>
            </section>

            <footer className="mx-auto max-w-6xl px-4 pb-10">
                <hr className="border-slate-200" />
                <p className="mt-4 text-xs text-slate-500">
                    This calculator is for educational use and does not replace
                    personalised medical advice, diagnosis, or treatment.
                </p>
            </footer>
        </main>
    );
}
