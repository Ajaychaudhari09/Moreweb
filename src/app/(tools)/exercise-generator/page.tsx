"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Types
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
  fitness_level: "beginner" | "intermediate" | "advanced";
  workout_type:
    | "full_body"
    | "upper_body"
    | "lower_body"
    | "cardio"
    | "strength"
    | "flexibility";
  duration: string;
  equipment: "none" | "basic" | "gym";
}

export default function ExerciseGeneratorPage() {
  const [preferences, setPreferences] = useState<Preferences>({
    fitness_level: "beginner",
    workout_type: "full_body",
    duration: "30",
    equipment: "none",
  });

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);

  const generateWorkout = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const sampleWorkout: Workout = {
        warm_up: [
          "5 minutes light jogging in place",
          "Arm circles - 30 seconds each direction",
          "Leg swings - 10 each leg",
        ],
        exercises: [
          {
            name: "Push-ups",
            reps: "3 sets of 10-15",
            description: "Keep your body straight, lower to ground",
          },
          {
            name: "Squats",
            reps: "3 sets of 15-20",
            description:
              "Feet shoulder-width apart, sit back like sitting in chair",
          },
          {
            name: "Plank",
            reps: "3 sets of 30 seconds",
            description: "Hold straight body position",
          },
          {
            name: "Lunges",
            reps: "3 sets of 10 each leg",
            description: "Step forward, lower back knee toward ground",
          },
          {
            name: "Mountain Climbers",
            reps: "3 sets of 20",
            description: "Quick alternating knee-to-chest movements",
          },
        ],
        cool_down: [
          "5 minutes walking",
          "Hold each stretch for 30 seconds",
          "Focus on major muscle groups used",
        ],
        total_time: "30 minutes",
      };

      setWorkout(sampleWorkout);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Exercise Generator</h1>
          <p className="text-muted-foreground">
            Create custom workout routines based on your fitness level and
            available time
          </p>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Workout Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fitness Level */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Fitness Level
              </label>
              <select
                value={preferences.fitness_level}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    fitness_level: e.target.value as Preferences["fitness_level"],
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Workout Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Workout Type
              </label>
              <select
                value={preferences.workout_type}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    workout_type: e.target.value as Preferences["workout_type"],
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="full_body">Full Body</option>
                <option value="upper_body">Upper Body</option>
                <option value="lower_body">Lower Body</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength Training</option>
                <option value="flexibility">Flexibility/Yoga</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (minutes)
              </label>
              <select
                value={preferences.duration}
                onChange={(e) =>
                  setPreferences({ ...preferences, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Equipment
              </label>
              <select
                value={preferences.equipment}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    equipment: e.target.value as Preferences["equipment"],
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="none">No Equipment</option>
                <option value="basic">
                  Basic (Resistance bands, dumbbells)
                </option>
                <option value="gym">Full Gym Access</option>
              </select>
            </div>

            {/* Button */}
            <Button onClick={generateWorkout} className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Workout"}
            </Button>

            {/* Workout Output */}
            {workout && (
              <div className="mt-8 p-6 bg-muted rounded-lg animate-bounce-in">
                <h3 className="text-lg font-semibold mb-4">
                  Your Custom Workout
                </h3>

                <div className="space-y-6">
                  {/* Warm-up */}
                  <div>
                    <h4 className="font-medium text-orange-500 mb-2">
                      🔥 Warm-up (5 minutes)
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {workout.warm_up.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Main Exercises */}
                  <div>
                    <h4 className="font-medium text-blue-500 mb-3">
                      💪 Main Workout
                    </h4>
                    <div className="space-y-3">
                      {workout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="p-3 bg-background rounded border"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-medium">{exercise.name}</h5>
                            <span className="text-sm text-blue-500">
                              {exercise.reps}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {exercise.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cool-down */}
                  <div>
                    <h4 className="font-medium text-green-500 mb-2">
                      🧘 Cool-down (5 minutes)
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {workout.cool_down.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total Time */}
                  <div className="p-3 bg-primary/10 rounded border-l-4 border-primary">
                    <h4 className="font-medium">⏱️ Total Workout Time</h4>
                    <p className="text-lg font-bold">{workout.total_time}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
