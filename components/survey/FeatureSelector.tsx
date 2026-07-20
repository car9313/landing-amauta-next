import { FEATURES } from '@/app/utils/constants/survey'

interface FeatureSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function FeatureSelector({ value, onChange }: FeatureSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-base sm:text-lg font-black text-amauta-blue-dark block">
        2. ¿Qué característica es la que más te atrae?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {FEATURES.map(feat => (
          <div
            key={feat.id}
            onClick={() => onChange(feat.id)}
            className={`p-4 rounded-2xl border border-neutral-200/80 bg-white cursor-pointer hover:border-amauta-blue/40 transition-all flex items-center gap-3 border-l-4 ${
              value === feat.id
                ? 'border-l-amauta-orange bg-amauta-orange-light/10 ring-1 ring-amauta-orange/15 shadow-sm'
                : 'hover:bg-slate-50'
            }`}
          >
            <span className="text-2xl">{feat.emoji}</span>
            <div>
              <span className="font-extrabold text-sm text-amauta-blue-dark block">{feat.title}</span>
              <span className="text-[11.5px] font-medium text-foreground/50 block">{feat.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
