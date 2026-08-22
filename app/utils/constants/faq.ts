export interface FAQItem {
    id: string
    question: string
    answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
    /*{
      id: 'edad',
      question: '¿Para qué edad está pensado Amauta?',
      answer:
        'Recomendado para niños de 6 a 12 años (primaria). Los contenidos y retos están diseñados para ese rango, adaptándose al ritmo de cada niño.',
    },
    {
      id: 'reemplazo',
      question: '¿Amauta reemplaza al colegio o al profesor?',
      answer:
        'No. Amauta es un complemento. Ayuda a reforzar lo aprendido en clase mediante retos divertidos, pero no sustituye la educación formal ni la guía de un docente.',
    },
    {
      id: 'dispositivos',
      question: '¿En qué dispositivos funciona?',
      answer:
        'En cualquier dispositivo con navegador web: computadoras, tablets y celulares. Además, al instalarse como app (PWA), funciona sin conexión a internet.',
    },*/
    {
        id: 'supervision',
        question: '¿Qué pasa si mi hijo lo usa sin supervisión?',
        answer:
            'La app está diseñada para que el niño juegue de forma autónoma. Tú recibes reportes de su progreso sin necesidad de estar al lado. No hay acceso a internet externo ni contenido generado por otros usuarios.',
    },
    {
        id: 'privacidad',
        question: '¿Mis datos y los de mi hijo están seguros?',
        answer:
            'Sí. No recopilamos, compartimos ni vendemos datos de menores. Todo el progreso se almacena localmente en el dispositivo. Puedes ver los detalles en nuestra Política de Privacidad.',
    },
    {
        id: 'pago',
        question: '¿Voy a tener que pagar después del acceso anticipado?',
        answer:
            'Durante el acceso anticipado todo es gratuito. Cuando definamos el modelo definitivo, te avisaremos con tiempo y tendrás beneficios por haber estado desde el inicio. No hay cargos sorpresa.',
    },
]
