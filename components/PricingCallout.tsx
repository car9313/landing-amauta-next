'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Gift } from 'lucide-react'

export default function PricingCallout() {
  return (
    <section className="relative overflow-hidden border-y border-slate-100 bg-white py-14 sm:py-18">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#f97316_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        className="mx-auto max-w-3xl px-5 sm:px-8 text-center"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amauta-orange-light/30 text-amauta-orange-dark">
          <Gift className="h-7 w-7" />
        </div>

        <h3 className="text-2xl font-black tracking-tight text-amauta-blue-dark sm:text-3xl">
          Sin compromisos. Sin tarjeta.
        </h3>

        <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-slate-600">
          Mientras dure el acceso anticipado, todo es <span className="text-amauta-orange">completamente gratuito</span>.
          Sin fecha de vencimiento oculta. Sin cargos sorpresa.
          Cuando definamos el modelo definitivo, quienes empezaron antes tendrán beneficios exclusivos.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
            ✅ Sin tarjeta de crédito
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
            ✅ Acceso completo desde el día 1
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
            ✅ Beneficios de early adopter
          </span>
        </div>
      </motion.div>

      <Image
        src="/img/amauta-table.webp"
        alt="Tabla comparativa de planes Amauta"
        width={1200}
        height={675}
        className="mx-auto mt-12 h-auto w-36  sm:w-40 md:w-48"
      />
    </section>
  )
}
