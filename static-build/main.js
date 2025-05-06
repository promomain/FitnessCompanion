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
