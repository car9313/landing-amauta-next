import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Medal, Star, Crown, Lock, Globe, Sparkles, RefreshCw, Smile, Heart, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MedalItem {
  id: string;
  title: string;
  description: string;
  howToUnlock: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  unlocked: boolean;
  scoreGained: number;
}

export default function AchievementsPanel() {
  const [stars, setStars] = useState(140);
  const [level, setLevel] = useState(3);
  const [selectedMedal, setSelectedMedal] = useState<MedalItem | null>(null);
  
  // Initialize medals in state to allow unlocking dynamically for a rich interactive experience!
  const [medals, setMedals] = useState<MedalItem[]>([
    {
      id: 'primera_suma',
      title: 'Piloto Veloz',
      description: 'Resolvió su primer ejercicio de suma interactiva sin equivocarse.',
      howToUnlock: 'Completar cualquier quiz básico al primer intento.',
      icon: Medal,
      colorClass: 'bg-amber-100 text-amber-600 border-amber-300',
      unlocked: true,
      scoreGained: 20
    },
    {
      id: 'geometria_master',
      title: 'Geómetra de los Andes',
      description: 'Identificó todas las formas y simetrías tridimensionales perfectas.',
      howToUnlock: 'Lograr 100% de efectividad en la isla geométrica.',
      icon: Crown,
      colorClass: 'bg-emerald-100 text-emerald-600 border-emerald-300',
      unlocked: true,
      scoreGained: 50
    },
    {
      id: 'constancia_bronze',
      title: 'Vuelo Diario',
      description: 'Practicó matemáticas durante 3 días seguidos por la mañana.',
      howToUnlock: 'Iniciar sesión y completar un reto por 3 días consecutivos.',
      icon: Trophy,
      colorClass: 'bg-indigo-100 text-indigo-600 border-indigo-300',
      unlocked: true,
      scoreGained: 30
    },
    {
      id: 'multiplicador_pro',
      title: 'Multiplicador Cósmico',
      description: 'Dominó la tabla de multiplicar del 7, 8 y 9.',
      howToUnlock: 'Resolver 10 multiplicaciones avanzadas seguidas en el minirreto.',
      icon: Award,
      colorClass: 'bg-rose-100 text-rose-600 border-rose-300',
      unlocked: false,
      scoreGained: 100
    },
    {
      id: 'amigo_amauta',
      title: 'Sabio Aprendiz',
      description: 'Hizo click en la mascota Amauta 5 veces para escuchar sus sabios consejos.',
      howToUnlock: 'Interactuar con el cóndor Amauta en la cabecera e inicio de página.',
      icon: Smile,
      colorClass: 'bg-purple-100 text-purple-600 border-purple-300',
      unlocked: false,
      scoreGained: 15
    },
    {
      id: 'campeon_perfecto',
      title: 'Perfección Andina',
      description: 'Completó un módulo académico completo con precisión impecable.',
      howToUnlock: 'Resolver un bloque temático completo sin errores.',
      icon: Star,
      colorClass: 'bg-blue-100 text-blue-600 border-blue-300',
      unlocked: false,
      scoreGained: 120
    }
  ]);

  const handleUnlockMedal = (medalId: string) => {
    setMedals(prev => prev.map(m => {
      if (m.id === medalId && !m.unlocked) {
        // Trigger celebration
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
        setStars(s => s + m.scoreGained);
        // Level up check if enough stars
        if (stars + m.scoreGained >= 200 && level < 4) {
          setLevel(4);
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 120,
              colors: ['#f4701f', '#1f4fa3', '#10b981']
            });
          }, 400);
        }
        return { ...m, unlocked: true };
      }
      return m;
    }));
  };

  const handleResetProgressInDemo = () => {
    setStars(140);
    setLevel(3);
    setMedals(prev => prev.map(m => {
      if (m.id === 'multiplicador_pro' || m.id === 'amigo_amauta' || m.id === 'campeon_perfecto') {
        return { ...m, unlocked: false };
      }
      return m;
    }));
  };

  return (
    <section id="panel-logros" className="py-20 sm:py-24 bg-gradient-to-b from-white to-amauta-surface-alt relative overflow-hidden">
      {/* Decorative styling items */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-amauta-blue-light/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amauta-orange-light/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Title / Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-amauta-orange-light/30 border border-amauta-orange/15 px-3 py-1.5 rounded-full text-xs font-black text-amauta-orange-dark uppercase tracking-widest mb-4">
            <Trophy className="w-3.5 h-3.5 text-amauta-orange" />
            <span>Zona de Campeones</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-amauta-blue-dark tracking-tight mb-4">
            Tu Panel de Logros Amauta
          </h2>
          
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-semibold">
            ¡Mide tu progreso de nivel recopilando medallas virtuales! Desbloquea coronas, trofeos y acumula estrellas para convertirte en un gran sabio.
          </p>
        </div>

        {/* Dashboard Grid split into Left (Level stats tracker) and Right (Medal grid list) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Kids Progress Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-3 border-amauta-blue-light p-6 sm:p-8 rounded-3xl shadow-[var(--shadow-lg)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-amauta-orange/5 rounded-full pointer-events-none" />
              
              {/* Level circle and stars */}
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs uppercase font-extrabold text-amauta-orange tracking-wider">Rango de Vuelo</span>
                  <p className="text-2xl font-black text-amauta-blue-dark">Nivel {level}: Cóndor Sabio</p>
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amauta-orange to-amauta-orange-dark text-white flex flex-col items-center justify-center shadow-md animate-bounce-gentle">
                  <span className="text-xs font-black leading-none uppercase">NIVEL</span>
                  <span className="text-2xl font-extrabold leading-none">{level}</span>
                </div>
              </div>

              {/* Progress bar info */}
              <div className="space-y-3.5 mb-6">
                <div className="flex justify-between items-center text-sm font-extrabold">
                  <span className="text-foreground/60 flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Estrellas acumuladas:</span>
                  </span>
                  <span className="text-amauta-blue font-mono font-black">{stars} / 250</span>
                </div>
                
                {/* Visual Progress slide */}
                <div className="w-full bg-amauta-blue-light h-5 rounded-full p-1 border border-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stars / 250) * 100, 100)}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    className="bg-gradient-to-r from-amauta-blue to-amauta-blue-dark h-full rounded-full relative flex items-center justify-end"
                  >
                    <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse" />
                  </motion.div>
                </div>

                <div className="flex justify-between text-xs text-foreground/45 font-bold">
                  <span>Nivel 3 (Cóndor Novato)</span>
                  <span>Siguiente Rango: Maestro Cóndor</span>
                </div>
              </div>

              {/* Character dialog bubble inside progress scorecard */}
              <div className="p-4 bg-amauta-blue-light/50 border border-amauta-blue/15 rounded-2xl relative">
                <p className="text-xs sm:text-sm font-bold text-amauta-blue-dark leading-relaxed">
                  🦉 <strong>Consejo de Amauta:</strong> "¡Increíble Tomás! Estás a solo {250 - stars} estrellas de subir de nivel. Prueba pulsar una medalla bloqueada de la derecha para ver cómo conseguirla."
                </p>
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-4 h-4 bg-amauta-blue-light/50 border-r border-t border-amauta-blue/15 rotate-45 hidden lg:block" />
              </div>

              {/* Quick instructions / reset */}
              <div className="border-t border-border/50 pt-5 mt-6 flex justify-between items-center">
                <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wide">Área Lúdica Autogestionada</span>
                <button
                  onClick={handleResetProgressInDemo}
                  className="text-xs font-bold text-amauta-blue hover:text-amauta-orange flex items-center gap-1 hover:underline min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reiniciar Demo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Medals Deck */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="text-xs uppercase font-black text-amauta-blue tracking-widest mb-2.5 flex items-center gap-2">
              <span>Medallas Coleccionables ({medals.filter(m => m.unlocked).length} de {medals.length})</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </h4>

            {/* Medals Grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medals.map((medal) => {
                const IconComp = medal.icon;

                return (
                  <div
                    key={medal.id}
                    onClick={() => {
                      setSelectedMedal(medal);
                      if (!medal.unlocked) {
                        handleUnlockMedal(medal.id);
                      }
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 cursor-pointer relative overflow-hidden group select-none min-h-[110px] ${
                      medal.unlocked
                        ? 'bg-white border-amauta-blue-light hover:border-amauta-blue/30 shadow-sm hover:shadow-[var(--shadow-md)] hover:-translate-y-1'
                        : 'bg-[#F0EEED]/60 border-neutral-200 opacity-80 hover:bg-white hover:border-amauta-orange/30'
                    }`}
                  >
                    {/* Medal Circle Badge Icon */}
                    <div className={`p-3 rounded-xl border-b-2 font-black shrink-0 relative ${
                      medal.unlocked ? medal.colorClass : 'bg-neutral-200 text-neutral-450 border-neutral-300'
                    }`}>
                      {medal.unlocked ? (
                        <>
                          <IconComp className="w-6 h-6 animate-pulse-ring" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
                        </>
                      ) : (
                        <Lock className="w-6 h-6 text-neutral-500" />
                      )}
                    </div>

                    {/* Metadata text */}
                    <div className="space-y-1">
                      <span className={`font-black text-base leading-snug block ${
                        medal.unlocked ? 'text-amauta-blue-dark' : 'text-neutral-500'
                      }`}>
                        {medal.title}
                      </span>
                      
                      <p className="text-xs text-foreground/60 font-semibold leading-relaxed line-clamp-2">
                        {medal.unlocked ? medal.description : `Bloqueado • ${medal.howToUnlock}`}
                      </p>

                      {/* Spark / Point rewards tag */}
                      <span className={`inline-block text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md mt-1 mb-1 ${
                        medal.unlocked 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        +{medal.scoreGained} Estrellas
                      </span>
                    </div>

                    {/* Unlock hint on click if blocked */}
                    {!medal.unlocked && (
                      <div className="absolute right-4 bottom-4 text-[10px] font-black text-amauta-orange uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                        ¡Click para desbloquear!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

      </div>

      {/* Achievement Detail modal */}
      <AnimatePresence>
        {selectedMedal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedal(null)}
              className="absolute inset-0 bg-amauta-blue-dark/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 sm:p-8 border border-border shadow-[var(--shadow-2xl)] relative z-10 text-center space-y-5"
            >
              <button
                onClick={() => setSelectedMedal(null)}
                className="absolute top-4 right-4 text-foreground/40 hover:text-foreground/80 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 min-h-[44px] min-w-[44px]"
              >
                ✕
              </button>

              {/* Medal Big Icon Display */}
              <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-md relative ${
                selectedMedal.unlocked ? selectedMedal.colorClass : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
              }`}>
                {selectedMedal.unlocked ? (
                  <selectedMedal.icon className="w-10 h-10 animate-bounce-gentle" />
                ) : (
                  <Lock className="w-10 h-10 text-neutral-400" />
                )}
                
                {selectedMedal.unlocked && (
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>

              {/* Medal description */}
              <div>
                <span className={`text-[10px] uppercase font-mono font-black tracking-widest ${
                  selectedMedal.unlocked ? 'text-success' : 'text-neutral-500'
                }`}>
                  {selectedMedal.unlocked ? '¡Medalla Coleccionada!' : 'Medalla Bloqueada'}
                </span>
                
                <h3 className="text-xl font-black text-amauta-blue-dark mt-1">
                  {selectedMedal.title}
                </h3>
              </div>

              <div className="space-y-2 bg-[#FAF9F6] border border-border/50 p-4 rounded-2xl">
                <p className="text-sm text-foreground/75 font-semibold leading-relaxed">
                  {selectedMedal.description}
                </p>
                <div className="pt-2 border-t border-border/40">
                  <span className="text-[10px] font-black uppercase text-amauta-blue tracking-wider block">
                    ¿Cómo desbloquear?
                  </span>
                  <p className="text-xs text-foreground/60 font-bold mt-0.5">
                    {selectedMedal.howToUnlock}
                  </p>
                </div>
              </div>

              {/* CTA based on unlocked state */}
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setSelectedMedal(null)}
                  className="bg-amauta-blue hover:bg-amauta-blue-dark text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors hover-lift min-h-[44px] w-full"
                >
                  Continuar Aventura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
