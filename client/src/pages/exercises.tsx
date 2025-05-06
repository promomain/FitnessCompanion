import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerCircle } from "@/components/ui/timer-circle";
import { Counter } from "@/components/ui/counter";
import { exercises } from "@/lib/exercise-data";
import { apiRequest } from "@/lib/queryClient";
import { ExerciseState } from "@/App";

interface ExercisesProps {
  state: ExerciseState;
  setState: React.Dispatch<React.SetStateAction<ExerciseState>>;
}

export default function Exercises({ state, setState }: ExercisesProps) {
  const [, navigate] = useLocation();
  
  // Counters state for all exercises
  const [counters, setCounters] = useState({
    exercise2: 0, 
    exercise3: 0, 
    exercise4: 0,
    exercise5Left: 0,
    exercise5Right: 0
  });

  // Update button states based on current exercise and progress
  const [completeButtonEnabled, setCompleteButtonEnabled] = useState(false);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  // Update exercise completion status
  const completeExercise = async () => {
    const newCompletedState = [...state.exercisesCompleted];
    newCompletedState[state.currentExercise] = true;
    
    setState({
      ...state,
      exercisesCompleted: newCompletedState
    });
    
    setNextButtonEnabled(true);
  };

  // Navigate to the next or previous exercise
  const goToNextExercise = async () => {
    // Check if all exercises are completed
    const allCompleted = state.exercisesCompleted.every(status => status);
    
    if (state.currentExercise === exercises.length - 1 && allCompleted) {
      // Complete the routine
      try {
        await apiRequest('POST', '/api/progress/complete', { completed: true });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
      
      // Navigate to completion page
      navigate('/completion');
    } else {
      // Go to next exercise
      setState({
        ...state,
        currentExercise: state.currentExercise + 1
      });
    }
  };

  const goToPreviousExercise = () => {
    if (state.currentExercise > 0) {
      setState({
        ...state,
        currentExercise: state.currentExercise - 1
      });
    }
  };

  // Start the timer for the first exercise
  const startTimer = () => {
    setState({
      ...state,
      timerRunning: true
    });
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    setCompleteButtonEnabled(true);
  };

  const handleTimerTick = (remainingTime: number) => {
    setState({
      ...state,
      remainingTime
    });
  };

  // Update exercise completion status when counters change
  useEffect(() => {
    const currentExerciseObj = exercises[state.currentExercise];

    if (currentExerciseObj.id === 1) {
      // For timer exercise, completeButtonEnabled is handled by the timer
      return;
    } else if (currentExerciseObj.id === 5) {
      // For paired counter exercise
      setCompleteButtonEnabled(
        counters.exercise5Left >= 7 && counters.exercise5Right >= 7
      );
    } else if (currentExerciseObj.hasCounter && currentExerciseObj.repetitions) {
      // For regular counter exercises
      let counterValue = 0;
      
      switch (currentExerciseObj.id) {
        case 2: counterValue = counters.exercise2; break;
        case 3: counterValue = counters.exercise3; break;
        case 4: counterValue = counters.exercise4; break;
      }
      
      setCompleteButtonEnabled(counterValue >= currentExerciseObj.repetitions);
    }
  }, [counters, state.currentExercise, state.remainingTime]);
  
  // Update next button state when currentExercise or exercisesCompleted changes
  useEffect(() => {
    setNextButtonEnabled(state.exercisesCompleted[state.currentExercise]);
    setCompleteButtonEnabled(state.exercisesCompleted[state.currentExercise]);
  }, [state.currentExercise, state.exercisesCompleted]);

  // Handle counter changes
  const handleCounterChange = (exercise: number, value: number) => {
    switch (exercise) {
      case 2: 
        setCounters({...counters, exercise2: value});
        break;
      case 3:
        setCounters({...counters, exercise3: value});
        break;
      case 4:
        setCounters({...counters, exercise4: value});
        break;
    }
  };

  const handlePairCounterChange = (side: 'left' | 'right', value: number) => {
    if (side === 'left') {
      setCounters({...counters, exercise5Left: value});
    } else {
      setCounters({...counters, exercise5Right: value});
    }
  };

  // Get current exercise data
  const currentExercise = exercises[state.currentExercise];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2196F3]">Rutina de Ejercicios</h1>
          <div className="flex items-center">
            <span className="material-icons text-[#FF9800] text-3xl">fitness_center</span>
          </div>
        </div>
      </header>

      {/* Exercise Container */}
      <div className="container mx-auto px-4 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              id="progress-bar" 
              className="h-full bg-[#4CAF50]" 
              style={{ width: `${(state.currentExercise / exercises.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {/* Current Exercise Card */}
        <Card className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="relative">
            <video 
              className="w-full max-h-[40vh] object-cover bg-black"
              controls
              poster={currentExercise.posterUrl}
              src={currentExercise.videoPath}
            >
              Tu navegador no soporta videos HTML5.
            </video>
            <div className="absolute top-2 right-2 bg-[#2196F3] text-white rounded-full px-3 py-1 text-sm font-bold shadow-md">
              {currentExercise.id}/5
            </div>
          </div>
          
          <CardContent className="p-5">
            <h2 className="text-2xl font-bold mb-2">{currentExercise.title}</h2>
            
            {currentExercise.duration && (
              <div className="flex items-center text-lg mb-4">
                <span className="material-icons text-[#2196F3] mr-2">timer</span>
                <span>{currentExercise.duration}</span>
              </div>
            )}
            
            {currentExercise.repetitions && !currentExercise.hasPairCounter && (
              <div className="flex items-center text-lg mb-4">
                <span className="material-icons text-[#2196F3] mr-2">repeat</span>
                <span>{currentExercise.repetitions} repeticiones</span>
              </div>
            )}
            
            {currentExercise.hasPairCounter && (
              <div className="flex items-center text-lg mb-4">
                <span className="material-icons text-[#2196F3] mr-2">repeat</span>
                <span>7 repeticiones por pierna</span>
              </div>
            )}
            
            <p className="text-lg mb-6">{currentExercise.description}</p>
            
            {/* Exercise specific interactive elements */}
            <div className="flex justify-center mb-6">
              {currentExercise.hasTimer && (
                <TimerCircle 
                  seconds={state.remainingTime}
                  running={state.timerRunning}
                  onComplete={handleTimerComplete}
                  onTick={handleTimerTick}
                />
              )}
              
              {currentExercise.hasCounter && currentExercise.repetitions && (
                <Counter 
                  max={currentExercise.repetitions} 
                  onChange={(value) => handleCounterChange(currentExercise.id, value)}
                />
              )}
              
              {currentExercise.hasPairCounter && (
                <div className="flex justify-center space-x-6">
                  <Counter 
                    max={7} 
                    label="Pierna izquierda"
                    onChange={(value) => handlePairCounterChange('left', value)}
                  />
                  <Counter 
                    max={7} 
                    label="Pierna derecha"
                    onChange={(value) => handlePairCounterChange('right', value)}
                  />
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              {currentExercise.hasTimer && !state.timerRunning && (
                <Button
                  className="flex-1 min-h-[56px] bg-[#2196F3] rounded-full text-white text-lg font-bold py-3 px-5 flex items-center justify-center"
                  onClick={startTimer}
                  disabled={state.timerRunning}
                >
                  <span className="material-icons mr-2">play_arrow</span>
                  Iniciar
                </Button>
              )}
              
              <Button
                className={`flex-1 min-h-[56px] bg-[#4CAF50] rounded-full text-white text-lg font-bold py-3 px-5 flex items-center justify-center ${!completeButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={completeExercise}
                disabled={!completeButtonEnabled}
              >
                <span className="material-icons mr-2">check</span>
                Completar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-up px-4 py-3">
        <div className="flex justify-between">
          <Button
            className={`min-h-[56px] rounded-full bg-gray-200 text-[#333333] text-lg font-bold py-3 px-6 flex items-center justify-center ${state.currentExercise === 0 ? 'opacity-50' : ''}`}
            onClick={goToPreviousExercise}
            disabled={state.currentExercise === 0}
          >
            <span className="material-icons mr-2">arrow_back</span>
            Anterior
          </Button>
          
          <Button
            className={`min-h-[56px] rounded-full bg-[#2196F3] text-white text-lg font-bold py-3 px-6 flex items-center justify-center ${!nextButtonEnabled ? 'opacity-50' : ''}`}
            onClick={goToNextExercise}
            disabled={!nextButtonEnabled}
          >
            {state.currentExercise === exercises.length - 1 && state.exercisesCompleted.every(status => status) ? (
              <>
                Finalizar
                <span className="material-icons ml-2">check</span>
              </>
            ) : (
              <>
                Siguiente
                <span className="material-icons ml-2">arrow_forward</span>
              </>
            )}
          </Button>
        </div>
      </nav>
    </div>
  );
}
