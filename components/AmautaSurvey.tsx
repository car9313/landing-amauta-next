'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ThumbsUp, Heart, Send, CheckCircle2, BarChart2, AlertCircle, WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SurveyStats {
  total: number;
  loveIt: number;
  interested: number;
  unsure: number;
  prefMascot: number;
  prefGames: number;
  prefDashboard: number;
  prefOffline: number;
}

const EMPTY_STATS: SurveyStats = {
  total: 0,
  loveIt: 0,
  interested: 0,
  unsure: 0,
  prefMascot: 0,
  prefGames: 0,
  prefDashboard: 0,
  prefOffline: 0,
}

const FEATURE_LABELS: Record<string, string> = {
  prefMascot: 'la compañía de la mascota Amauta',
  prefGames: 'las mecánicas de juegos andinos interactivos',
  prefDashboard: 'el panel de logros para padres',
  prefOffline: 'el modo offline completo',
}

const FEATURE_EMOJIS: Record<string, string> = {
  prefMascot: '🦉',
  prefGames: '🎮',
  prefDashboard: '📈',
  prefOffline: '🎒',
}

const FEATURES = [
  { id: 'mascot', emoji: FEATURE_EMOJIS.prefMascot, title: 'La mascota Amauta', desc: 'Cóndor que guía y reacciona de forma lúdica' },
  { id: 'games', emoji: FEATURE_EMOJIS.prefGames, title: 'Mini Retos interactivos', desc: 'Desafíos lúdicos basados en la cosmovisión andina' },
  { id: 'dashboard', emoji: FEATURE_EMOJIS.prefDashboard, title: 'Panel de Logros para padres', desc: 'Monitoreo de destrezas mediante medallas reales' },
  { id: 'offline', emoji: FEATURE_EMOJIS.prefOffline, title: 'Modo Offline Completo', desc: 'Funciona seguro en viajes sin consumir tus datos' },
] as const;

export default function AmautaSurvey() {
  const [voted, setVoted] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [levelOfInterest, setLevelOfInterest] = useState<string>('');
  const [favoriteFeature, setFavoriteFeature] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [stats, setStats] = useState<SurveyStats>(EMPTY_STATS);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVoted(localStorage.getItem('amauta_interest_survey_completed') === 'true');
  }, []);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
  }, []);

  useEffect(() => {
    if (!notification) return;
    notificationTimeoutRef.current = setTimeout(() => setNotification(null), 4000);
    return () => {
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    };
  }, [notification]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/survey/stats');
      if (!res.ok) {
        console.error('Stats API error:', res.status);
        return;
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Fetch stats failed:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    let cancelled = false;
    const pending = localStorage.getItem('amauta_survey_pending');
    if (!pending) return;

    const sync = async () => {
      try {
        const res = await fetch('/api/survey/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: pending,
        });
        if (res.ok) {
          localStorage.removeItem('amauta_survey_pending');
          localStorage.setItem('amauta_interest_survey_completed', 'true');
          if (!cancelled) setVoted(true);
          showNotification('success', '¡Tu voto se sincronizó correctamente!');
          if (!cancelled) await fetchStats();
        }
      } catch {
        // Se reintentará en la próxima carga
      }
    };
    sync();
    return () => { cancelled = true; };
  }, [fetchStats, showNotification]);

  const handleInterestSelect = (value: string) => {
    setLevelOfInterest(value);
  };

  const handleFeatureSelect = (value: string) => {
    setFavoriteFeature(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!levelOfInterest || !favoriteFeature) {
      showNotification('info', 'Por favor selecciona tu nivel de interés y una característica favorita.')
      return
    }

    setSubmitting(true);

    const voteId = crypto.randomUUID();
    const voto = {
      voteId,
      interest: levelOfInterest,
      feature: favoriteFeature,
      comments: feedback,
      name: nickName,
    };

    const previousStats = stats;

    localStorage.setItem('amauta_interest_survey_completed', 'true');
    setVoted(true);

    setStats(prev => {
      const isHigh = levelOfInterest === 'high';
      const isMed = levelOfInterest === 'medium';
      return {
        total: prev.total + 1,
        loveIt: prev.loveIt + (isHigh ? 1 : 0),
        interested: prev.interested + (isMed ? 1 : 0),
        unsure: prev.unsure + (levelOfInterest === 'low' ? 1 : 0),
        prefMascot: prev.prefMascot + (favoriteFeature === 'mascot' ? 1 : 0),
        prefGames: prev.prefGames + (favoriteFeature === 'games' ? 1 : 0),
        prefDashboard: prev.prefDashboard + (favoriteFeature === 'dashboard' ? 1 : 0),
        prefOffline: prev.prefOffline + (favoriteFeature === 'offline' ? 1 : 0),
      };
    });

    try {
      const res = await fetch('/api/survey/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voto),
      });

      if (res.ok) {
        showNotification('success', '¡Voto registrado correctamente!');
        fetchStats();
      } else {
        throw new Error('Server error');
      }
    } catch {
      setStats(previousStats);
      localStorage.setItem('amauta_survey_pending', JSON.stringify(voto));
      showNotification('info', 'Guardado localmente. Se sincronizará cuando haya conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalVotes = stats.total;
  const lovePct = totalVotes > 0 ? Math.round((stats.loveIt / totalVotes) * 100) : 0;
  const interestPct = totalVotes > 0 ? Math.round((stats.interested / totalVotes) * 100) : 0;
  const unsurePct = totalVotes > 0 ? Math.round((stats.unsure / totalVotes) * 100) : 0;

  const sortedFeatures = Object.entries(FEATURE_LABELS)
    .map(([key, label]) => ({ key, label, count: stats[key as keyof SurveyStats] as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  return (
    <section id="encuesta" className="py-20 bg-white relative overflow-hidden border-t border-border/40">
      {notification && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-2 ${
            notification.type === 'success'
              ? 'bg-success text-white'
              : notification.type === 'error'
                ? 'bg-destructive text-white'
                : 'bg-amauta-blue-dark text-white'
          }`}
        >
          {notification.type === 'info' ? <WifiOff className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amauta-blue-light/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">

        {/* Title Header */}
        <SectionHeader
          badge={{ icon: Sparkles, text: "Encuesta de Comunidad" }}
          title={<>¿Te interesa Amauta?</>}
          description="Tu opinión es muy valiosa para construir el mejor viaje de aprendizaje integral. Completa esta encuesta rápida y mira lo que opina el resto de familias."
        />

        {/* Survey Box Layout */}
        <Card className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-neutral-200/80 shadow-[var(--shadow-lg)] p-6 sm:p-10">
          <AnimatePresence mode="wait">

            {/* ── SKELETON — mientras lee localStorage ── */}
            {voted === null && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="h-5 w-64 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-5 w-72 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-16 bg-slate-200 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-96 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-3 w-48 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="h-11 bg-slate-200 rounded-xl animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="h-11 w-44 bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </motion.div>
            )}

            {/* ── FORMULARIO ── */}
            {voted === false && (
              <motion.form
                key="survey-poll"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Question 1: Level of interest */}
                <div className="space-y-3">
                  <label className="text-base sm:text-lg font-black text-amauta-blue-dark block">
                    1. ¿Qué tanto te entusiasma Amauta para tus niños / alumnos? <span className="text-amauta-orange">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInterestSelect('high')}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all min-h-[44px] cursor-pointer flex items-center gap-3 ${
                        levelOfInterest === 'high'
                          ? 'border-amauta-orange bg-amauta-orange-light/20 text-amauta-orange-dark ring-2 ring-amauta-orange/25'
                          : 'border-neutral-200 bg-white hover:border-amauta-blue/30 text-foreground/80'
                      }`}
                    >
                      <span className="text-xl">😍</span>
                      <div>
                        <span className="block font-extrabold leading-none">¡Me encanta!</span>
                        <span className="text-[11px] text-foreground/40 mt-1 block">Lo usaría sin dudar</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInterestSelect('medium')}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all min-h-[44px] cursor-pointer flex items-center gap-3 ${
                        levelOfInterest === 'medium'
                          ? 'border-amauta-blue bg-amauta-blue-light/40 text-amauta-blue-dark ring-2 ring-amauta-blue/25'
                          : 'border-neutral-200 bg-white hover:border-amauta-blue/30 text-foreground/80'
                      }`}
                    >
                      <span className="text-xl">🙂</span>
                      <div>
                        <span className="block font-extrabold leading-none">Me interesa</span>
                        <span className="text-[11px] text-foreground/40 mt-1 block">Me gustaría probarlo</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInterestSelect('low')}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all min-h-[44px] cursor-pointer flex items-center gap-3 ${
                        levelOfInterest === 'low'
                          ? 'border-neutral-500 bg-neutral-100 text-neutral-800'
                          : 'border-neutral-200 bg-white hover:border-neutral-400 text-foreground/80'
                      }`}
                    >
                      <span className="text-xl">😐</span>
                      <div>
                        <span className="block font-extrabold leading-none">Aún no sé</span>
                        <span className="text-[11px] text-foreground/40 mt-1 block">Tengo ciertas dudas</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Question 2: Favorite feature */}
                <div className="space-y-3">
                  <label className="text-base sm:text-lg font-black text-amauta-blue-dark block">
                    2. ¿Qué característica es la que más te atrae?
                     <span className="text-amauta-orange">*</span> 
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {FEATURES.map((feat) => (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => handleFeatureSelect(feat.id)}
                        aria-pressed={favoriteFeature === feat.id}
                        className={`p-4 rounded-2xl border border-neutral-200/80 bg-white cursor-pointer hover:border-amauta-blue/40 transition-all flex items-center gap-3 border-l-4 ${
                          favoriteFeature === feat.id 
                            ? 'border-l-amauta-orange bg-amauta-orange-light/10 ring-1 ring-amauta-orange/15 shadow-sm' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-2xl">{feat.emoji}</span>
                        <div>
                          <span className="font-extrabold text-sm text-amauta-blue-dark block">{feat.title}</span>
                          <span className="text-[11.5px] font-medium text-foreground/50 block">{feat.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Comments & suggestions */}
                <div className="space-y-2">
                  <label className="text-base sm:text-lg font-black text-amauta-blue-dark block">
                    3. ¿Tienes algún aporte o comentario que deba saber el equipo? (Opcional)
                  </label>
                  <Textarea
                    rows={3}
                    maxLength={200}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escribe aquí tus ideas, inquietudes u observaciones..."
                    className="w-full p-4 rounded-2xl border border-neutral-200 bg-white focus:bg-white focus:border-amauta-orange focus:ring-2 focus:ring-amauta-orange/15 font-semibold text-sm outline-none placeholder:text-foreground/35 min-h-16"
                  />
                </div>

                {/* Question 4: Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-amauta-blue-dark block">
                      ¿Cómo te llamas? (Opcional)
                    </label>
                    <Input
                      type="text"
                      maxLength={30}
                      value={nickName}
                      onChange={(e) => setNickName(e.target.value)}
                      placeholder="Ej. Papá de Sofía"
                      className="w-full h-11 rounded-xl border border-neutral-200 px-4 bg-white focus:border-amauta-blue focus:ring-2 focus:ring-amauta-blue/10 outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Submission button */}
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className={`w-full sm:w-auto bg-gradient-to-r from-amauta-blue to-amauta-blue-dark text-white font-black px-8 py-3.5 rounded-xl shadow-[var(--shadow-md)] hover:shadow-glow-blue transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center gap-2 uppercase tracking-wider text-xs border-none ${
                      submitting ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>{submitting ? 'Enviando...' : 'Enviar mi Voto'}</span>
                    <Send className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </motion.form>
            )}

            {/* ── RESULTADOS ── */}
            {voted === true && (
              <motion.div
                key="survey-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Thank status */}
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-success/15 border border-success text-success rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
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

                  {totalVotes === 0 && (
                    <p className="text-xs text-foreground/50 italic text-center py-4">
                      Aún no hay suficientes datos. Los porcentajes aparecerán cuando más personas voten.
                    </p>
                  )}

                  {/* Stat 1: Love It */}
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

                  {/* Stat 2: Medium interest */}
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

                  {/* Stat 3: Unsure */}
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

                  {/* Highlight feature opinion footer */}
                  {sortedFeatures.length > 0 && (
                    <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-foreground/50">
                      {sortedFeatures.map(({ key, label, count }) => {
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                          <div key={key}>
                            {FEATURE_EMOJIS[key]} El <span className="text-amauta-blue-dark font-black">{pct}%</span> destaca {label}.
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-foreground/50 italic leading-relaxed">
                    ¿Te gustó la idea? Asegura su cupo de regalo ingresando los datos en la sección de matrícula que viene a continuación.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

      </div>
    </section>
  );
}
