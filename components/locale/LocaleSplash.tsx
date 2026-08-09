"use client";

import Image from "next/image";

/** Pantalla de carga con branding mientras el provider resuelve el locale. */
export function LocaleSplash() {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center gap-6 bg-amauta-blue"
      role="status"
      aria-live="polite"
    >
      <Image
        src="/img/mascot-hero.webp"
        alt="Amauta"
        width={160}
        height={240}
        priority
        className="h-40 w-auto select-none animate-float-gentle"
        draggable={false}
      />
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amauta-orange [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amauta-orange [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amauta-orange" />
      </div>
    </div>
  );
}