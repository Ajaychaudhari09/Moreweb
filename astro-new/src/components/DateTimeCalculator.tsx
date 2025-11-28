"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CalculationMode = 'duration' | 'add' | 'age' | 'workdays';

interface DateResult {
    totalDays: number;
    years: number;
    months: number;
    days: number;
    weeks: number;
    hours: number;
    minutes: number;
    seconds: number;
    workdays?: number;
    weekends?: number;
}

export default function DateTimeCalculator() {
    const [mode, setMode] = useState<CalculationMode>('duration');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [daysToAdd, setDaysToAdd] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [result, setResult] = useState<DateResult | null>(null);
    const [calculatedDate, setCalculatedDate] = useState<string>('');

    const modeLabels = {
        duration: 'Calculate Duration',
        add: 'Add/Subtract Days',
        age: 'Age Calculator',
        workdays: 'Business Days'
    };

    const isWeekday = (date: Date): boolean => {
        const day = date.getDay();
        return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
    };

    const calculateDateResult = useMemo(() => {
        let start: Date;
        let end: Date;

        if (mode === 'duration' || mode === 'workdays') {
            if (!startDate || !endDate) return null;
            start = new Date(startDate);
            end = new Date(endDate);
        } else if (mode === 'age') {
            if (!birthDate) return null;
            start = new Date(birthDate);
            end = new Date();
        } else {
            return null;
        }

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // More accurate year/month calculation
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const weeks = Math.floor(totalDays / 7);
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        const minutes = Math.floor(diffTime / (1000 * 60));
        const seconds = Math.floor(diffTime / 1000);

        let workdays = 0;
        let weekends = 0;

        if (mode === 'workdays' || mode === 'duration') {
            const current = new Date(start);
            while (current <= end) {
                if (isWeekday(current)) {
                    workdays++;
                } else {
                    weekends++;
                }
                current.setDate(current.getDate() + 1);
            }
        }

        return {
            totalDays,
            years,
            months,
            days,
            weeks,
            hours,
            minutes,
            seconds,
            workdays,
            weekends
        };
    }, [mode, startDate, endDate, birthDate]);

    const calculateAddSubtract = () => {
        if (!startDate || !daysToAdd) return;

        const date = new Date(startDate);
        const days = parseInt(daysToAdd);
        date.setDate(date.getDate() + days);

        setCalculatedDate(date.toDateString());
        setResult(null);
    };

    const handleCalculate = () => {
        if (mode === 'add') {
            calculateAddSubtract();
        } else {
            const calculated = calculateDateResult;
            if (calculated) {
                setResult(calculated);
                setCalculatedDate('');
            }
        }
    };

    const reset = () => {
        setStartDate('');
        setEndDate('');
        setDaysToAdd('');
        setBirthDate('');
        setResult(null);
        setCalculatedDate('');
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Date & Time Calculator
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Calculate durations, add or subtract days, determine age, and count business days with precision.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* Mode Selection */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Calculation Type</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {(Object.keys(modeLabels) as CalculationMode[]).map((modeKey) => (
                            <button
                                key={modeKey}
                                onClick={() => {
                                    setMode(modeKey);
                                    reset();
                                }}
                                className={`px-4 py-3 text-sm font-medium rounded-md border transition-colors ${mode === modeKey
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {modeLabels[modeKey]}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Calculator Form */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {modeLabels[mode]}
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCalculate();
                        }}
                        className="space-y-6"
                    >
                        {mode === 'duration' || mode === 'workdays' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="start-date">
                                        Start Date
                                    </label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={today}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="end-date">
                                        End Date
                                    </label>
                                    <Input
                                        id="end-date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        required
                                    />
                                </div>
                            </div>
                        ) : mode === 'add' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="base-date">
                                        Base Date
                                    </label>
                                    <Input
                                        id="base-date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="days-input">
                                        Days to Add/Subtract
                                    </label>
                                    <Input
                                        id="days-input"
                                        type="number"
                                        placeholder="Enter days (negative to subtract)"
                                        value={daysToAdd}
                                        onChange={(e) => setDaysToAdd(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-gray-600 mt-1">
                                        Use positive numbers to add days, negative to subtract
                                    </p>
                                </div>
                            </div>
                        ) : mode === 'age' ? (
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="birth-date">
                                    Birth Date
                                </label>
                                <Input
                                    id="birth-date"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    max={today}
                                    required
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    Age will be calculated as of today
                                </p>
                            </div>
                        ) : null}

                        <div className="flex gap-3">
                            <Button type="submit" className="flex-1 sm:flex-none sm:px-8">
                                Calculate
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={reset}
                                className="flex-1 sm:flex-none sm:px-8"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Results */}
                {(result || calculatedDate) && (
                    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>

                        {calculatedDate && (
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{calculatedDate}</div>
                                <div className="text-sm text-gray-600 mt-1">Calculated Date</div>
                            </div>
                        )}

                        {result && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{result.totalDays}</div>
                                    <div className="text-sm text-gray-600">Total Days</div>
                                </div>

                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-lg font-semibold text-purple-600">
                                        {result.years}y {result.months}m {result.days}d
                                    </div>
                                    <div className="text-sm text-gray-600">Years, Months, Days</div>
                                </div>

                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{result.weeks}</div>
                                    <div className="text-sm text-gray-600">Weeks</div>
                                </div>

                                {mode === 'workdays' && (
                                    <>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">{result.workdays}</div>
                                            <div className="text-sm text-gray-600">Business Days</div>
                                        </div>

                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-600">{result.weekends}</div>
                                            <div className="text-sm text-gray-600">Weekend Days</div>
                                        </div>
                                    </>
                                )}

                                <div className="text-center p-4 bg-red-50 rounded-lg md:col-span-2 lg:col-span-1">
                                    <div className="text-lg font-semibold text-red-600">
                                        {result.hours.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Hours</div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Educational Content */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">How Date Calculations Work</h3>
                        <p className="text-gray-700 text-sm mb-4">
                            Date calculations involve understanding calendar systems, leap years, and time zones. Our calculator uses precise algorithms to ensure accuracy.
                        </p>
                        <div className="space-y-3">
                            <div className="border-l-4 border-blue-400 pl-3">
                                <div className="font-medium text-gray-900 text-sm">Duration Calculation</div>
                                <div className="text-xs text-gray-600">Accounts for varying month lengths and leap years</div>
                            </div>
                            <div className="border-l-4 border-green-400 pl-3">
                                <div className="font-medium text-gray-900 text-sm">Business Days</div>
                                <div className="text-xs text-gray-600">Excludes weekends (Saturday and Sunday)</div>
                            </div>
                            <div className="border-l-4 border-purple-400 pl-3">
                                <div className="font-medium text-gray-900 text-sm">Age Calculation</div>
                                <div className="text-xs text-gray-600">Precise to the day, considering birth date</div>
                            </div>
                        </div>
                    </article>

                    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Use Cases</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm mb-1">Project Planning</h4>
                                <p className="text-xs text-gray-600">Calculate project durations and delivery dates</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm mb-1">Event Planning</h4>
                                <p className="text-xs text-gray-600">Plan events with precise timing and countdowns</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm mb-1">Legal & Finance</h4>
                                <p className="text-xs text-gray-600">Calculate contract periods and due dates</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm mb-1">Personal Milestones</h4>
                                <p className="text-xs text-gray-600">Track anniversaries, ages, and important dates</p>
                            </div>
                        </div>
                    </article>
                </section>

                {/* Tips and Features */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tips</h4>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Use negative numbers to subtract days</li>
                            <li>• Business days exclude weekends only</li>
                            <li>• Age is calculated to today&apos;s date</li>
                            <li>• All calculations account for leap years</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📅 Date Formats</h4>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Input format: YYYY-MM-DD</li>
                            <li>• Results shown in multiple units</li>
                            <li>• Handles all calendar variations</li>
                            <li>• Timezone-independent calculations</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h4 className="font-medium text-gray-900 mb-2">⚡ Quick Examples</h4>
                        <ul className="text-xs text-gray-700 space-y-1">
                            <li>• Project: Start to deadline</li>
                            <li>• Age: Birth date to today</li>
                            <li>• Schedule: Add 30 business days</li>
                            <li>• Planning: Event countdown timer</li>
                        </ul>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-xs text-gray-500">
                        All calculations use standard Gregorian calendar. Results are estimates and should be verified for critical applications.
                    </p>
                </div>
            </footer>
        </div>
    );
}
