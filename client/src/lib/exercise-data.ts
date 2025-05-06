export interface Exercise {
  id: number;
  title: string;
  description: string;
  duration?: string;
  repetitions?: number;
  videoPath: string;
  posterUrl: string;
  hasTimer?: boolean;
  hasCounter?: boolean;
  hasPairCounter?: boolean;
}

export const exercises: Exercise[] = [
  {
    id: 1,
    title: "Elíptica",
    description: "Realiza 5 minutos de ejercicio en la elíptica a un ritmo moderado.",
    duration: "5 minutos",
    videoPath: "/attached_assets/video1.mp4",
    posterUrl: "https://images.pexels.com/photos/4327011/pexels-photo-4327011.jpeg?auto=compress&cs=tinysrgb&w=800",
    hasTimer: true
  },
  {
    id: 2,
    title: "Caminata ida y vuelta",
    description: "Camina de un extremo a otro 10 veces. Mantén la espalda recta y un paso firme.",
    repetitions: 10,
    videoPath: "/attached_assets/video2.mp4",
    posterUrl: "https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&cs=tinysrgb&w=800",
    hasCounter: true
  },
  {
    id: 3,
    title: "Sentadillas",
    description: "Realiza 10 sentadillas manteniendo la espalda recta y sin que las rodillas sobrepasen la punta de los pies.",
    repetitions: 10,
    videoPath: "/attached_assets/video3.mp4",
    posterUrl: "https://images.pexels.com/photos/6456303/pexels-photo-6456303.jpeg?auto=compress&cs=tinysrgb&w=800",
    hasCounter: true
  },
  {
    id: 4,
    title: "Sentadilla + Caminata",
    description: "Realiza una sentadilla y luego camina hacia adelante. Repite 5 veces el ejercicio completo.",
    repetitions: 5,
    videoPath: "/attached_assets/video4.mp4",
    posterUrl: "https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=800",
    hasCounter: true
  },
  {
    id: 5,
    title: "Parado en un pie",
    description: "Mantente parado en un pie con la rodilla a 90 grados. Repite 7 veces por cada pierna.",
    repetitions: 7,
    videoPath: "/attached_assets/video5.mp4",
    posterUrl: "https://images.pexels.com/photos/6111618/pexels-photo-6111618.jpeg?auto=compress&cs=tinysrgb&w=800",
    hasPairCounter: true
  }
];
