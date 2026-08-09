'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { FAQ_ITEMS } from '@/app/utils/constants/faq'
import { useLanguage } from '@/lib/locale/hooks/useLanguage'

export default function FAQ() {
  const { t } = useLanguage()
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#FAF9F6] py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-linear-to-r from-amauta-blue-light/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-linear-to-l from-amauta-orange-light/10 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          badge={{ icon: HelpCircle, text: t('faq:badge') }}
          title={<>{t('faq:titleLine1')}<br /><span className="text-amauta-orange">{t('faq:titleLine2')}</span></>}
          description={t('faq:description')}
        />

        <div className="relative mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="space-y-3"
          >
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id

              return (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { type: 'spring', stiffness: 90, damping: 16 },
                    },
                  }}
                  layout
                  className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-slate-50/50 sm:px-8 sm:py-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-black text-amauta-blue-dark sm:text-base">
                      {t(`faq:items.${item.id}.question`)}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="h-5 w-5 text-amauta-orange" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-6 pb-6 pt-4 sm:px-8 sm:pb-7 sm:pt-5">
                          <p className="text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                            {t(`faq:items.${item.id}.answer`)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
