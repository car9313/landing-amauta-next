'use client';

import React, {useState} from 'react';
import {Mail} from 'lucide-react';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {useLanguage} from '@/lib/locale/hooks/useLanguage';
import {DecorativePattern} from '@/components/DecorativePattern';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const {t} = useLanguage();
    const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    return (
        <footer
            className="bg-amauta-blue-dark text-white border-t border-amauta-blue-dark relative overflow-hidden z-10 font-sans pb-20 md:pb-0">
            {/* Textura de fondo muy sutil */}
            <DecorativePattern
                variant="curves"
                className="absolute inset-0 pointer-events-none text-white"
                opacity={0.06}
            />

            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 relative z-10">
                {/* Grid superior: brand + contacto */}
                <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-amauta-slate-800 pb-10">
                    {/* Brand */}
                    <div className="md:col-span-5 space-y-4 text-center md:text-left">
                        <a
                            href="#inicio"
                            onClick={(e) => handleLinkClick(e, '#inicio')}
                            className="inline-block items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amauta-orange rounded-lg min-h-[44px]"
                        >
                            <Image
                                src="/logo.png"
                                alt="Amauta"
                                width={160}
                                height={64}
                                priority
                                className="h-16 w-auto object-contain"
                            />
                        </a>

                        <p className="text-base text-amauta-orange-light">{t('footer:tagline')}</p>
                        <p className="text-xs sm:text-sm text-amauta-slate-400 font-semibold leading-relaxed">
                            {t('footer:description')}
                        </p>
                    </div>

                    {/* Espaciador (sin contenido) */}
                    <div className="md:col-span-2 hover-lift"/>

                    {/* Contacto */}
                    <div
                        className="md:col-span-5 space-y-3.5 text-amauta-slate-400 font-semibold text-xs sm:text-sm leading-relaxed">
                        <div className="mb-1 text-center md:text-right">{t('footer:contactTitle')}</div>

                        <div className="flex items-center gap-2 justify-center md:justify-end">
                            <Mail className="w-4 h-4 text-amauta-orange"/>
                            <a
                                href="mailto:hola@amauta.app"
                                className="hover:text-amauta-orange text-base font-black transition-colors text-amauta-orange-light"
                            >
                                hola@amauta.app
                            </a>
                        </div>

                        <div className="text-[10px] text-amauta-slate-500 font-bold text-center md:text-right">
                            {t('footer:legal')}
                        </div>
                    </div>
                </div>
                {/* cierre del grid */}

                {/* Copyright y enlaces legales */}
                <div
                    className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-semibold text-amauta-slate-500">
                    <div>{t('footer:copyright', {year: currentYear})}</div>

                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveModal('privacy')}
                            className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-xs"
                        >
                            {t('footer:privacy')}
                        </button>
                        <button
                            onClick={() => setActiveModal('terms')}
                            className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-xs"
                        >
                            {t('footer:terms')}
                        </button>
                    </div>
                </div>
            </div>
            {/* cierre del contenedor principal */}

            {/* Modales */}
            {activeModal && (
                <div
                    className="fixed inset-0 bg-amauta-slate-900/70 backdrop-blur-sm z-55 flex items-center justify-center p-4">
                    <div
                        className="bg-white text-amauta-slate-900 rounded-2xl p-6 max-w-md w-full border border-amauta-slate-100 shadow-xl space-y-5">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h4 className="text-base font-black text-amauta-slate-900 tracking-tight">
                                {activeModal === 'privacy' ? t('footer:privacyModalTitle') : t('footer:termsModalTitle')}
                            </h4>
                            <span className="text-[10px] font-mono uppercase text-amauta-orange font-bold">
                {t('footer:securityBadge')}
              </span>
                        </div>

                        <div
                            className="text-xs text-amauta-slate-600 font-semibold space-y-3 leading-relaxed max-h-60 overflow-y-auto">
                            {activeModal === 'privacy' ? (
                                <>
                                    <p dangerouslySetInnerHTML={{__html: t('footer:privacy1')}}/>
                                    <p dangerouslySetInnerHTML={{__html: t('footer:privacy2')}}/>
                                </>
                            ) : (
                                <>
                                    <p dangerouslySetInnerHTML={{__html: t('footer:terms1')}}/>
                                    <p dangerouslySetInnerHTML={{__html: t('footer:terms2')}}/>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={() => setActiveModal(null)}
                                className="bg-amauta-slate-900 hover:bg-amauta-slate-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs uppercase"
                            >
                                {t('footer:close')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}