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

function createClassicNotice() {
  if (document.getElementById('classic-notice')) return;
  const notice = document.createElement('div');
  notice.id = 'classic-notice';
  notice.className = 'classic-notice';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.innerHTML = `
    <button class="close" aria-label="Cerrar notificación">×</button>
    <div class="content">
      <p>😄 Estás en modo clásico. Puedes cambiar al <strong>Modo Moderno</strong> para una experiencia visual mejorada.</p>
      <div class="actions">
        <button class="btn btn-modernize" type="button">Cambiar a Modo Moderno</button>
      </div>
    </div>
  `;
  document.body.appendChild(notice);

  const closeBtn = notice.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    notice.classList.add('hide');
    setTimeout(() => notice.remove(), 200);
  });

  const modernBtn = notice.querySelector('.btn-modernize');
  modernBtn.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 'modern');
    localStorage.setItem('theme', 'modern');
    const toggleDesktop = document.getElementById('mode-toggle');
    const toggleMobile = document.getElementById('mode-toggle-mobile');
    [toggleDesktop, toggleMobile].filter(Boolean).forEach(updateToggleText);
    syncNavForTheme();
    notice.classList.add('hide');
    setTimeout(() => notice.remove(), 200);
  });

  setTimeout(() => {
    if (!notice.isConnected) return;
    notice.classList.add('hide');
    setTimeout(() => notice.remove(), 200);
  }, 10000);
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
  // Notificación solo en clásico
  if (!isModern) {
    createClassicNotice();
  } else {
    const n = document.getElementById('classic-notice');
    if (n) n.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  const saved = localStorage.getItem('theme') || 'classic';
  applyTheme(saved);
  syncNavForTheme();

  // Forzamos navbar oscuro por defecto
  document.documentElement.setAttribute('data-navbar', 'dark');

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

  // Sin toggles de variante de navbar (oscuro fijo)

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
    // efecto suave en el panel activo (solo moderno)
    if (document.documentElement.getAttribute('data-theme') === 'modern') {
      panels.forEach(p => p.classList.remove('tab-anim'));
      const active = document.getElementById(nextId);
      if (active) active.classList.add('tab-anim');
    }
  }

  function updateFromHash() {
    const key = (location.hash || '#home').replace('#','');
    selectTabByKey(key);
    // Resaltar nav activo
    const links = document.querySelectorAll('.nav-list a');
    links.forEach(a => {
      const target = a.getAttribute('href').replace('#','');
      const isActive = target === key;
      a.classList.toggle('active', isActive);
      if (isActive) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
    // Desplazar al inicio con suavidad en modo moderno
    if (document.documentElement.getAttribute('data-theme') === 'modern') {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0,0); }
    }
  }

  // Inicial y cambios de hash
  updateFromHash();
  window.addEventListener('hashchange', updateFromHash);

  // Header compacto al hacer scroll (solo moderno)
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    const isModern = document.documentElement.getAttribute('data-theme') === 'modern';
    if (!header) return;
    if (isModern && window.scrollY > 10) header.classList.add('compact');
    else header.classList.remove('compact');
  });
});
