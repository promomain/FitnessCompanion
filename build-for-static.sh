#!/bin/bash

# Colores para mensajes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando la compilación para despliegue estático...${NC}"

# Crear directorio de distribución
mkdir -p static-build/videos

# Asegurarse de que exista el directorio para los videos
echo -e "${YELLOW}📁 Creando estructura de directorios...${NC}"

# Copiar los videos 
echo -e "${YELLOW}🎬 Copiando videos...${NC}"
cp -v attached_assets/video*.mp4 static-build/videos/

# Crear estructura de archivos estáticos
echo -e "${YELLOW}📝 Creando archivos HTML y CSS...${NC}"

# Crear un archivo HTML simple
cat > static-build/index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>Rutina de Ejercicios Diarios</title>
  <meta name="description" content="Aplicación para seguimiento de rutina diaria de ejercicios con videos instructivos, temporizador y contador de repeticiones">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <div id="homePage" class="page active">
      <div class="container">
        <h1>Rutina de Ejercicios Diarios</h1>
        <p class="subtitle">Completa tu rutina diaria en 30 minutos</p>
        
        <div class="stats-container">
          <div class="stat-box">
            <span class="stat-number" id="streak">0</span>
            <span class="stat-label">Días seguidos</span>
          </div>
          <div class="stat-box">
            <span class="stat-label" id="lastCompleted">Nunca completado</span>
            <span class="stat-label">Último ejercicio</span>
          </div>
        </div>
        
        <div class="exercise-list">
          <h2>Ejercicios (5)</h2>
          <ul>
            <li>1. Elíptica 5mn</li>
            <li>2. Caminata ida y vuelta x10</li>
            <li>3. Sentadillas x10</li>
            <li>4. Sentadilla + caminata x5</li>
            <li>5. Parado en un pie con rodilla 90 grados</li>
          </ul>
        </div>
        
        <button id="startButton" class="btn-primary">Comenzar Rutina</button>
      </div>
    </div>
    
    <div id="exercisesPage" class="page">
      <div id="exerciseContainer">
        <div class="exercise-header">
          <h2 id="exerciseTitle">Título del ejercicio</h2>
          <div class="exercise-circles">
            <div class="circle" data-index="0">1</div>
            <div class="circle" data-index="1">2</div>
            <div class="circle" data-index="2">3</div>
            <div class="circle" data-index="3">4</div>
            <div class="circle" data-index="4">5</div>
          </div>
        </div>
        
        <div class="video-container">
          <video id="exerciseVideo" autoplay muted loop playsinline>
            <source src="" type="video/mp4">
          </video>
        </div>
        
        <div class="exercise-description" id="exerciseDescription">
          Descripción del ejercicio
        </div>
        
        <div id="timerContainer" class="hidden">
          <div class="timer">
            <div class="timer-circle">
              <span id="timerValue">5:00</span>
            </div>
          </div>
        </div>
        
        <div id="counterContainer" class="hidden">
          <div class="counter">
            <button id="decreaseButton" class="counter-btn">-</button>
            <div class="counter-value">
              <span id="counterValue">0</span>
              <span id="counterTotal">/10</span>
            </div>
            <button id="increaseButton" class="counter-btn">+</button>
          </div>
        </div>
        
        <div class="nav-buttons">
          <button id="prevButton" class="btn-secondary">Anterior</button>
          <button id="nextButton" class="btn-primary">Siguiente</button>
        </div>
      </div>
    </div>
    
    <div id="completionPage" class="page">
      <div class="container">
        <h1>¡Rutina Completada!</h1>
        
        <div class="completion-stats">
          <div class="time-container">
            <span class="material-icons time-icon">schedule</span>
            <div class="time-text">
              <span class="time-value" id="totalTime">0:00</span>
              <span class="time-label">Tiempo total</span>
            </div>
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-circles">
            <div class="circle completed">1</div>
            <div class="circle completed">2</div>
            <div class="circle completed">3</div>
            <div class="circle completed">4</div>
            <div class="circle completed">5</div>
          </div>
        </div>
        
        <p class="completion-message">¡Excelente trabajo! Has completado todos los ejercicios de hoy.</p>
        
        <button id="restartButton" class="btn-primary">Volver a Empezar</button>
      </div>
    </div>
  </div>
  
  <script src="main.js"></script>
</body>
</html>
EOF

# Crear el archivo CSS
cat > static-build/styles.css << 'EOF'
/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Nunito', sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  color: #2196F3;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

h2 {
  color: #0d47a1;
  font-size: 1.4rem;
  margin: 1rem 0;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  text-align: center;
}

.btn-primary {
  background-color: #2196F3;
  color: white;
  box-shadow: 0 3px 10px rgba(33, 150, 243, 0.3);
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-primary:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
}

.btn-secondary:hover {
  background-color: #d5d5d5;
}

/* Pages */
.page {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.page.active {
  display: block;
}

/* Home page */
.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2196F3;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.exercise-list {
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.exercise-list ul {
  list-style-type: none;
}

.exercise-list li {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.exercise-list li:last-child {
  border-bottom: none;
}

/* Exercise page */
#exerciseContainer {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.exercise-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.exercise-circles {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  font-weight: bold;
  color: white;
}

.circle.active {
  background-color: #2196F3;
}

.circle.completed {
  background-color: #90CAF9;
}

.video-container {
  flex: 1;
  margin: 0 -20px;
  position: relative;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

video {
  width: 100%;
  height: auto;
  max-height: 50vh;
  object-fit: contain;
}

.exercise-description {
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  text-align: center;
}

/* Timer */
.timer {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.timer-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2196F3;
}

/* Counter */
.counter {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.counter-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #2196F3;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.counter-value {
  margin: 0 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

#counterTotal {
  color: #999;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.nav-buttons button {
  flex: 1;
  margin: 0 5px;
}

/* Completion page */
.completion-stats {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.time-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-icon {
  font-size: 2.5rem;
  color: #2196F3;
  margin-right: 1rem;
}

.time-text {
  display: flex;
  flex-direction: column;
}

.time-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2196F3;
}

.time-label {
  color: #666;
}

.progress-container {
  margin: 1.5rem 0;
}

.progress-circles {
  display: flex;
  justify-content: center;
}

.completion-message {
  text-align: center;
  margin: 1.5rem 0;
  font-size: 1.1rem;
  color: #555;
}

#restartButton {
  width: 100%;
  margin-top: auto;
}

/* Utilities */
.hidden {
  display: none;
}
EOF

# Crear el archivo JavaScript
cat > static-build/main.js << 'EOF'
// Datos de ejercicios
const exercises = [
  {
    id: 1,
    title: "Elíptica 5mn",
    description: "Realiza 5 minutos de elíptica a ritmo constante",
    videoPath: "videos/video1.mp4",
    hasTimer: true,
    timerDuration: 300 // 5 minutos en segundos
  },
  {
    id: 2,
    title: "Caminata ida y vuelta x10",
    description: "Camina 10 veces de ida y vuelta",
    videoPath: "videos/video2.mp4",
    hasCounter: true,
    repetitions: 10
  },
  {
    id: 3,
    title: "Sentadillas x10",
    description: "Realiza 10 sentadillas",
    videoPath: "videos/video3.mp4",
    hasCounter: true,
    repetitions: 10
  },
  {
    id: 4,
    title: "Sentadilla + caminata x5",
    description: "Realiza 5 sentadillas seguidas de caminata",
    videoPath: "videos/video4.mp4",
    hasCounter: true,
    repetitions: 5
  },
  {
    id: 5,
    title: "Parado en un pie con rodilla 90 grados",
    description: "Mantén el equilibrio apoyándote en un solo pie",
    videoPath: "videos/video5.mp4",
    hasTimer: true,
    timerDuration: 60 // 1 minuto en segundos
  }
];

// Estado de la aplicación
let state = {
  currentExercise: 0,
  exercisesCompleted: [false, false, false, false, false],
  startTime: null,
  totalTime: 0,
  timerInterval: null,
  counter: 0
};

// Referencias a elementos DOM
const pages = {
  home: document.getElementById('homePage'),
  exercises: document.getElementById('exercisesPage'),
  completion: document.getElementById('completionPage')
};

const elements = {
  // Home page
  streak: document.getElementById('streak'),
  lastCompleted: document.getElementById('lastCompleted'),
  startButton: document.getElementById('startButton'),
  
  // Exercise page
  exerciseTitle: document.getElementById('exerciseTitle'),
  exerciseDescription: document.getElementById('exerciseDescription'),
  exerciseVideo: document.getElementById('exerciseVideo'),
  exerciseCircles: document.querySelectorAll('.circle'),
  timerContainer: document.getElementById('timerContainer'),
  timerValue: document.getElementById('timerValue'),
  counterContainer: document.getElementById('counterContainer'),
  counterValue: document.getElementById('counterValue'),
  counterTotal: document.getElementById('counterTotal'),
  prevButton: document.getElementById('prevButton'),
  nextButton: document.getElementById('nextButton'),
  decreaseButton: document.getElementById('decreaseButton'),
  increaseButton: document.getElementById('increaseButton'),
  
  // Completion page
  totalTime: document.getElementById('totalTime'),
  restartButton: document.getElementById('restartButton')
};

// Inicialización
function init() {
  loadProgress();
  initEventListeners();
  updateUI();
}

// Cargar progreso desde localStorage
function loadProgress() {
  const savedProgress = localStorage.getItem('exercise_progress');
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    elements.streak.textContent = progress.streak || 0;
    elements.lastCompleted.textContent = progress.lastCompleted || 'Nunca completado';
  }
  
  // Obtener el tiempo de inicio guardado
  const savedStartTime = localStorage.getItem('exercise_start_time');
  state.startTime = savedStartTime ? parseInt(savedStartTime) : null;
}

// Inicializar event listeners
function initEventListeners() {
  // Home page
  elements.startButton.addEventListener('click', startRoutine);
  
  // Exercise page
  elements.prevButton.addEventListener('click', goToPreviousExercise);
  elements.nextButton.addEventListener('click', goToNextExercise);
  elements.decreaseButton.addEventListener('click', decreaseCounter);
  elements.increaseButton.addEventListener('click', increaseCounter);
  
  // Completion page
  elements.restartButton.addEventListener('click', restartRoutine);
}

// Navegar entre páginas
function showPage(pageId) {
  Object.values(pages).forEach(page => page.classList.remove('active'));
  pages[pageId].classList.add('active');
}

// Iniciar rutina
function startRoutine() {
  if (!state.startTime) {
    state.startTime = Date.now();
    localStorage.setItem('exercise_start_time', state.startTime.toString());
  }
  
  state.currentExercise = 0;
  state.exercisesCompleted = [false, false, false, false, false];
  
  showExercise(0);
  showPage('exercises');
}

// Mostrar ejercicio actual
function showExercise(index) {
  if (index < 0 || index >= exercises.length) return;
  
  const exercise = exercises[index];
  state.currentExercise = index;
  
  // Actualizar UI
  elements.exerciseTitle.textContent = exercise.title;
  elements.exerciseDescription.textContent = exercise.description;
  elements.exerciseVideo.src = exercise.videoPath;
  elements.exerciseVideo.load();
  
  // Actualizar círculos de progreso
  elements.exerciseCircles.forEach((circle, i) => {
    circle.classList.remove('active', 'completed');
    if (i < index) {
      circle.classList.add('completed');
    } else if (i === index) {
      circle.classList.add('active');
    }
  });
  
  // Configurar timer o contador
  setupExerciseControls(exercise);
  
  // Actualizar botones de navegación
  elements.prevButton.disabled = index === 0;
  elements.nextButton.textContent = index === exercises.length - 1 ? 'Finalizar' : 'Siguiente';
}

// Configurar controles de ejercicio (timer o contador)
function setupExerciseControls(exercise) {
  // Resetear y ocultar todos los controles
  clearInterval(state.timerInterval);
  elements.timerContainer.classList.add('hidden');
  elements.counterContainer.classList.add('hidden');
  
  // Configurar timer
  if (exercise.hasTimer) {
    elements.timerContainer.classList.remove('hidden');
    let remainingTime = exercise.timerDuration;
    updateTimerDisplay(remainingTime);
    
    state.timerInterval = setInterval(() => {
      remainingTime--;
      updateTimerDisplay(remainingTime);
      
      if (remainingTime <= 0) {
        clearInterval(state.timerInterval);
        elements.nextButton.classList.add('pulse');
      }
    }, 1000);
  }
  
  // Configurar contador
  if (exercise.hasCounter) {
    elements.counterContainer.classList.remove('hidden');
    state.counter = 0;
    elements.counterValue.textContent = state.counter;
    elements.counterTotal.textContent = `/${exercise.repetitions}`;
  }
}

// Actualizar display del timer
function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  elements.timerValue.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Incrementar contador
function increaseCounter() {
  const exercise = exercises[state.currentExercise];
  if (state.counter < exercise.repetitions) {
    state.counter++;
    elements.counterValue.textContent = state.counter;
    
    if (state.counter === exercise.repetitions) {
      elements.nextButton.classList.add('pulse');
    }
  }
}

// Decrementar contador
function decreaseCounter() {
  if (state.counter > 0) {
    state.counter--;
    elements.counterValue.textContent = state.counter;
    elements.nextButton.classList.remove('pulse');
  }
}

// Ir al ejercicio anterior
function goToPreviousExercise() {
  if (state.currentExercise > 0) {
    showExercise(state.currentExercise - 1);
  }
}

// Ir al siguiente ejercicio
function goToNextExercise() {
  // Marcar el ejercicio actual como completado
  state.exercisesCompleted[state.currentExercise] = true;
  
  // Si es el último ejercicio, ir a la página de finalización
  if (state.currentExercise === exercises.length - 1) {
    completeRoutine();
  } else {
    // Ir al siguiente ejercicio
    showExercise(state.currentExercise + 1);
  }
}

// Completar rutina
function completeRoutine() {
  // Calcular tiempo total
  const endTime = Date.now();
  const totalSeconds = Math.floor((endTime - state.startTime) / 1000);
  state.totalTime = totalSeconds;
  
  // Actualizar estadísticas
  updateStats();
  
  // Mostrar tiempo total
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  elements.totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Ir a la página de finalización
  showPage('completion');
}

// Actualizar estadísticas
function updateStats() {
  // Obtener estadísticas actuales
  const savedProgress = localStorage.getItem('exercise_progress');
  let progress = savedProgress ? JSON.parse(savedProgress) : { streak: 0, lastCompleted: null };
  
  // Verificar si ya completó hoy
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
  
  if (progress.lastCompleted !== today) {
    // Si completó ayer, aumentar racha
    if (progress.lastCompleted === yesterday) {
      progress.streak++;
    } else {
      // Reiniciar racha si no fue ayer
      progress.streak = 1;
    }
    
    progress.lastCompleted = 'Hoy';
    
    // Guardar progreso
    localStorage.setItem('exercise_progress', JSON.stringify(progress));
  }
}

// Reiniciar rutina
function restartRoutine() {
  // Limpiar tiempo de inicio
  localStorage.removeItem('exercise_start_time');
  state.startTime = null;
  
  // Volver a la página inicial
  showPage('home');
  updateUI();
}

// Actualizar interfaz
function updateUI() {
  loadProgress();
}

// Inicializar aplicación
init();
EOF

echo -e "${GREEN}✅ Compilación completada. Los archivos estáticos están en la carpeta 'static-build'${NC}"
echo -e "${YELLOW}📱 Esta versión es totalmente estática y puede desplegarse en cualquier servidor web:${NC}"
echo -e "   - GitHub Pages"
echo -e "   - Netlify"
echo -e "   - Vercel"
echo -e "   - O cualquier hosting de archivos estáticos"
echo -e ""
echo -e "${BLUE}📝 Instrucciones para GitHub Pages:${NC}"
echo -e "1. Sube todo el contenido de la carpeta 'static-build' a tu repositorio de GitHub"
echo -e "2. Configura GitHub Pages para usar la rama principal y la carpeta raíz"
echo -e "3. Tu aplicación estará disponible en https://TU_USUARIO.github.io/TU_REPOSITORIO"