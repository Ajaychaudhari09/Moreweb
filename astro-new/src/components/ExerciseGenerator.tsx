"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

// Types
type Level = 'beginner' | 'intermediate' | 'advanced';
type WType = 'full_body' | 'upper_body' | 'lower_body' | 'cardio' | 'strength' | 'flexibility' | 'custom_muscle';
type Equip = 'none' | 'basic' | 'gym';
type SpecificMuscle = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'glutes' | 'all';

type Ex = {
    id: string;
    name: string;
    pattern: string;
    muscle: string;
    difficulty: string;
    equipment: Equip | 'all';
    type: 'strength' | 'cardio' | 'mobility' | 'core';
    default_reps: string;
    rest_sec: number;
    rpe: string;
    cues: string;
};

type Catalog = {
    warmups: { name: string; time_sec: number; type: string }[];
    cooldowns: { name: string; time_sec: number; type: string }[];
    exercises: Ex[];
    templates: Record<string, string[]>; // relaxed type key to string for flex
};

interface Exercise {
    name: string;
    reps: string;
    description: string;
    tags: string[];
}

interface Workout {
    warm_up: string[];
    exercises: Exercise[];
    cool_down: string[];
    total_time: string;
}

interface Preferences {
    fitness_level: Level;
    workout_type: WType;
    target_muscle: SpecificMuscle;
    duration: string;
    equipment: Equip;
}

const fmtMin = (m: number) => `${Math.round(m)} minutes`;

export default function ExerciseGenerator() {
    const [preferences, setPreferences] = useState<Preferences>({
        fitness_level: 'beginner',
        workout_type: 'full_body',
        target_muscle: 'all',
        duration: '30',
        equipment: 'none'
    });

    const [cat, setCat] = useState<Catalog | null>(null);
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/data/exercises.json', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to load exercise data');
                const json: Catalog = await res.json();
                setCat(json);
            } catch (error) {
                console.error("Error loading exercise data:", error);
            }
        })();
    }, []);

    const plan = useMemo(() => {
        const dur = Math.max(10, Number(preferences.duration) || 30);
        const warmMin = Math.min(8, Math.max(3, Math.round(dur * 0.15)));
        const coolMin = Math.min(6, Math.max(3, Math.round(dur * 0.1)));
        const mainMin = Math.max(8, dur - warmMin - coolMin);
        return { warmMin, mainMin, coolMin, dur };
    }, [preferences.duration]);

    function selectWarmup() {
        if (!cat) return [];
        const picks = [];
        let t = 0;
        // Simple shuffle
        const warmups = [...cat.warmups].sort(() => 0.5 - Math.random());
        for (const w of warmups) {
            if (t >= plan.warmMin * 60) break;
            picks.push(`${w.name} — ${w.time_sec}s`);
            t += w.time_sec;
        }
        return picks;
    }

    function selectCooldown() {
        if (!cat) return [];
        const picks = [];
        let t = 0;
        const cooldowns = [...cat.cooldowns].sort(() => 0.5 - Math.random());
        for (const c of cooldowns) {
            if (t >= plan.coolMin * 60) break;
            picks.push(`${c.name} — ${c.time_sec}s`);
            t += c.time_sec;
        }
        return picks;
    }

    function filterByEquipment(xs: Ex[]) {
        const eq = preferences.equipment;
        return xs.filter(x => x.equipment === 'all' || x.equipment === eq || (eq === 'gym' && (x.equipment === 'basic' || x.equipment === 'none')) || (eq === 'basic' && x.equipment === 'none'));
    }

    function filterByLevel(xs: Ex[]) {
        const lv = preferences.fitness_level;
        const rank = (d: string) => (d === 'beginner' ? 1 : d === 'intermediate' ? 2 : 3);
        return xs.filter(x => rank(x.difficulty) <= rank(lv));
    }

    function setsReps(type: 'strength' | 'cardio' | 'mobility' | 'core') {
        const lv = preferences.fitness_level;
        if (type === 'cardio') {
            return { sets: 1, reps: 'Steady / Intervals @ RPE 6-7', rest: 0 };
        }
        if (type === 'mobility' || type === 'core') {
            return { sets: lv === 'beginner' ? 2 : lv === 'intermediate' ? 3 : 3, reps: lv === 'beginner' ? '8-12 or 30s' : '10-15 or 45s', rest: 30 };
        }
        if (lv === 'beginner') return { sets: 2, reps: '8-12', rest: 60 };
        if (lv === 'intermediate') return { sets: 3, reps: '8-12', rest: 90 };
        return { sets: 4, reps: '6-10', rest: 120 };
    }

    function buildMain() {
        if (!cat) return [];

        let pool = filterByEquipment(filterByLevel(cat.exercises));

        // Filter by muscle if "custom_muscle" is selected
        if (preferences.workout_type === 'custom_muscle' && preferences.target_muscle !== 'all') {
            // Fuzzy match muscle group
            pool = pool.filter(x => x.muscle.toLowerCase().includes(preferences.target_muscle) || x.muscle.toLowerCase().includes('compound'));
        }

        const patterns = preferences.workout_type === 'custom_muscle'
            ? ['compound', 'isolation', 'isolation', 'core'] // fallback pattern for muscle focus
            : (cat.templates[preferences.workout_type] || ['compound', 'compound', 'isolation', 'isolation', 'core']);

        const result: Exercise[] = [];
        const perExerciseMin = 3.5;
        const maxSlots = Math.max(2, Math.floor(plan.mainMin / perExerciseMin));

        // Attempt to fill slots based on pattern
        // If custom muscle, we prioritize the muscle group logic above pattern

        // Helper to pick best
        const pick = (pPool: Ex[], pattern?: string) => {
            if (!pPool.length) return null;
            // if pattern provided, try find match
            if (pattern) {
                const match = pPool.find(x => x.pattern === pattern || x.type === pattern);
                if (match) return match;
            }
            return pPool[0]; // fallback
        };

        let tempPool = [...pool];

        for (let i = 0; i < maxSlots; i++) {
            const desiredPattern = patterns[i % patterns.length];
            // prioritizing pattern matches if they exist
            // also ensure we don't pick same exercise twice

            const best = pick(tempPool, desiredPattern);
            if (best) {
                const sr = setsReps(best.type);
                result.push({
                    name: best.name,
                    reps: `${sr.sets} x ${sr.reps} • Rest ${sr.rest}s`,
                    description: best.cues,
                    tags: [best.muscle, best.difficulty]
                });
                tempPool = tempPool.filter(x => x.id !== best.id);
            }
        }

        return result;
    }

    const generateWorkout = () => {
        setLoading(true);
        setTimeout(() => {
            const warm = selectWarmup();
            const main = buildMain();
            const cool = selectCooldown();
            const total = fmtMin(plan.dur);
            setWorkout({
                warm_up: warm,
                exercises: main,
                cool_down: cool,
                total_time: total
            });
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
            <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-5">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Workout Generator</h1>
                    <p className="text-sm text-slate-500">Design your perfect workout in seconds.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {step === 1 ? (
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Customize Session</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Fitness Level</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setPreferences({ ...preferences, fitness_level: l })}
                                                className={`py-2 text-sm rounded-md border transition-all ${preferences.fitness_level === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                <span className="capitalize">{l}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Goal / Type</label>
                                    <select
                                        value={preferences.workout_type}
                                        onChange={(e) => setPreferences({ ...preferences, workout_type: e.target.value as WType })}
                                        className="w-full px-3 py-2 border rounded-md bg-white text-sm"
                                    >
                                        <option value="full_body">Full Body (General Fitness)</option>
                                        <option value="custom_muscle">Specific Muscle Focus</option>
                                        <option value="strength">Strength Training</option>
                                        <option value="cardio">Cardio / Endurance</option>
                                        <option value="flexibility">Flexibility / Mobility</option>
                                    </select>
                                </div>

                                {/* Conditional Muscle Selector */}
                                <div className={`transition-all duration-300 ${preferences.workout_type === 'custom_muscle' ? 'opacity-100 h-auto' : 'opacity-50 h-0 overflow-hidden pointer-events-none'}`}>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Target Muscle</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'glutes'] as const).map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setPreferences({ ...preferences, target_muscle: m })}
                                                className={`py-1.5 text-xs rounded border capitalize transition-colors ${preferences.target_muscle === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Duration</label>
                                    <select
                                        value={preferences.duration}
                                        onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md bg-white text-sm"
                                    >
                                        <option value="15">15 Minutes (Express)</option>
                                        <option value="30">30 Minutes (Standard)</option>
                                        <option value="45">45 Minutes (Extended)</option>
                                        <option value="60">60 Minutes (Full Session)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Equipment Available</label>
                                    <div className="space-y-2">
                                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${preferences.equipment === 'none' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            <input type="radio" name="equip" checked={preferences.equipment === 'none'} onChange={() => setPreferences({ ...preferences, equipment: 'none' })} className="mr-3 text-blue-600" />
                                            <div>
                                                <div className="font-medium text-sm">No Equipment</div>
                                                <div className="text-xs text-slate-500">Bodyweight only</div>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${preferences.equipment === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            <input type="radio" name="equip" checked={preferences.equipment === 'basic'} onChange={() => setPreferences({ ...preferences, equipment: 'basic' })} className="mr-3 text-blue-600" />
                                            <div>
                                                <div className="font-medium text-sm">Basic Home Gym</div>
                                                <div className="text-xs text-slate-500">Dumbbells, bands, yoga mat</div>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${preferences.equipment === 'gym' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            <input type="radio" name="equip" checked={preferences.equipment === 'gym'} onChange={() => setPreferences({ ...preferences, equipment: 'gym' })} className="mr-3 text-blue-600" />
                                            <div>
                                                <div className="font-medium text-sm">Commercial Gym</div>
                                                <div className="text-xs text-slate-500">Full access to machines & weights</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={generateWorkout} size="lg" className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg" disabled={loading || !cat}>
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                        Building Routine...
                                    </div>
                                ) : 'Generate Workout'}
                            </Button>
                        </div>
                    </section>
                ) : (
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        {workout && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900">Your Session</h2>
                                        <p className="text-slate-500">Total Intensity Time: <span className="font-semibold text-slate-900">{workout.total_time}</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setStep(1)} className="print:hidden">Modify Settings</Button>
                                        <Button onClick={() => window.print()} className="print:hidden">Print Routine</Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Warmup */}
                                    <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
                                        <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            Warm-Up Phase
                                        </h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {workout.warm_up.map((w, i) => (
                                                <li key={i} className="bg-white p-3 rounded-lg border border-orange-100 text-sm font-medium text-slate-700 flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Main */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                            Work Phase
                                        </h3>
                                        <div className="grid gap-4">
                                            {workout.exercises.map((ex, i) => (
                                                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">#{i + 1}</span>
                                                            {ex.tags.map(t => <span key={t} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded capitalize">{t}</span>)}
                                                        </div>
                                                        <h4 className="text-lg font-bold text-slate-900 mb-1">{ex.name}</h4>
                                                        <p className="text-slate-600 text-sm leading-relaxed">{ex.description}</p>
                                                    </div>
                                                    <div className="md:w-48 flex-shrink-0 bg-slate-50 rounded-lg p-4 flex flex-col justify-center border border-slate-100">
                                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Prescription</span>
                                                        <div className="font-mono text-sm font-medium text-slate-800">{ex.reps}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cooldown */}
                                    <div className="bg-green-50 rounded-xl border border-green-100 p-6">
                                        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                            Cool-Down & Recovery
                                        </h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {workout.cool_down.map((w, i) => (
                                                <li key={i} className="bg-white p-3 rounded-lg border border-green-100 text-sm font-medium text-slate-700 flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
