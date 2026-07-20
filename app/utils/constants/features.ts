
export interface ProblemItem {
  id: string;
  title: string;
  pain: string;
  consequence: string;
  imgSrc: string;
}

export const problems: ProblemItem[] = [
  {
    id: 'deberes',
    title: '“Hizo los deberes, pero ¿realmente lo entendió?”',
    pain: 'No siempre sabes si tu hijo avanzó o solo copió las respuestas de forma mecánica para terminar rápido.',
    consequence: 'Al final, las dudas acumuladas reaparecen en los exámenes, cuando ya es tarde para corregirlas.',
    imgSrc: '/img/img1.webp',
  },
  {
    id: 'ritmo',
    title: '“En clase van todos al mismo ritmo. Menos él.”',
    pain: 'Cada niño tiene su propia velocidad. La educación tradicional no puede esperarlos o dar atención personalizada a todos.',
    consequence: 'Esto causa que algunos se aburran esperando y otros se rindan por sentirse rezagados.',
    imgSrc: '/img/img2.webp',
  },
  {
    id: 'wifi',
    title: '“Las mejores apps dejan de funcionar sin wifi.”',
    pain: 'Y justo cuando más las necesitas — en un trayecto, de viaje o en zonas con poca señal — se quedan en blanco.',
    consequence: 'Un límite innecesario que interrumpe momentos valiosos de concentración o curiosidad.',
    imgSrc: '/img/img3.webp',
  },
];
