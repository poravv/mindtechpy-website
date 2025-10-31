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

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  const saved = localStorage.getItem('theme') || 'classic';
  applyTheme(saved);

  const toggle = document.getElementById('mode-toggle');
  if (toggle) {
    updateToggleText(toggle);
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'modern' ? 'modern' : 'classic';
      const next = current === 'modern' ? 'classic' : 'modern';
      applyTheme(next);
      localStorage.setItem('theme', next);
      updateToggleText(toggle);
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
