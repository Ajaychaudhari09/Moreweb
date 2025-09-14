"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DateTimeCalculatorPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [mode, setMode] = useState<"duration" | "add">("duration");
  const [daysToAdd, setDaysToAdd] = useState<string>("");

  const calculateDuration = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    setResult(`${diffDays} days (${years} years, ${months} months, ${days} days)`);
  };

  const addDaysToDate = () => {
    if (!startDate || !daysToAdd) return;
    const date = new Date(startDate);
    date.setDate(date.getDate() + parseInt(daysToAdd));
    setResult(`Result date: ${date.toDateString()}`);
  };

  const reset = () => {
    setStartDate("");
    setEndDate("");
    setDaysToAdd("");
    setResult("");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Date & Time Calculator</h1>
          <p className="text-muted-foreground">
            Calculate duration between dates or find dates by adding/subtracting days
          </p>
        </div>
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Date Calculations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setMode("duration")}
                className={`w-full ${mode === "duration" ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-accent hover:text-accent-foreground"}`}
              >
                Calculate Duration
              </Button>
              <Button
                onClick={() => setMode("add")}
                className={`w-full ${mode === "add" ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-accent hover:text-accent-foreground"}`}
              >
                Add/Subtract Days
              </Button>
            </div>
            {mode === "duration" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={calculateDuration} className="w-full mt-4">
                  Calculate Duration
                </Button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Days to Add</label>
                    <Input
                      type="number"
                      placeholder="Enter days (negative to subtract)"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={addDaysToDate} className="w-full mt-4">
                  Calculate Date
                </Button>
              </>
            )}
            <Button onClick={reset} className="w-full border mt-2">
              Reset
            </Button>
            {result && (
              <div className="mt-8 p-6 bg-muted rounded-lg animate-bounce-in">
                <h3 className="text-lg font-semibold mb-2">Result</h3>
                <p className="text-lg">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
