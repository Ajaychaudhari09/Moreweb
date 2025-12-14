"use client";

import { useEffect, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateEMI } from '@/lib/utils';
import type { EMIResult } from '@/types';

interface AmortizationRow {
    month: number;        // 1..N
    emi: number;
    principal: number;
    interest: number;
    balance: number;
    calendarYear: number; // 2025
    financialYear: string; // FY2025-26
    monthName: string;    // Sep, Oct
}

function formatINR(n: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Math.round(n));
}

function monthShortName(i: number) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
}

function fyLabelFromDate(d: Date) {
    const y = d.getFullYear();
    const m = d.getMonth();
    const startYear = m >= 3 ? y : y - 1;
    const endYY = String((startYear + 1) % 100).padStart(2, '0');
    return `FY${startYear}-${endYY}`;
}

// Safe two-decimal rounding
const round2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

// Sanitizers
const onlyDigits = (s: string) => s.replace(/[^\d]/g, '');
const stripLeadingZeros = (s: string) => s.replace(/^0+(?=\d)/, '');

// Integer input (string-controlled)
function IntegerField({
    label, value, setValue,
    min = 0, max = 100000000, placeholder, id,
    describedBy
}: {
    label: string;
    value: string;
    setValue: (v: string) => void;
    min?: number; max?: number;
    placeholder?: string;
    id: string;
    describedBy?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm text-gray-700 mb-1">{label}</label>
            <Input
                id={id}
                aria-describedby={describedBy}
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') { setValue(''); return; }
                    const digits = stripLeadingZeros(onlyDigits(raw));
                    setValue(digits);
                }}
                onBlur={() => {
                    if (value === '') return;
                    const n = Math.min(max, Math.max(min, parseInt(value || '0', 10)));
                    setValue(String(n));
                }}
                className="w-36"
            />
            {describedBy && (
                <p id={describedBy} className="text-xs text-gray-500 mt-1">Range: {formatINR(min)} – {formatINR(max)}</p>
            )}
        </div>
    );
}

// Decimal input (string-controlled)
function DecimalField({
    label, value, setValue,
    min = 0, max = 30, placeholder, id,
    describedBy
}: {
    label: string;
    value: string;
    setValue: (v: string) => void;
    min?: number; max?: number;
    placeholder?: string;
    id: string;
    describedBy?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm text-gray-700 mb-1">{label}</label>
            <Input
                id={id}
                aria-describedby={describedBy}
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    const raw = e.target.value.replace(',', '.');
                    if (raw === '') { setValue(''); return; }
                    const cleaned = raw.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
                    const parts = cleaned.split('.');
                    const intPart = stripLeadingZeros(onlyDigits(parts[0] || ''));
                    const decimalPart = parts[1] ?? '';
                    const rebuild = decimalPart !== '' ? `${intPart || '0'}.${decimalPart}` : intPart;
                    setValue(rebuild);
                }}
                onBlur={() => {
                    if (value === '') return;
                    const n = Math.min(max, Math.max(min, parseFloat(value || '0')));
                    setValue(String(+n.toFixed(2)));
                }}
                className="w-28"
            />
            {describedBy && (
                <p id={describedBy} className="text-xs text-gray-500 mt-1">Range: {min}% – {max}%</p>
            )}
        </div>
    );
}

export default function EMICalculator() {
    // Inputs (strings allow empty while editing)
    const [Pstr, setPstr] = useState('1000000');
    const [rstr, setRstr] = useState('8.5');
    const [ystr, setYstr] = useState('10');

    // Derived numbers (clamped)
    const P = Math.min(10000000, Math.max(50000, parseInt(Pstr === '' ? '0' : Pstr, 10) || 0));
    const r = Math.min(30, Math.max(1, parseFloat(rstr === '' ? '0' : rstr) || 0));
    const years = Math.min(30, Math.max(1, parseInt(ystr === '' ? '0' : ystr, 10) || 0));

    const [res, setRes] = useState<EMIResult | null>(null);
    const [sched, setSched] = useState<AmortizationRow[]>([]);

    // Shareable link parsing
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const sp = new URLSearchParams(window.location.search);
        const p = sp.get('p'); const rr = sp.get('r'); const y = sp.get('y');
        if (p) setPstr(p);
        if (rr) setRstr(rr);
        if (y) setYstr(y);
    }, []);

    // Update URL for sharing
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const sp = new URLSearchParams();
        sp.set('p', Pstr); sp.set('r', rstr); sp.set('y', ystr);
        const url = `${window.location.pathname}?${sp.toString()}`;
        window.history.replaceState({}, '', url);
    }, [Pstr, rstr, ystr]);

    const reset = () => {
        setPstr('1000000');
        setRstr('8.5');
        setYstr('10');
        setRes(null);
        setSched([]);
    };

    const calculate = () => {
        const calc = calculateEMI(P, r, years);
        if (!calc) return;
        setRes(calc);

        const nMonths = years * 12;
        const mRate = r / 12 / 100;

        let bal = round2(P);
        const rows: AmortizationRow[] = [];

        // Start schedule from current month
        const now = new Date();
        const startYear = now.getFullYear();
        const startMonth = now.getMonth();

        for (let m = 1; m <= nMonths; m++) {
            const isLast = m === nMonths;

            const interest = round2(bal * mRate);
            let principal = round2(calc.monthlyEMI - interest);
            let emiToUse = round2(calc.monthlyEMI);

            // Adjust last payment to clear balance exactly
            if (isLast) {
                principal = round2(bal);
                emiToUse = round2(principal + interest);
            }

            bal = round2(Math.max(0, bal - principal));

            const idx = m - 1;
            const date = new Date(startYear, startMonth + idx, 1);
            const calYear = date.getFullYear();
            const fy = fyLabelFromDate(date);

            rows.push({
                month: m,
                emi: emiToUse,
                principal,
                interest,
                balance: bal,
                calendarYear: calYear,
                financialYear: fy,
                monthName: monthShortName(date.getMonth()),
            });
        }

        setSched(rows);
    };

    const downloadCSV = () => {
        if (!sched.length) return;
        const header = 'Month,Month Name,EMI,Principal,Interest,Balance,Calendar Year,Financial Year\n';
        const body = sched
            .map((r) =>
                `${r.month},${r.monthName} ${r.calendarYear},${r.emi.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.balance.toFixed(2)},${r.calendarYear},${r.financialYear}`
            )
            .join('\n');
        const blob = new Blob([header + body], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'amortization_schedule.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const emi = res?.monthlyEMI || 0;
    const totalInt = res?.totalInterest || 0;
    const totalPay = res?.totalAmount || 0;

    const pie = useMemo(
        () => [
            { label: 'Principal', value: P, color: '#22c55e' },
            { label: 'Interest', value: totalInt, color: '#3b82f6' },
        ],
        [P, totalInt]
    );

    const scenarios = useMemo(() => {
        const deltas = [-1, 0, 1, 2];
        return deltas.map((d) => {
            const rate = Math.max(0, r + d);
            const s = calculateEMI(P, rate, years);
            return { delta: d, rate, emi: s?.monthlyEMI || 0, total: s?.totalAmount || 0 };
        });
    }, [P, r, years]);

    // Slider-bound numeric values (fallbacks if empty)
    const Pslider = Pstr === '' ? 50000 : P;
    const rslider = rstr === '' ? 1 : r;
    const yslider = ystr === '' ? 1 : years;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        EMI Calculator — Home, Car, Personal Loans
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Mobile-first calculator with instant EMI, scenarios, and a continuous amortization list.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
                {/* Inputs */}
                <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Enter Loan Details</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Principal */}
                        <div>
                            <IntegerField
                                id="loan-amount"
                                label="Loan Amount (₹)"
                                value={Pstr}
                                setValue={setPstr}
                                min={50000}
                                max={10000000}
                                placeholder="e.g. 1000000"
                                describedBy="loan-amount-desc"
                            />
                            <div className="mt-3 flex items-center gap-4">
                                <Slider value={[Pslider]} onValueChange={(v) => setPstr(String(v[0]))} min={50000} max={10000000} step={5000} className="flex-1" />
                                <span className="text-sm text-gray-600 hidden sm:inline">{Pstr === '' ? '—' : formatINR(P)}</span>
                            </div>
                        </div>

                        {/* Rate */}
                        <div>
                            <DecimalField
                                id="interest-rate"
                                label="Interest Rate (% p.a.)"
                                value={rstr}
                                setValue={setRstr}
                                min={1}
                                max={30}
                                placeholder="e.g. 8.5"
                                describedBy="rate-desc"
                            />
                            <div className="mt-3 flex items-center gap-4">
                                <Slider value={[rslider]} onValueChange={(v) => setRstr(String(v[0]))} min={1} max={30} step={0.1} className="flex-1" />
                                <span className="text-sm text-gray-600 hidden sm:inline">{rstr === '' ? '—' : `${r.toFixed(2)}%`}</span>
                            </div>
                        </div>

                        {/* Tenure */}
                        <div>
                            <IntegerField
                                id="tenure-years"
                                label="Tenure (Years)"
                                value={ystr}
                                setValue={setYstr}
                                min={1}
                                max={30}
                                placeholder="e.g. 10"
                                describedBy="tenure-desc"
                            />
                            <div className="mt-3 flex items-center gap-4">
                                <Slider value={[yslider]} onValueChange={(v) => setYstr(String(v[0]))} min={1} max={30} step={1} className="flex-1" />
                                <span className="text-sm text-gray-600 hidden sm:inline">{ystr === '' ? '—' : `${years} yr`}</span>
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="flex flex-wrap gap-2 items-end">
                            <Button variant="outline" onClick={() => { setPstr('500000'); setRstr('10.5'); setYstr('5'); }}>
                                Personal Loan
                            </Button>
                            <Button variant="outline" onClick={() => { setPstr('800000'); setRstr('9'); setYstr('5'); }}>
                                Car Loan
                            </Button>
                            <Button variant="outline" onClick={() => { setPstr('3000000'); setRstr('8.25'); setYstr('20'); }}>
                                Home Loan
                            </Button>
                            <div className="w-full sm:w-auto flex gap-2 sm:ml-auto pt-4 sm:pt-0">
                                <Button className="flex-1 sm:flex-none" onClick={calculate}>Calculate</Button>
                                <Button variant="outline" className="flex-1 sm:flex-none" onClick={reset}>Reset</Button>
                            </div>
                        </div>
                    </div>

                    <p id="loan-amount-desc" className="sr-only">Enter principal between ₹50,000 and ₹1,00,00,000.</p>
                    <p id="rate-desc" className="sr-only">Enter interest rate between 1% and 30% per annum.</p>
                    <p id="tenure-desc" className="sr-only">Enter tenure between 1 and 30 years.</p>
                </section>

                {/* Summary, Scenarios, Chart */}
                {res && (
                    <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-6">
                        <h2 className="text-lg sm:text-xl font-semibold">EMI Summary</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { label: 'Monthly EMI', value: emi, color: 'from-emerald-500 to-green-500' },
                                { label: 'Total Interest', value: totalInt, color: 'from-sky-500 to-blue-500' },
                                { label: 'Total Payment', value: totalPay, color: 'from-fuchsia-500 to-purple-500' },
                            ].map((d, i) => (
                                <div key={i} className={`p-3 sm:p-4 rounded-lg bg-gradient-to-br ${d.color} text-white shadow`}>
                                    <div className="text-xl sm:text-2xl font-extrabold">{formatINR(d.value)}</div>
                                    <div className="text-sm opacity-90">{d.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Scenarios */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-2">Quick Scenarios</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {scenarios.map((s) => (
                                    <div key={s.delta} className="rounded-lg border p-3 bg-gradient-to-br from-slate-50 to-white">
                                        <div className="text-xs text-gray-500">
                                            {s.delta === 0 ? 'Base' : (s.delta > 0 ? `+${s.delta}%` : `${s.delta}%`)} rate
                                        </div>
                                        <div className="text-lg font-bold">{formatINR(s.emi)}</div>
                                        <div className="text-xs text-gray-600">Total {formatINR(s.total)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pie */}
                        <div className="flex flex-col items-center gap-3">
                            <svg width="220" height="220" viewBox="0 0 32 32">
                                {pie.map((d, i) => {
                                    const total = pie.reduce((s, dd) => s + dd.value, 0);
                                    const start = i ? (pie[0].value / total) * 2 * Math.PI : 0;
                                    const end = i ? 2 * Math.PI : (d.value / total) * 2 * Math.PI;
                                    return (
                                        <path
                                            key={i}
                                            d={`M16 16 L${16 + 16 * Math.cos(start)} ${16 + 16 * Math.sin(start)} A16 16 0 ${(d.value / total) > 0.5 ? 1 : 0} 1 ${16 + 16 * Math.cos(end)} ${16 + 16 * Math.sin(end)} Z`}
                                            fill={d.color}
                                        />
                                    );
                                })}
                            </svg>
                            <div className="flex gap-4 text-sm">
                                {pie.map((d) => (
                                    <div key={d.label} className="flex items-center gap-2">
                                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span>{d.label}: {Math.round((d.value / (P + totalInt || 1)) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Continuous amortization (no year grouping) */}
                        <h3 className="text-base sm:text-lg font-semibold">Amortization Schedule (All Months)</h3>

                        {/* Single scroll container with sticky header */}
                        <div className="rounded-xl border overflow-hidden">
                            <div className="max-h-[70vh] overflow-y-auto">
                                {/* Mobile cards */}
                                <div className="md:hidden divide-y">
                                    {sched.map((r) => {
                                        const totalPI = r.principal + r.interest || 1;
                                        const pPct = (r.principal / totalPI) * 100;
                                        const iPct = (r.interest / totalPI) * 100;
                                        return (
                                            <div key={r.month} className="p-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">{r.month}. {r.monthName} {r.calendarYear}</span>
                                                    <span className="font-semibold">{formatINR(r.emi)}</span>
                                                </div>
                                                <div className="mt-1 grid grid-cols-3 gap-2 text-xs text-gray-700">
                                                    <div>P: {formatINR(r.principal)}</div>
                                                    <div>I: {formatINR(r.interest)}</div>
                                                    <div>Bal: {formatINR(r.balance)}</div>
                                                </div>
                                                <div className="mt-2 w-full h-2 rounded bg-slate-200 overflow-hidden">
                                                    <div className="h-2 bg-emerald-500 inline-block" style={{ width: `${pPct}%` }} />
                                                    <div className="h-2 bg-sky-500 inline-block" style={{ width: `${iPct}%` }} />
                                                </div>
                                                <div className="mt-1 text-[10px] text-gray-500">
                                                    P {pPct.toFixed(0)}% • I {iPct.toFixed(0)}%
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop table */}
                                <table className="min-w-full text-sm hidden md:table">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-linear-to-r from-sky-50 to-indigo-50 text-indigo-900">
                                            <th className="p-2 border">#</th>
                                            <th className="p-2 border">Month</th>
                                            <th className="p-2 border">EMI</th>
                                            <th className="p-2 border">Principal</th>
                                            <th className="p-2 border">Interest</th>
                                            <th className="p-2 border">Balance</th>
                                            <th className="p-2 border">Split</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sched.map((r, idx) => {
                                            const totalPI = r.principal + r.interest || 1;
                                            const pPct = (r.principal / totalPI) * 100;
                                            const iPct = (r.interest / totalPI) * 100;
                                            return (
                                                <tr key={r.month} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                    <td className="p-2 border text-center">{r.month}</td>
                                                    <td className="p-2 border">{r.monthName} {r.calendarYear}</td>
                                                    <td className="p-2 border font-medium">{formatINR(r.emi)}</td>
                                                    <td className="p-2 border text-emerald-700">{formatINR(r.principal)}</td>
                                                    <td className="p-2 border text-blue-700">{formatINR(r.interest)}</td>
                                                    <td className="p-2 border">{formatINR(r.balance)}</td>
                                                    <td className="p-2 border">
                                                        <div className="w-full h-2 rounded bg-slate-200 overflow-hidden">
                                                            <div className="h-2 bg-emerald-500 inline-block" style={{ width: `${pPct}%` }} />
                                                            <div className="h-2 bg-sky-500 inline-block" style={{ width: `${iPct}%` }} />
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 mt-1">
                                                            P {pPct.toFixed(0)}% • I {iPct.toFixed(0)}%
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="text-right">
                            <Button size="sm" variant="outline" onClick={downloadCSV}>Download CSV</Button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
