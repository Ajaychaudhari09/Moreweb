'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { calculateEMI } from '@/lib/utils';
import type { EMIResult } from '@/types';

// Amortization row type
interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

function formatINR(n: number): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(n));
  } catch {
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  }
}

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState<number>(1_000_000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(10);
  const [result, setResult] = useState<EMIResult | null>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);

  const reset = () => {
    setPrincipal(1_000_000);
    setRate(8.5);
    setTenure(10);
    setResult(null);
    setSchedule([]);
  };

  const calculate = () => {
    const res = calculateEMI(principal, rate, tenure);
    if (!res) return; // guard for null

    setResult(res);

    const monthlyRate = rate / 12 / 100;
    let balance = principal;
    const rows: AmortizationRow[] = [];

    for (let i = 1; i <= tenure * 12; i++) {
      const interest = balance * monthlyRate;
      const principalComponent = res.monthlyEMI - interest;
      balance -= principalComponent;

      rows.push({
        month: i,
        emi: res.monthlyEMI,
        principal: principalComponent,
        interest,
        balance: balance > 0 ? balance : 0,
      });
    }

    setSchedule(rows);
  };

  const downloadCSV = () => {
    if (!schedule.length) return;

    const header = 'Month,EMI,Principal,Interest,Balance\n';
    const rows = schedule
      .map(
        (row) =>
          `${row.month},${row.emi.toFixed(2)},${row.principal.toFixed(
            2
          )},${row.interest.toFixed(2)},${row.balance.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization_schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-bold">Loan EMI Calculator</h1>
          <p className="text-muted-foreground">
            Plan your loan repayments with reducing-balance EMI
          </p>
        </div>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Enter Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Loan Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Loan Amount (₹)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) =>
                    setPrincipal(Math.max(0, Number(e.target.value)))
                  }
                  className="w-40"
                />
                <Slider
                  value={[principal]}
                  onValueChange={(val) => setPrincipal(val[0])}
                  min={50_000}
                  max={10_000_000}
                  step={5_000}
                  className="flex-1"
                  aria-label="Loan amount slider"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Annual Interest Rate (%)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) =>
                    setRate(Math.max(0, Number(e.target.value)))
                  }
                  className="w-28"
                />
                <Slider
                  value={[rate]}
                  onValueChange={(val) => setRate(val[0])}
                  min={1}
                  max={30}
                  step={0.1}
                  className="flex-1"
                  aria-label="Interest rate slider"
                />
              </div>
            </div>

            {/* Tenure */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Loan Tenure (Years)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) =>
                    setTenure(Math.max(1, Number(e.target.value)))
                  }
                  className="w-20"
                />
                <Slider
                  value={[tenure]}
                  onValueChange={(val) => setTenure(val[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="flex-1"
                  aria-label="Tenure slider"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={reset}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Reset
              </Button>
              <Button onClick={calculate}>Calculate</Button>
            </div>

            {/* Results */}
            {result && (
              <>
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-background p-6 text-center shadow">
                    <div className="text-2xl font-bold text-green-600">
                      {formatINR(result.monthlyEMI)}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly EMI</div>
                  </div>
                  <div className="rounded-xl bg-background p-6 text-center shadow">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatINR(result.totalInterest)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Interest</div>
                  </div>
                  <div className="rounded-xl bg-background p-6 text-center shadow">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatINR(result.totalAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Payment</div>
                  </div>
                </div>

                {/* Amortization Schedule */}
                <div className="mt-10">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Amortization Schedule</h2>
                    <Button size="sm" variant="secondary" onClick={downloadCSV}>
                      Download CSV
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm border-collapse">
                      <thead className="sticky top-0 bg-muted">
                        <tr>
                          <th className="border p-2">Month</th>
                          <th className="border p-2">EMI</th>
                          <th className="border p-2">Principal</th>
                          <th className="border p-2">Interest</th>
                          <th className="border p-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr key={row.month}>
                            <td className="border p-2 text-center">{row.month}</td>
                            <td className="border p-2">{formatINR(row.emi)}</td>
                            <td className="border p-2">{formatINR(row.principal)}</td>
                            <td className="border p-2">{formatINR(row.interest)}</td>
                            <td className="border p-2">{formatINR(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Disclaimer */}
            <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This calculator uses the reducing-balance EMI
              formula. Results are for educational purposes only and may vary with your bank.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
