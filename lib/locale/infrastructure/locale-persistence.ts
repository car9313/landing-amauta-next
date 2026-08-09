import { COOKIE_KEY } from "../domain/locale.constants";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año

export function setLocaleCookie(locale: string): void {
  if (typeof document === "undefined") return;
  document.cookie =
    `${COOKIE_KEY}=${encodeURIComponent(locale)}; ` +
    `max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
}

export function getLocaleCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`));
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

export function clearLocaleCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_KEY}=; max-age=0; path=/; SameSite=Lax`;
}