"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type Level = 'beginner' | 'intermediate' | 'advanced';
type WType = 'full_body' | 'upper_body' | 'lower_body' | 'cardio' | 'strength' | 'flexibility';
type Equip = 'none' | 'basic' | 'gym';

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
    templates: Record<WType, string[]>;
};

interface Exercise {
    name: string;
    reps: string;
    description: string;
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
    duration: string;
    equipment: Equip;
}

const fmtMin = (m: number) => `${Math.round(m)} minutes`;

export default function ExerciseGenerator() {
    const [preferences, setPreferences] = useState<Preferences>({
        fitness_level: 'beginner',
        workout_type: 'full_body',
        duration: '30',
        equipment: 'none'
    });

    const [cat, setCat] = useState<Catalog | null>(null);
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(false);

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
        // Time budget split: warm-up 15%, cool-down 10%, main 75% (cap warm-up at 8 min for short sessions)
        const warmMin = Math.min(8, Math.max(3, Math.round(dur * 0.15)));
        const coolMin = Math.min(6, Math.max(3, Math.round(dur * 0.1)));
        const mainMin = Math.max(8, dur - warmMin - coolMin);
        return { warmMin, mainMin, coolMin, dur };
    }, [preferences.duration]);

    function selectWarmup() {
        if (!cat) return [];
        const picks = [];
        let t = 0;
        for (const w of cat.warmups) {
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
        for (const c of cat.cooldowns) {
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
            // intervals inside main block by time
            return { sets: 1, reps: 'steady / intervals @ RPE 6-7', rest: 0 };
        }
        if (type === 'mobility' || type === 'core') {
            return { sets: lv === 'beginner' ? 2 : lv === 'intermediate' ? 3 : 3, reps: lv === 'beginner' ? '8-12 or 30-45s' : '10-15 or 45-60s', rest: 30 };
        }
        // strength
        if (lv === 'beginner') return { sets: 2, reps: '8-12', rest: 60 };
        if (lv === 'intermediate') return { sets: 3, reps: '6-12', rest: 90 };
        return { sets: 4, reps: '5-8', rest: 120 };
    }

    function buildMain() {
        if (!cat) return [];
        const patterns = cat.templates[preferences.workout_type];
        let pool = filterByEquipment(filterByLevel(cat.exercises));
        // order by pattern preference
        const result: Exercise[] = [];
        const perExerciseMin = 3.5; // average minutes per exercise block including rest
        const maxSlots = Math.max(2, Math.floor(plan.mainMin / perExerciseMin));

        for (const p of patterns) {
            const opts = pool.filter(x => x.pattern === p || x.type === p);
            if (!opts.length) continue;
            const best = opts[0];
            const sr = setsReps(best.type);
            result.push({
                name: best.name,
                reps: `${sr.sets} x ${sr.reps} • Rest ${sr.rest}s • RPE ${best.rpe}`,
                description: best.cues
            });
            // prevent duplicates
            pool = pool.filter(x => x.id !== best.id);
            if (result.length >= maxSlots) break;
        }

        // Fill if fewer than time allows
        let i = 0;
        while (result.length < maxSlots && i < pool.length) {
            const ex = pool[i++];
            const sr = setsReps(ex.type);
            result.push({
                name: ex.name,
                reps: `${sr.sets} x ${sr.reps} • Rest ${sr.rest}s • RPE ${ex.rpe}`,
                description: ex.cues
            });
        }

        return result;
    }

    const generateWorkout = () => {
        setLoading(true);
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
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-5">
                    <h1 className="text-3xl font-extrabold tracking-tight">Exercise Generator</h1>
                    <p className="text-gray-600">Builds time-budgeted, ACSM-aligned sessions by level, type, and equipment.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Preferences */}
                <section className="bg-white rounded-xl border p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Workout Preferences</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Fitness Level</label>
                            <select
                                value={preferences.fitness_level}
                                onChange={(e) => setPreferences({ ...preferences, fitness_level: e.target.value as Level })}
                                className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Workout Type</label>
                            <select
                                value={preferences.workout_type}
                                onChange={(e) => setPreferences({ ...preferences, workout_type: e.target.value as WType })}
                                className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                                <option value="full_body">Full Body</option>
                                <option value="upper_body">Upper Body</option>
                                <option value="lower_body">Lower Body</option>
                                <option value="cardio">Cardio</option>
                                <option value="strength">Strength Training</option>
                                <option value="flexibility">Flexibility/Yoga</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                            <select
                                value={preferences.duration}
                                onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                                <option value="60">60</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Available Equipment</label>
                            <select
                                value={preferences.equipment}
                                onChange={(e) => setPreferences({ ...preferences, equipment: e.target.value as Equip })}
                                className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                                <option value="none">No Equipment</option>
                                <option value="basic">Basic (bands, dumbbells)</option>
                                <option value="gym">Full Gym Access</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={generateWorkout} disabled={loading || !cat}>{loading ? 'Generating...' : 'Generate Workout'}</Button>
                        <Button variant="outline" onClick={() => setWorkout(null)}>Clear</Button>
                    </div>
                </section>

                {/* Plan preview */}
                <section className="bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold mb-3">Session Plan</h2>
                    <p className="text-sm text-gray-700">Warm-up ~{plan.warmMin} min • Main ~{plan.mainMin} min • Cool-down ~{plan.coolMin} min</p>
                    <p className="mt-1 text-xs text-gray-500">Warm-up 5–10 minutes and cool-down 3–6 minutes are typical before/after moderate to vigorous sessions. </p>
                </section>

                {/* Workout Output */}
                {workout && (
                    <section className="bg-white rounded-xl border p-6 space-y-6">
                        <h2 className="text-xl font-semibold">Your Custom Workout</h2>

                        <div>
                            <h3 className="font-medium text-orange-600 mb-2">Warm-up</h3>
                            <ul className="list-disc ml-6 text-sm space-y-1">
                                {workout.warm_up.map((w, i) => <li key={`w${i}`}>{w}</li>)}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-blue-600 mb-2">Main Workout</h3>
                            <div className="space-y-3">
                                {workout.exercises.map((ex, i) => (
                                    <div key={`e${i}`} className="p-3 rounded border bg-gradient-to-br from-slate-50 to-white">
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-semibold">{ex.name}</h4>
                                            <span className="text-sm text-blue-600">{ex.reps}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">{ex.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-green-600 mb-2">Cool-down</h3>
                            <ul className="list-disc ml-6 text-sm space-y-1">
                                {workout.cool_down.map((c, i) => <li key={`c${i}`}>{c}</li>)}
                            </ul>
                        </div>

                        <div className="p-3 bg-primary/10 rounded border-l-4 border-primary">
                            <h4 className="font-medium">Total Session Time</h4>
                            <p className="text-lg font-bold">{workout.total_time}</p>
                        </div>

                        <div className="text-xs text-gray-500">
                            Use RPE (1–10) to gauge effort; add 2–10% load when sets exceed top reps with good form. Separate heavy compound lifts to preserve intensity and rest 2–3 min for heavy sets, 60–90 s for moderate sets.
                        </div>
                    </section>
                )}

                {!workout && (
                    <section className="text-sm text-gray-600">
                        Choose level, type, duration, and equipment, then generate a session. Warm-up prepares the joints and nervous system; cool-down returns heart rate to baseline.
                    </section>
                )}

                {/* Education */}
                <section className="bg-white rounded-xl border p-6 space-y-2">
                    <h2 className="text-lg font-semibold">Why these prescriptions</h2>
                    <p className="text-gray-700 text-sm">
                        Reps/sets progression (e.g., 8–12 reps for novices, broader RM range for trained lifters) and rest times follow ACSM position stands for resistance training.
                    </p>
                    <p className="text-gray-700 text-sm">
                        Weekly activity context: accumulate ~150 minutes of moderate aerobic work (or 75 minutes vigorous) and train major muscle groups on 2+ days per week for health.
                    </p>
                    <p className="text-gray-700 text-sm">
                        Warm-up of ~5–10 minutes of dynamic movements and light activation improves readiness, while a brief cool-down restores baseline and aids recovery.
                    </p>
                </section>
            </main>
        </div>
    );
}
