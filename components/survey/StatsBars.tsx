import { motion } from 'motion/react'
import { BarChart2, Heart, ThumbsUp } from 'lucide-react'
import { SurveyStats, FEATURE_LABELS, FEATURE_EMOJIS } from '@/app/utils/constants/survey'

interface StatsBarsProps {
  stats: SurveyStats
}

export function StatsBars({ stats }: StatsBarsProps) {
  const totalVotes = stats.total
  const lovePct = totalVotes > 0 ? Math.round((stats.loveIt / totalVotes) * 100) : 0
  const interestPct = totalVotes > 0 ? Math.round((stats.interested / totalVotes) * 100) : 0
  const unsurePct = totalVotes > 0 ? Math.round((stats.unsure / totalVotes) * 100) : 0

  const sortedFeatures = Object.entries(FEATURE_LABELS)
    .map(([key, label]) => ({ key, label, count: stats[key as keyof SurveyStats] as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)

  return (
    <motion.div
      key="survey-results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Thank status */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-success/15 border border-success text-success rounded-full flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-amauta-blue-dark">
            ¡Tu opinion cuenta, gracias! 🧭🦉
          </h4>
          <p className="text-sm font-semibold text-foreground/50">
            Ya contabilizamos tu respuesta. Mira los consolidados de las familias encuestadas.
          </p>
        </div>
      </div>

      {/* Animated Poll Stats */}
      <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 font-mono text-[10px] font-black uppercase tracking-widest text-amauta-blue">
          <BarChart2 className="w-4 h-4 text-amauta-orange" />
          <span>Estadísticas de la Comunidad — {totalVotes} familias encuestadas</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs sm:text-sm font-bold">
            <span className="text-amauta-blue-dark flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amauta-orange fill-amauta-orange" />
              <span>¡Me encanta! Definitivamente lo usaría</span>
            </span>
            <span className="text-amauta-orange-dark font-mono font-black">{lovePct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lovePct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-amauta-orange to-amauta-orange-dark h-full rounded-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs sm:text-sm font-bold">
            <span className="text-amauta-blue-dark flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-amauta-blue fill-amauta-blue" />
              <span>Me interesa, deseamos probarlo gratis</span>
            </span>
            <span className="text-amauta-blue font-mono font-black">{interestPct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${interestPct}%` }}
              transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-amauta-blue to-amauta-blue-dark h-full rounded-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs sm:text-sm font-bold">
            <span className="text-amauta-blue-dark flex items-center gap-1.5">
              <span>😐</span>
              <span>Aún no estoy seguro, tengo mis dudas</span>
            </span>
            <span className="text-foreground/40 font-mono font-black">{unsurePct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${unsurePct}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="bg-neutral-300 h-full rounded-full"
            />
          </div>
        </div>

        {sortedFeatures.length > 0 && (
          <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-foreground/50">
            {sortedFeatures.map(({ key, label, count }) => {
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
              return (
                <div key={key}>
                  {FEATURE_EMOJIS[key]} El{' '}
                  <span className="text-amauta-blue-dark font-black">{pct}%</span> destaca {label}.
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-foreground/50 italic leading-relaxed">
          ¿Te gustó la idea? Asegura su cupo de regalo ingresando los datos en la sección de matrícula que viene a
          continuación.
        </p>
      </div>
    </motion.div>
  )
}
