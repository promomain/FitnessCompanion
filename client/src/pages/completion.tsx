import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exercises } from "@/lib/exercise-data";

interface CompletionProps {
  resetState: () => void;
  totalTime: number;
  startTime: number | null;
}

export default function Completion({ resetState, totalTime, startTime }: CompletionProps) {
  // Use the provided total time or calculate it from start time if available
  const totalTimeSeconds = totalTime || (startTime ? Math.floor((Date.now() - startTime) / 1000) : 0);
  
  // Format time helper function
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} segundos`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 
      ? `${minutes} minuto${minutes > 1 ? 's' : ''} y ${remainingSeconds} segundo${remainingSeconds > 1 ? 's' : ''}`
      : `${minutes} minuto${minutes > 1 ? 's' : ''}`;
  };
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2196F3]">Rutina de Ejercicios</h1>
          <div className="flex items-center">
            <span className="material-icons text-[#FF9800] text-3xl">fitness_center</span>
          </div>
        </div>
      </header>

      {/* Completion Content */}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white rounded-xl shadow-md p-6 text-center mb-6">
          <CardContent className="p-0">
            <div className="mb-6">
              <span className="material-icons text-6xl text-[#4CAF50]">check_circle</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">¡Felicidades!</h2>
            <p className="text-xl mb-6">Has completado tu rutina diaria de ejercicios.</p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="text-xl font-bold mb-2">Resumen</h3>
              
              {/* Total time */}
              <div className="mb-4 text-center py-2 bg-[#E3F2FD] rounded-lg border border-[#BBDEFB]">
                <p className="font-bold text-[#1565C0]">
                  <span className="material-icons align-middle mr-1">schedule</span>
                  Tiempo total: {formatTime(totalTimeSeconds)}
                </p>
              </div>
              
              <ul className="text-left space-y-3">
                {exercises.map((exercise, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-[#4CAF50] mr-2 mt-0.5">check_circle</span>
                    <div>
                      <div className="font-medium">{exercise.title}</div>
                      <div className="text-sm flex flex-wrap gap-2">
                        {exercise.duration && (
                          <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-full text-xs">
                            <span className="material-icons text-xs align-middle mr-1">timer</span>
                            {exercise.duration}
                          </span>
                        )}
                        {exercise.repetitions && (
                          <span className="bg-[#FFF8E1] text-[#F57F17] px-2 py-1 rounded-full text-xs">
                            <span className="material-icons text-xs align-middle mr-1">repeat</span>
                            {exercise.repetitions}x
                          </span>
                        )}

                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href="/">
              <Button 
                className="w-full min-h-[56px] bg-[#2196F3] rounded-full text-white text-lg font-bold py-4 px-6 flex items-center justify-center"
                onClick={resetState}
              >
                <span className="material-icons mr-2">home</span>
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
