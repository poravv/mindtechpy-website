const CONSENT_KEY = 'mindtechpy-cookie-consent';
const CONSENT_VALUES = ['accepted', 'rejected'];
const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9482252021980242';

let isAdSenseInjected = false;

/**
 * Lee la decisión guardada en este navegador.
 * @returns {'accepted'|'rejected'|null} null si no hay decisión o el almacenamiento no está disponible.
 */
export function readConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return CONSENT_VALUES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Guarda la decisión en este navegador.
 * @param {'accepted'|'rejected'} value
 * @returns {boolean} false si el almacenamiento no está disponible.
 */
export function writeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    return true;
  } catch {
    return false;
  }
}

/** Inyecta el script de AdSense una sola vez por carga de página. */
export function loadAdSense() {
  if (isAdSenseInjected) return;
  isAdSenseInjected = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = ADSENSE_SRC;
  script.crossOrigin = 'anonymous';
  document.head.append(script);
}
