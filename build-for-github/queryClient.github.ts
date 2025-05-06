import { QueryClient } from "@tanstack/react-query";
import { completeRoutine, getProgress } from './mockStorage';

// Manejar solicitudes de API para la versión de GitHub Pages
export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<any> {
  console.log(`Solicitud local: ${method} ${path}`);
  
  // Simular latencia
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Manejar diferentes rutas
  if (path === '/api/progress' && method === 'GET') {
    return getProgress();
  }
  
  if (path === '/api/progress/complete' && method === 'POST') {
    completeRoutine();
    return { success: true };
  }
  
  // Ruta no manejada
  console.warn(`Ruta no manejada: ${method} ${path}`);
  return null;
}

// Funciones para el queryClient
export const getQueryFn = <T>() => {
  return async ({ queryKey }: { queryKey: string[] }): Promise<T> => {
    const [path, ...params] = queryKey;
    return apiRequest('GET', path);
  };
};

// Crear el queryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});