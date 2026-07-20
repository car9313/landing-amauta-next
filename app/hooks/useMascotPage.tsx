import { useCallback } from 'react';

const REGISTER_URL =
  process.env.NEXT_PUBLIC_REGISTER_URL || '/register';

export function useMascotPage() {
  const handleParentCTA = useCallback(() => {
    window.open(REGISTER_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return {
    handleParentCTA,
  };
}
