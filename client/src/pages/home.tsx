import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/progress'],
    staleTime: 60000, // 1 minute
  });

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

      {/* Welcome Screen */}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white rounded-xl shadow-md p-6 mb-6">
          <CardContent className="p-0">
            <h2 className="text-3xl font-bold mb-4">¡Hola!</h2>
            <p className="text-xl mb-6">
              Bienvenido a tu rutina diaria de ejercicio. Completa estos 5 ejercicios para mantenerte en forma.
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Tu rutina de hoy:</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-3">check_circle_outline</span>
                  <span className="text-lg">1. Elíptica 5 minutos</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-3">check_circle_outline</span>
                  <span className="text-lg">2. Caminata ida y vuelta x10</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-3">check_circle_outline</span>
                  <span className="text-lg">3. Sentadillas x10</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-3">check_circle_outline</span>
                  <span className="text-lg">4. Sentadilla + caminata x5</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-3">check_circle_outline</span>
                  <span className="text-lg">5. Parado en un pie x7 (cada pierna)</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col">
              <Link href="/exercises">
                <button 
                  className="min-h-[56px] rounded-full bg-[#2196F3] text-white text-xl font-bold py-4 px-6 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <span className="material-icons mr-2">play_arrow</span>
                  Comenzar Rutina
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
