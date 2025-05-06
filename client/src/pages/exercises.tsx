import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { exercises } from "@/lib/exercise-data";
import { apiRequest } from "@/lib/queryClient";
import { ExerciseState } from "@/App";
import { useSwipeable } from "react-swipeable";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

interface ExercisesProps {
  state: ExerciseState;
  setState: React.Dispatch<React.SetStateAction<ExerciseState>>;
}

export default function Exercises({ state, setState }: ExercisesProps) {
  const [, navigate] = useLocation();
  const fullscreenHandle = useFullScreenHandle();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State for fullscreen video mode
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  
  // Counters state for all exercises
  const [counters, setCounters] = useState({
    exercise2: 0, 
    exercise3: 0, 
    exercise4: 0,
    exercise5Left: 0,
    exercise5Right: 0
  });

  // Next button always enabled to allow skipping exercises
  const [nextButtonEnabled] = useState(true);
  
  // Set up swipe handlers for navigation between exercises
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (state.currentExercise < exercises.length - 1) {
        goToNextExercise();
      }
    },
    onSwipedRight: () => {
      if (state.currentExercise > 0) {
        goToPreviousExercise();
      }
    },
    trackMouse: true
  });

  // Verificar si necesitamos iniciar el cronómetro cuando el componente se monta
  useEffect(() => {
    // Obtener el tiempo de inicio del localStorage
    const savedStartTime = localStorage.getItem('exercise_start_time');
    
    // Si no hay tiempo guardado en el estado pero sí en localStorage, usarlo
    if (!state.startTime && savedStartTime) {
      const parsedStartTime = parseInt(savedStartTime);
      console.log("Usando tiempo de inicio desde localStorage:", parsedStartTime);
      setState({
        ...state,
        startTime: parsedStartTime
      });
    } 
    // Si no hay tiempo ni en el estado ni en localStorage, crear uno nuevo
    else if (!state.startTime) {
      console.log("Sin tiempo de inicio, creando uno nuevo");
      const newStartTime = Date.now();
      localStorage.setItem('exercise_start_time', newStartTime.toString());
      setState({
        ...state,
        startTime: newStartTime
      });
    }
  }, []);

  // Update exercise completion status
  const completeExercise = async () => {
    const newCompletedState = [...state.exercisesCompleted];
    newCompletedState[state.currentExercise] = true;
    
    setState({
      ...state,
      exercisesCompleted: newCompletedState
    });
  };

  // Navigate to the next or previous exercise
  const goToNextExercise = async () => {
    // Mark current exercise as completed
    const newCompletedState = [...state.exercisesCompleted];
    newCompletedState[state.currentExercise] = true;
    
    // Check if we're on the last exercise
    if (state.currentExercise === exercises.length - 1) {
      // Calculate total time and navigate to completion
      const now = Date.now();
      
      // Intentar obtener el tiempo de inicio desde localStorage si no está en el estado
      const savedStartTime = localStorage.getItem('exercise_start_time');
      const effectiveStartTime = state.startTime || (savedStartTime ? parseInt(savedStartTime) : null);
      
      const totalTimeSeconds = effectiveStartTime ? Math.floor((now - effectiveStartTime) / 1000) : 0;
      
      console.log("Tiempo total de ejercicio:", totalTimeSeconds, "segundos");
      console.log("Tiempo de inicio (estado):", state.startTime);
      console.log("Tiempo de inicio (localStorage):", savedStartTime);
      console.log("Tiempo de inicio efectivo:", effectiveStartTime);
      console.log("Tiempo actual:", now);
      
      // Actualizar el estado con el tiempo total calculado
      const updatedState = {
        ...state,
        exercisesCompleted: newCompletedState,
        totalTime: totalTimeSeconds
      };
      setState(updatedState);
      
      // Asegurarnos de que el tiempo total se actualice antes de navegar
      console.log("Estado actualizado con tiempo total:", updatedState.totalTime);
      
      // Complete the routine
      try {
        await apiRequest('POST', '/api/progress/complete', { completed: true });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
      
      // Navigate to completion page
      window.location.hash = "#/completion";
    } else {
      // Go to next exercise
      setState({
        ...state,
        currentExercise: state.currentExercise + 1,
        exercisesCompleted: newCompletedState
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

  // Get current exercise data with fallback to prevent errors
  const currentExercise = state.currentExercise >= 0 && state.currentExercise < exercises.length
    ? exercises[state.currentExercise]
    : exercises[0]; // Fallback to first exercise if index is out of bounds

  // Toggle fullscreen mode for video
  const toggleVideoFullscreen = () => {
    setIsVideoFullscreen(!isVideoFullscreen);
    
    if (!isVideoFullscreen) {
      fullscreenHandle.enter();
      // Play video automatically when entering fullscreen
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      fullscreenHandle.exit();
    }
  };
  
  useEffect(() => {
    // Reset fullscreen state when changing exercises
    if (isVideoFullscreen) {
      fullscreenHandle.exit();
      setIsVideoFullscreen(false);
    }
  }, [state.currentExercise, isVideoFullscreen, fullscreenHandle]);
  
  // Auto-start videos when they change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay failed:', err));
    }
    
    // Auto-complete the exercise when navigating to ensure progress tracking
    if (!state.exercisesCompleted[state.currentExercise]) {
      completeExercise();
    }
  }, [state.currentExercise]);
  
  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24" {...swipeHandlers}>
      {/* Header */}
      <header className={`sticky top-0 bg-white shadow-md z-10 ${isVideoFullscreen ? 'hidden' : ''}`}>
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#2196F3]">Rutina de Ejercicios</h1>
          <div className="flex items-center">
            <span className="material-icons text-[#FF9800] text-2xl">fitness_center</span>
          </div>
        </div>
      </header>

      {/* Fullscreen Video Mode */}
      <FullScreen handle={fullscreenHandle}>
        {isVideoFullscreen ? (
          <div className="fullscreen-video-container">
            <video 
              ref={videoRef}
              className="video-fullscreen"
              autoPlay
              loop
              muted
              playsInline
              src={currentExercise?.videoPath}
            >
              Tu navegador no soporta videos HTML5.
            </video>
            
            {/* Exercise indicator */}
            <div className="exercise-indicator">
              {exercises.map((_, index) => (
                <div 
                  key={index} 
                  className={`progress-dot ${state.currentExercise === index ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            
            {/* Swipe indicators */}
            {state.currentExercise > 0 && (
              <div className="swipe-indicator swipe-left">
                <span className="material-icons text-white">arrow_back</span>
              </div>
            )}
            
            {state.currentExercise < exercises.length - 1 && nextButtonEnabled && (
              <div className="swipe-indicator swipe-right">
                <span className="material-icons text-white">arrow_forward</span>
              </div>
            )}
            
            {/* Control buttons */}
            <div className="video-fullscreen-controls">
              <Button
                variant="outline"
                className="bg-white"
                onClick={toggleVideoFullscreen}
              >
                <span className="material-icons">fullscreen_exit</span>
              </Button>
            </div>
          </div>
        ) : null}
      </FullScreen>

      {/* Exercise Container - Compact vertical layout for iPhone */}
      <div className={`container mx-auto px-4 py-2 ${isVideoFullscreen ? 'hidden' : ''}`}>
        {/* Exercise Progress Indicators */}
        <div className="flex justify-between mb-4 px-1">
          {exercises.map((_, index) => (
            <div 
              key={index}
              className={`
                flex items-center justify-center 
                w-10 h-10 rounded-full font-bold text-base
                ${index === state.currentExercise 
                  ? 'bg-[#2196F3] text-white' 
                  : index < state.currentExercise 
                    ? 'bg-[#E3F2FD] text-[#2196F3]' 
                    : 'bg-gray-200 text-gray-600'}
              `}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Current Exercise - Maximized video with vertical layout */}
        <div className="relative mb-2">
          <video 
            ref={videoRef}
            className="w-full h-[70vh] object-cover bg-black rounded-lg"
            autoPlay
            loop
            muted
            playsInline
            poster={currentExercise?.posterUrl || ''}
            src={currentExercise?.videoPath}
            onClick={toggleVideoFullscreen}
          >
            Tu navegador no soporta videos HTML5.
          </video>
          
          {/* Exercise number indicator */}
          <div className="absolute top-2 right-2 bg-[#2196F3] text-white rounded-full px-3 py-1 text-sm font-bold shadow-md">
            {currentExercise?.id || (state.currentExercise + 1)}/5
          </div>
          
          {/* Fullscreen button */}
          <Button 
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
            onClick={toggleVideoFullscreen}
          >
            <span className="material-icons">fullscreen</span>
          </Button>
          
          {/* Exercise title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{currentExercise?.title || `Ejercicio ${state.currentExercise + 1}`}</h2>
              
              {currentExercise?.duration && (
                <div className="flex items-center text-sm">
                  <span className="material-icons text-white mr-1 text-sm">timer</span>
                  <span>{currentExercise.duration}</span>
                </div>
              )}
              
              {currentExercise?.repetitions && !currentExercise?.hasPairCounter && (
                <div className="flex items-center text-sm">
                  <span className="material-icons text-white mr-1 text-sm">repeat</span>
                  <span>{currentExercise.repetitions}x</span>
                </div>
              )}
              
              {currentExercise?.hasPairCounter && (
                <div className="flex items-center text-sm">
                  <span className="material-icons text-white mr-1 text-sm">repeat</span>
                  <span>7x por pierna</span>
                </div>
              )}
            </div>
          </div>
          

        </div>
        

      </div>

      {/* Navigation Footer - Only shown when not in fullscreen */}
      <nav className={`fixed bottom-0 left-0 w-full bg-white shadow-up px-4 py-3 ${isVideoFullscreen ? 'hidden' : ''}`}>
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
