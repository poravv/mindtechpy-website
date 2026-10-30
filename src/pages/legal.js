import '../styles/legal.scss';
import initPageChrome from './page-chrome';
import { readConsent, writeConsent } from './cookie-consent';

const CONSENT_STATUS = {
  accepted: 'Estado actual: aceptaste. La publicidad de Google se carga en la página de inicio.',
  rejected: 'Estado actual: rechazaste. La publicidad de Google no se carga.',
  none: 'Estado actual: sin decisión. La publicidad de Google no se carga.',
  notSaved: 'No pudimos guardar tu decisión en este navegador. La publicidad de Google no se carga.',
};

function initCookieControls() {
  const controls = document.getElementById('cookie-controls');
  if (!controls) return;

  const status = controls.querySelector('[aria-live]');
  status.textContent = CONSENT_STATUS[readConsent() ?? 'none'];

  controls.querySelectorAll('[data-cookie-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const choice = button.dataset.cookieChoice;
      status.textContent = CONSENT_STATUS[writeConsent(choice) ? choice : 'notSaved'];
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPageChrome();
  initCookieControls();
});
