export interface Exercise {
  id: number;
  title: string;
  description: string;
  duration?: string;
  repetitions?: number;
  videoPath: string;
  posterUrl?: string;
  hasTimer?: boolean;
  hasCounter?: boolean;
  hasPairCounter?: boolean;
}

export const exercises: Exercise[] = [
  {
    id: 1,
    title: "Elíptica 5mn",
    description: "Realiza 5 minutos de ejercicio en la elíptica a un ritmo moderado.",
    duration: "5 minutos",
    videoPath: "/attached_assets/video1.mp4",
    posterUrl: "/attached_assets/video1.mp4",
    hasTimer: true
  },
  {
    id: 2,
    title: "Caminata ida y vuelta x10",
    description: "Camina de un extremo a otro 10 veces. Mantén la espalda recta y un paso firme.",
    repetitions: 10,
    videoPath: "/attached_assets/video2.mp4",
    posterUrl: "/attached_assets/video2.mp4",
    hasCounter: true
  },
  {
    id: 3,
    title: "Sentadillas x10",
    description: "Realiza 10 sentadillas manteniendo la espalda recta y sin que las rodillas sobrepasen la punta de los pies.",
    repetitions: 10,
    videoPath: "/attached_assets/video3.mp4",
    posterUrl: "/attached_assets/video3.mp4",
    hasCounter: true
  },
  {
    id: 4,
    title: "Sentadilla + caminata x5",
    description: "Realiza una sentadilla y luego camina hacia adelante. Repite 5 veces el ejercicio completo.",
    repetitions: 5,
    videoPath: "/attached_assets/video4.mp4",
    posterUrl: "/attached_assets/video4.mp4",
    hasCounter: true
  },
  {
    id: 5,
    title: "Parado en un pie con rodilla 90 grados",
    description: "Mantente parado en un pie con la rodilla a 90 grados. Repite 7 veces por cada pierna.",
    repetitions: 7,
    videoPath: "/attached_assets/video5.mp4",
    posterUrl: "/attached_assets/video5.mp4",
    hasPairCounter: true
  }
];
