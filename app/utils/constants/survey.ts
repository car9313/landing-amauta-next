export interface SurveyStats {
  total: number
  loveIt: number
  interested: number
  unsure: number
  prefMascot: number
  prefGames: number
  prefDashboard: number
  prefOffline: number
}

export const EMPTY_STATS: SurveyStats = {
  total: 0,
  loveIt: 0,
  interested: 0,
  unsure: 0,
  prefMascot: 0,
  prefGames: 0,
  prefDashboard: 0,
  prefOffline: 0,
}

export const FEATURE_LABELS: Record<string, string> = {
  prefMascot: 'la compañía de la mascota Amauta',
  prefGames: 'las mecánicas de juegos andinos interactivos',
  prefDashboard: 'el panel de logros para padres',
  prefOffline: 'el modo offline completo',
}

export const FEATURE_EMOJIS: Record<string, string> = {
  prefMascot: '🦉',
  prefGames: '🎮',
  prefDashboard: '📈',
  prefOffline: '🎒',
}

export interface InterestOption {
  value: 'high' | 'medium' | 'low'
  emoji: string
  label: string
  subtitle: string
}

export const INTEREST_OPTIONS: InterestOption[] = [
  {
    value: 'high',
    emoji: '😍',
    label: '¡Me encanta!',
    subtitle: 'Lo usaría sin dudar',
  },
  {
    value: 'medium',
    emoji: '🙂',
    label: 'Me interesa',
    subtitle: 'Me gustaría probarlo',
  },
  {
    value: 'low',
    emoji: '😐',
    label: 'Aún no sé',
    subtitle: 'Tengo ciertas dudas',
  },
]

export interface FeatureOption {
  id: 'mascot' | 'games' | 'dashboard' | 'offline'
  emoji: string
  title: string
  desc: string
}

export const FEATURES: FeatureOption[] = [
  {
    id: 'mascot',
    emoji: '🦉',
    title: 'La mascota Amauta',
    desc: 'Cóndor que guía y reacciona de forma lúdica',
  },
  {
    id: 'games',
    emoji: '🎮',
    title: 'Mini Retos interactivos',
    desc: 'Desafíos lúdicos basados en la cosmovisión andina',
  },
  {
    id: 'dashboard',
    emoji: '📈',
    title: 'Panel de Logros para padres',
    desc: 'Monitoreo de destrezas mediante medallas reales',
  },
  {
    id: 'offline',
    emoji: '🎒',
    title: 'Modo Offline Completo',
    desc: 'Funciona seguro en viajes sin consumir tus datos',
  },
]
