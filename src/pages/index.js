// Nuevo sitio MindTechPy: modo Clásico vs Moderno
import '../styles/main.scss';

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'modern') {
    html.setAttribute('data-theme', 'modern');
  } else {
    html.removeAttribute('data-theme');
  }
}

function updateToggleText(btn) {
  const isModern = document.documentElement.getAttribute('data-theme') === 'modern';
  btn.textContent = isModern ? 'Modo Clásico' : 'Modo Moderno';
}

function syncNavForTheme() {
  const isModern = document.documentElement.getAttribute('data-theme') === 'modern';
  const nav = document.querySelector('header nav');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileToggle = document.getElementById('mode-toggle-mobile');
  const mobileToggleLi = mobileToggle ? mobileToggle.closest('li') : null;

  if (nav) nav.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

  if (menuToggle) {
    // En clásico oculto; en moderno visible
    menuToggle.hidden = !isModern;
  }
  if (mobileToggleLi) {
    // Mostrar el toggle móvil solo en moderno
    mobileToggleLi.hidden = !isModern;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  const saved = localStorage.getItem('theme') || 'classic';
  applyTheme(saved);
  syncNavForTheme();

  const toggleDesktop = document.getElementById('mode-toggle');
  const toggleMobile = document.getElementById('mode-toggle-mobile');
  const toggles = [toggleDesktop, toggleMobile].filter(Boolean);
  const syncToggleTexts = () => toggles.forEach(btn => updateToggleText(btn));

  if (toggles.length) {
    syncToggleTexts();
    toggles.forEach(btn => btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'modern' ? 'modern' : 'classic';
      const next = current === 'modern' ? 'classic' : 'modern';
      applyTheme(next);
      localStorage.setItem('theme', next);
      syncToggleTexts();
      syncNavForTheme();
    }));
  }

  // Mobile menu toggle
  const nav = document.querySelector('header nav');
  const menuToggle = document.getElementById('menu-toggle');
  if (nav && menuToggle) {
    nav.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      menuToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    // Cerrar al hacer click en un link
    document.querySelectorAll('.nav-list a').forEach(a => {
      a.addEventListener('click', () => {
        nav.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Manejo de pestañas usando links de la navbar + hash
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const map = {
    home: 'tab-home',
    soluciones: 'tab-soluciones',
    tecnologias: 'tab-tecnologias',
    precios: 'tab-precios',
    empresa: 'tab-empresa',
    contacto: 'tab-contacto'
  };

  function selectTabByKey(key) {
    const nextId = map[key] || 'tab-home';
    panels.forEach(p => {
      if (p.id === nextId) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
  }

  function updateFromHash() {
    const key = (location.hash || '#home').replace('#','');
    selectTabByKey(key);
  }

  // Inicial y cambios de hash
  updateFromHash();
  window.addEventListener('hashchange', updateFromHash);
});
