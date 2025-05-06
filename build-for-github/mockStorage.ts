// Modelo de datos simulado para la versión de GitHub Pages (sin backend)
import { exercises } from '../client/src/lib/exercise-data';

// Para almacenar datos localmente
const STORAGE_KEY = 'exercise-app-data';

// Función para guardar datos en localStorage
export function saveLocalData(data: any): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando datos locales:', error);
  }
}

// Función para obtener datos de localStorage
export function getLocalData(): any {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error obteniendo datos locales:', error);
    return null;
  }
}

// Función para inicializar datos si no existen
export function initializeLocalData(): void {
  const existingData = getLocalData();
  if (!existingData) {
    const initialData = {
      streak: 0,
      lastCompleted: null,
      history: []
    };
    saveLocalData(initialData);
  }
}

// Función para marcar rutina como completada
export function completeRoutine(): void {
  const data = getLocalData() || { streak: 0, lastCompleted: null, history: [] };
  const today = new Date().toISOString().split('T')[0];
  
  // Actualizar racha solo si el último día completado no es hoy
  if (data.lastCompleted !== today) {
    data.streak += 1;
    data.lastCompleted = today;
    data.history.push({
      date: today,
      exercises: exercises.map(e => e.title)
    });
    
    saveLocalData(data);
  }
}

// Función para obtener el progreso
export function getProgress(): { streak: number, lastCompleted: string | null } {
  const data = getLocalData() || { streak: 0, lastCompleted: null };
  
  // Formatear "lastCompleted" de manera amigable
  let lastCompletedText = null;
  if (data.lastCompleted) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (data.lastCompleted === today) {
      lastCompletedText = 'Hoy';
    } else if (data.lastCompleted === yesterday) {
      lastCompletedText = 'Ayer';
    } else {
      // Convertir a formato de fecha legible
      const dateParts = data.lastCompleted.split('-');
      lastCompletedText = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
  }
  
  return {
    streak: data.streak,
    lastCompleted: lastCompletedText
  };
}

// Inicializar datos al cargar
initializeLocalData();