import { Compass, Target, LineChart } from 'lucide-react';

export interface Step {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  borderColorClass: string;
  imageCaption: string;
  imageAlt: string;
  imageSrc: string;
  imageMotionClass: string;
}

export const STEPS: Step[] = [
  {
    stepNumber: 1,
    title: 'Tu hijo juega y practica',
    subtitle: 'Ejercicios interactivos adaptados a su edad',
    description:
      'Nada de fichas aburridas — lecciones que parecen un juego interactivo pensado especialmente para captar su atención.',
    icon: Compass,
    borderColorClass: 'border-l-amauta-orange-light',
    imageCaption: 'Modo juego',
    imageAlt:
      'La mascota de Amauta acompañando a un niño mientras practica con una tableta en un entorno divertido y educativo',
    imageSrc: '/img/line1.webp',
    imageMotionClass: 'animate-float-soft',
  },
  {
    stepNumber: 2,
    title: 'Amauta aprende cómo aprende él',
    subtitle: 'La app se calibra paso a paso de forma natural',
    description:
      'Cada respuesta le dice a Amauta qué sabe, qué le cuesta y qué necesita repasar. El siguiente ejercicio siempre es el adecuado.',
    icon: Target,
    borderColorClass: 'border-l-amauta-blue-light',
    imageCaption: 'Adaptación inteligente',
    imageAlt:
      'La mascota de Amauta analizando resultados con gráficos suaves, rutas de aprendizaje y una expresión pensativa',
    imageSrc: '/img/line2.webp',
    imageMotionClass: 'animate-float-slow',
  },
  {
    stepNumber: 3,
    title: 'Tú ves su progreso real',
    subtitle: 'Monitorea con total tranquilidad y cercanía',
    description:
      'No una nota. No un porcentaje genérico. Sabes exactamente en qué está avanzando y dónde necesita más práctica.',
    icon: LineChart,
    borderColorClass: 'border-l-emerald-200',
    imageCaption: 'Progreso visible',
    imageAlt:
      'La mascota de Amauta mostrando un panel de progreso con gráficos ascendentes, medallas y estados de avance',
    imageSrc: '/img/line3.webp',
    imageMotionClass: 'animate-float-soft-alt',
  },
];