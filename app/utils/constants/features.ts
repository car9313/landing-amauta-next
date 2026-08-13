export interface ProblemItem {
  id: string;
  labelColor: string;
  imgSrc: string;
  accentBorder: string;
  bulletColor: string;
}

export const problems: ProblemItem[] = [
  {
    id: 'deberes',
    labelColor: 'text-rose-600',
    imgSrc: '/img/img1.webp',
    accentBorder: 'border-t-rose-400',
    bulletColor: 'text-rose-400',
  },
  {
    id: 'ritmo',
    labelColor: 'text-amber-600',
    imgSrc: '/img/img2.webp',
    accentBorder: 'border-t-amber-400',
    bulletColor: 'text-amber-400',
  },
  {
    id: 'wifi',
    labelColor: 'text-amauta-blue',
    imgSrc: '/img/img3.webp',
    accentBorder: 'border-t-amauta-blue-light',
    bulletColor: 'text-amauta-blue',
  },
];