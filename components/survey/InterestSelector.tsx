import { INTEREST_OPTIONS } from '@/app/utils/constants/survey'

interface InterestSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function InterestSelector({ value, onChange }: InterestSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-base sm:text-lg font-black text-amauta-blue-dark block">
        1. ¿Qué tanto te entusiasma Amauta para tus niños / alumnos? <span className="text-amauta-orange">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INTEREST_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all min-h-[44px] cursor-pointer flex items-center gap-3 ${
              value === opt.value
                ? opt.value === 'high'
                  ? 'border-amauta-orange bg-amauta-orange-light/20 text-amauta-orange-dark ring-2 ring-amauta-orange/25'
                  : opt.value === 'medium'
                    ? 'border-amauta-blue bg-amauta-blue-light/40 text-amauta-blue-dark ring-2 ring-amauta-blue/25'
                    : 'border-neutral-500 bg-neutral-100 text-neutral-800'
                : 'border-neutral-200 bg-white hover:border-amauta-blue/30 text-foreground/80'
            }`}
          >
            <span className="text-xl">{opt.emoji}</span>
            <div>
              <span className="block font-extrabold leading-none">{opt.label}</span>
              <span className="text-[11px] text-foreground/40 mt-1 block">{opt.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
