import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CompletionProps {
  resetState: () => void;
}

export default function Completion({ resetState }: CompletionProps) {
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
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <span className="material-icons text-[#4CAF50] mr-2">check_circle</span>
                  <span>Elíptica: 5 minutos</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-[#4CAF50] mr-2">check_circle</span>
                  <span>Caminata ida y vuelta: 10 repeticiones</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-[#4CAF50] mr-2">check_circle</span>
                  <span>Sentadillas: 10 repeticiones</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-[#4CAF50] mr-2">check_circle</span>
                  <span>Sentadilla + caminata: 5 repeticiones</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-[#4CAF50] mr-2">check_circle</span>
                  <span>Parado en un pie: 7 repeticiones por pierna</span>
                </li>
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
