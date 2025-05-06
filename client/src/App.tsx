import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Exercises from "@/pages/exercises";
import Completion from "@/pages/completion";
import { useState } from "react";

export interface ExerciseState {
  currentExercise: number;
  exercisesCompleted: boolean[];
  startTime: number | null;
  totalTime: number;
}

function Router() {
  const [state, setState] = useState<ExerciseState>({
    currentExercise: 0,
    exercisesCompleted: [false, false, false, false, false],
    startTime: null,
    totalTime: 0
  });

  const resetState = () => {
    setState({
      currentExercise: 0,
      exercisesCompleted: [false, false, false, false, false],
      startTime: null,
      totalTime: 0
    });
  };

  return (
    <Switch>
      <Route path="/" component={() => <Home />} />
      <Route path="/exercises">
        {() => <Exercises state={state} setState={setState} />}
      </Route>
      <Route path="/completion">
        {() => <Completion resetState={resetState} totalTime={state.totalTime} startTime={state.startTime} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
