import { Brain, BookOpen, TrendingUp } from 'lucide-react';

export interface Step {
  stepNumber: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  pillBg: string;
  borderColor: string;
}

export const STEPS: Step[] = [
  {
    stepNumber: 1,
    icon: Brain,
    iconBg: 'bg-amauta-blue-light',
    iconColor: 'text-amauta-blue',
    pillBg: 'bg-amauta-blue-light/50',
    borderColor: 'border-l-amauta-blue-light',
  },
  {
    stepNumber: 2,
    icon: BookOpen,
    iconBg: 'bg-amauta-orange-light',
    iconColor: 'text-amauta-orange-dark',
    pillBg: 'bg-amauta-orange-light/50',
    borderColor: 'border-l-amauta-orange-light',
  },
  {
    stepNumber: 3,
    icon: TrendingUp,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    pillBg: 'bg-emerald-50',
    borderColor: 'border-l-emerald-200',
  },
];