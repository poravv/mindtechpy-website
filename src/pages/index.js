import '../styles/main.scss';
import '../infrastructure/firebase-config';
import '../infrastructure/firebase-config';

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // --- MOBILE NAVIGATION ---
  const nav = document.querySelector('header nav');
  const menuToggle = document.getElementById('menu-toggle');

  if (nav && menuToggle) {
    nav.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', !expanded);
      menuToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(a => {
      a.addEventListener('click', () => {
        nav.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- TAB PANELS LOGIC (CYBER-PREMIUM) ---
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const tabMap = {
    home: 'tab-home',
    soluciones: 'tab-soluciones',
    tecnologias: 'tab-tecnologias',
    precios: 'tab-precios',
    empresa: 'tab-empresa',
    contacto: 'tab-contacto',
    terminos: 'tab-terminos',
    privacidad: 'tab-privacidad'
  };

  /**
   * Switches tabs with a smooth fluid animation
   */
  async function selectTabByKey(key) {
    const targetId = tabMap[key] || 'tab-home';
    const activePanel = panels.find(p => !p.hasAttribute('hidden'));
    const nextPanel = document.getElementById(targetId);

    if (activePanel === nextPanel) return;

    // Fluid out-in transition (optional delay for smoothness)
    if (activePanel) {
      activePanel.style.opacity = '0';
      activePanel.style.transform = 'translateY(10px) scale(0.98)';
      await new Promise(r => setTimeout(r, 200));
      activePanel.setAttribute('hidden', '');
    }

    if (nextPanel) {
      nextPanel.removeAttribute('hidden');
      nextPanel.style.opacity = '0';
      nextPanel.style.transform = 'translateY(15px) scale(1.02)';

      // Trigger browser reflow
      void nextPanel.offsetWidth;

      nextPanel.classList.add('tab-anim');
      nextPanel.style.opacity = '1';
      nextPanel.style.transform = 'translateY(0) scale(1)';
    }
  }

  function updateFromHash() {
    const key = (location.hash || '#home').replace('#', '');
    selectTabByKey(key);

    // Sync Navigation States
    const links = document.querySelectorAll('.nav-list a, footer a');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (!href?.startsWith('#')) return;

      const target = href.replace('#', '');
      const isActive = target === key;
      a.classList.toggle('active', isActive);

      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // Scroll to Top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Hash Changes
  window.addEventListener('hashchange', updateFromHash);
  updateFromHash();

  // --- INTERACTIVE ELEMENTS ---

  // Compact Header on Scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('compact', window.scrollY > 40);
    }
  });

  // Reveal elements on scroll (Intersection Observer)
  const revealItems = document.querySelectorAll('.card, h2, .tech-logos');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(item);
  });

});
