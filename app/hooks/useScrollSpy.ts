'use client';

import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds: string[], offset = 120): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const prevSection = { current: sectionIds[0] };

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollPosition) {
          current = id;
        } else {
          break;
        }
      }

      if (current !== prevSection.current) {
        prevSection.current = current;
        setActiveId(current);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}
