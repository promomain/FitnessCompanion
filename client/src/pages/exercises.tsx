import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerCircle } from "@/components/ui/timer-circle";
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

  // Update button states based on current exercise and progress
  const [completeButtonEnabled, setCompleteButtonEnabled] = useState(false);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);
  
  // Set up swipe handlers for navigation between exercises
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (state.currentExercise < exercises.length - 1 && nextButtonEnabled) {
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

  // Update exercise completion status
  const completeExercise = async () => {
    const newCompletedState = [...state.exercisesCompleted];
    newCompletedState[state.currentExercise] = true;
    
    // Record the time spent on this exercise
    const now = Date.now();
    const newExerciseTimes = [...state.exerciseTimes];
    const startTime = state.exerciseStartTimes[state.currentExercise] || 
                      state.exerciseStartTimes[Math.max(0, state.currentExercise - 1)] || 
                      now;
    
    // Calculate time spent in seconds
    const timeSpent = Math.floor((now - startTime) / 1000);
    newExerciseTimes[state.currentExercise] = timeSpent;
    
    setState({
      ...state,
      exercisesCompleted: newCompletedState,
      exerciseTimes: newExerciseTimes
    });
    
    setNextButtonEnabled(true);
  };

  // Navigate to the next or previous exercise
  const goToNextExercise = async () => {
    // Check if all exercises are completed
    const allCompleted = state.exercisesCompleted.every(status => status);
    
    if (state.currentExercise === exercises.length - 1 && allCompleted) {
      // Make sure we record time for the last exercise
      const now = Date.now();
      const newExerciseTimes = [...state.exerciseTimes];
      const startTime = state.exerciseStartTimes[state.currentExercise] || now;
      const timeSpent = Math.floor((now - startTime) / 1000);
      newExerciseTimes[state.currentExercise] = timeSpent;
      
      // Update state with final times
      setState({
        ...state,
        exerciseTimes: newExerciseTimes
      });
      
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
  
  // Update next button state - always enabled to allow skipping exercises
  useEffect(() => {
    // Next button is always enabled to allow skipping 
    setNextButtonEnabled(true);
    
    // Auto-complete the exercise when navigating to ensure progress tracking
    if (!state.exercisesCompleted[state.currentExercise]) {
      completeExercise();
    }
  }, [state.currentExercise]);

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
  
  // Auto-start videos when they change and track exercise time
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay failed:', err));
    }
    
    // Set start time for the current exercise
    const now = Date.now();
    const newExerciseStartTimes = [...state.exerciseStartTimes];
    newExerciseStartTimes[state.currentExercise] = now;
    
    setState({
      ...state,
      exerciseStartTimes: newExerciseStartTimes
    });
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
              src={currentExercise.videoPath}
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
        {/* Progress Bar */}
        <div className="mb-2">
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

        {/* Current Exercise - Maximized video with vertical layout */}
        <div className="relative mb-2">
          <video 
            ref={videoRef}
            className="w-full h-[70vh] object-cover bg-black rounded-lg"
            autoPlay
            loop
            muted
            playsInline
            poster={currentExercise.posterUrl || ''}
            src={currentExercise.videoPath}
            onClick={toggleVideoFullscreen}
          >
            Tu navegador no soporta videos HTML5.
          </video>
          
          {/* Exercise number indicator */}
          <div className="absolute top-2 right-2 bg-[#2196F3] text-white rounded-full px-3 py-1 text-sm font-bold shadow-md">
            {currentExercise.id}/5
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
              <h2 className="text-xl font-bold">{currentExercise.title}</h2>
              
              {currentExercise.duration && (
                <div className="flex items-center text-sm">
                  <span className="material-icons text-white mr-1 text-sm">timer</span>
                  <span>{currentExercise.duration}</span>
                </div>
              )}
              
              {currentExercise.repetitions && !currentExercise.hasPairCounter && (
                <div className="flex items-center text-sm">
                  <span className="material-icons text-white mr-1 text-sm">repeat</span>
                  <span>{currentExercise.repetitions}x</span>
                </div>
              )}
              
              {currentExercise.hasPairCounter && (
                <div className="flex items-center text-sm">
                  <span className="material-icons text-white mr-1 text-sm">repeat</span>
                  <span>7x por pierna</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Timer overlay for exercise 1 */}
          {currentExercise.hasTimer && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <TimerCircle 
                seconds={state.remainingTime}
                running={state.timerRunning}
                onComplete={handleTimerComplete}
                onTick={handleTimerTick}
              />
            </div>
          )}
          
          {/* Start timer button overlay for exercise 1 */}
          {currentExercise.hasTimer && !state.timerRunning && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <Button
                className="min-h-[48px] bg-[#2196F3] rounded-full text-white text-lg font-bold py-2 px-4 flex items-center justify-center"
                onClick={startTimer}
                disabled={state.timerRunning}
              >
                <span className="material-icons mr-2">play_arrow</span>
                Iniciar
              </Button>
            </div>
          )}
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
