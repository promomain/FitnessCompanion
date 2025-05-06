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
  // Obtener el tiempo de inicio del localStorage si existe (para cronometrar desde el botón "Comenzar Rutina")
  const savedStartTime = localStorage.getItem('exercise_start_time');
  const initialStartTime = savedStartTime ? parseInt(savedStartTime) : null;
  
  // Inicializar estado con el tiempo guardado si existe, o null si no
  const [state, setState] = useState<ExerciseState>({
    currentExercise: 0,
    exercisesCompleted: [false, false, false, false, false],
    startTime: initialStartTime, // Usar el tiempo guardado o null
    totalTime: 0
  });
  
  console.log("App inicializada con tiempo de inicio:", initialStartTime);

  const resetState = () => {
    // Al reiniciar, limpiamos el tiempo de inicio guardado en localStorage
    localStorage.removeItem('exercise_start_time');
    
    // Reiniciamos el estado para empezar de nuevo
    setState({
      currentExercise: 0,
      exercisesCompleted: [false, false, false, false, false],
      startTime: null, // El tiempo comenzará cuando se presione "Comenzar Rutina"
      totalTime: 0
    });
    console.log("Estado reiniciado, localStorage limpiado");
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
