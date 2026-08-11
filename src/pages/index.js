import '../styles/main.scss';

// Marca JS activo: los revelados solo ocultan contenido cuando esta clase existe (fail-open sin JS)
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Footer Year ───
  const yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Mobile Navigation ───
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('primary-navigation');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.contains('open');
      navList.classList.toggle('open', !isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── Scroll Progress Bar ───
  const progressBar = document.querySelector('.scroll-progress__bar');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // ─── Compact Header ───
  const header = document.querySelector('header');

  function updateHeader() {
    if (header) {
      header.classList.toggle('compact', window.scrollY > 60);
    }
  }

  // ─── Active Section Detection ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');

  function updateActiveSection() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  // ─── Throttled Scroll Handler ───
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateHeader();
        updateActiveSection();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateScrollProgress();
  updateHeader();
  updateActiveSection();

  // ─── Revelados + hilo de ejecución (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('[data-reveal], [data-thread]');
  const supportsObserver = 'IntersectionObserver' in window;

  if (reducedMotion || !supportsObserver) {
    // Sin observer o con movimiento reducido todo queda visible de inmediato
    revealElements.forEach(el => el.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Red de seguridad: nada queda oculto si el observer no dispara
    setTimeout(() => revealElements.forEach(el => el.classList.add('revealed')), 4000);
  }

  // ─── Legal Tabs ───
  const legalTabs = document.querySelectorAll('.legal-tab');
  const legalContents = document.querySelectorAll('.legal-content');

  legalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-legal');

      legalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      legalContents.forEach(content => {
        const id = content.id.replace('legal-', '');
        if (id === target) {
          content.removeAttribute('hidden');
        } else {
          content.setAttribute('hidden', '');
        }
      });
    });
  });

  // ─── Contact Form Validation ───
  const form = document.getElementById('contact-form');

  if (form) {
    const fields = {
      name: {
        el: document.getElementById('contact-name'),
        validate: (v) => v.trim().length >= 2 ? '' : 'Ingrese su nombre (minimo 2 caracteres)'
      },
      email: {
        el: document.getElementById('contact-email'),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingrese un email valido'
      },
      message: {
        el: document.getElementById('contact-message'),
        validate: (v) => v.trim().length >= 10 ? '' : 'Escriba un mensaje (minimo 10 caracteres)'
      }
    };

    // Real-time validation
    Object.values(fields).forEach(({ el, validate }) => {
      if (!el) return;
      el.addEventListener('blur', () => {
        const error = validate(el.value);
        const errorEl = el.parentElement.querySelector('.form-error');
        if (error) {
          el.classList.add('error');
          el.classList.remove('valid');
          if (errorEl) errorEl.textContent = error;
        } else {
          el.classList.remove('error');
          el.classList.add('valid');
          if (errorEl) errorEl.textContent = '';
        }
      });

      el.addEventListener('input', () => {
        if (el.classList.contains('error')) {
          const error = validate(el.value);
          if (!error) {
            el.classList.remove('error');
            el.classList.add('valid');
            const errorEl = el.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.textContent = '';
          }
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasErrors = false;

      Object.values(fields).forEach(({ el, validate }) => {
        if (!el) return;
        const error = validate(el.value);
        const errorEl = el.parentElement.querySelector('.form-error');
        if (error) {
          el.classList.add('error');
          el.classList.remove('valid');
          if (errorEl) errorEl.textContent = error;
          hasErrors = true;
        }
      });

      if (hasErrors) return;

      // Show loading state
      const btnText = form.querySelector('.btn__text');
      const btnLoading = form.querySelector('.btn__loading');
      const submitBtn = form.querySelector('[type="submit"]');

      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      if (submitBtn) submitBtn.disabled = true;

      // Build WhatsApp message
      const name = fields.name.el.value.trim();
      const email = fields.email.el.value.trim();
      const company = document.getElementById('contact-company')?.value.trim() || '';
      const service = document.getElementById('contact-service')?.value || '';
      const message = fields.message.el.value.trim();

      const whatsappMsg = encodeURIComponent(
        `Hola MindTechPy!\n\n` +
        `Nombre: ${name}\n` +
        `Email: ${email}\n` +
        (company ? `Empresa: ${company}\n` : '') +
        (service ? `Servicio: ${service}\n` : '') +
        `\nMensaje:\n${message}`
      );

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, company, service, message })
        });
        const result = await response.json();

        // La Pages Function responde { ok }, el server Express { success }
        if (!response.ok || !(result.ok || result.success)) {
          throw new Error(result.message || result.error || 'La API de contacto devolvió un error.');
        }

        // Show success feedback
        setTimeout(() => {
          const feedback = form.querySelector('.form-feedback');
          if (feedback) {
            feedback.hidden = false;
            feedback.className = 'form-feedback success';
            feedback.textContent = 'Redirigiendo a WhatsApp para completar su consulta...';
          }

          if (btnText) btnText.hidden = false;
          if (btnLoading) btnLoading.hidden = true;
          if (submitBtn) submitBtn.disabled = false;

          // Redirect to WhatsApp
          setTimeout(() => {
            window.open(`https://wa.me/595981586823?text=${whatsappMsg}`, '_blank');
          }, 800);
        }, 600);
      } catch (error) {
        console.error('No se pudo enviar la consulta:', error);

        const feedback = form.querySelector('.form-feedback');
        if (feedback) {
          feedback.hidden = false;
          feedback.className = 'form-feedback error';
          feedback.textContent = 'No se pudo enviar la consulta. Probá de nuevo o escribinos por WhatsApp.';
        }

        if (btnText) btnText.hidden = false;
        if (btnLoading) btnLoading.hidden = true;
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // ─── Smooth scroll offset for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });

      // Update URL without scroll jump
      history.pushState(null, '', targetId);
    });
  });

  // ─── Dynamic Page Title & Meta Description ───
  const sectionMeta = {
    'hero':            { title: 'MindTechPy — Ingeniería de Software & Transformación Digital | Paraguay', description: 'Software que entra en operación: sistemas, automatizaciones y equipos técnicos desde Paraguay para toda LATAM.' },
    'criterio':        { title: 'Cómo ejecutamos | De la necesidad a la operación | MindTechPy', description: 'Entender, diseñar, integrar y acompañar: el hilo de ejecución de MindTechPy.' },
    'capacidades':     { title: 'Servicios | Software a Medida, Automatización, Cloud, Staff Augmentation | MindTechPy', description: 'Software a medida, automatización e IA, cloud y operación, Staff Augmentation y Web Express en Paraguay.' },
    'evidencia':       { title: 'Productos y Colaboraciones | Boti, CuenlyApp, FoxBox | MindTechPy', description: 'Productos propios y colaboraciones en operación: Boti, CuenlyApp, FoxBox y más.' },
    'como-trabajamos': { title: 'Cómo Trabajamos | MindTechPy Paraguay', description: 'Alineamos el contexto, hacemos avanzar la primera entrega y dejamos capacidad instalada.' },
    'empresa':         { title: 'Nosotros | Compromisos Verificables | MindTechPy Paraguay', description: 'NDA desde el inicio, facturación desde Paraguay, gestión de acceso por roles y entregas documentadas.' },
    'talento':         { title: 'Talento | Trabaja con Nosotros | MindTechPy', description: 'Buen trabajo técnico empieza con conversaciones claras. Sumate al equipo de MindTechPy.' },
    'contacto':        { title: 'Contacto | Iniciar Conversación | MindTechPy Paraguay', description: 'Contanos qué necesita empezar a funcionar mejor. Respondemos en 24-48 horas hábiles.' }
  };

  const metaDescriptionTag = document.querySelector('meta[name="description"]');

  function applySectionMeta(sectionId) {
    const meta = sectionMeta[sectionId];
    if (!meta) return;
    document.title = meta.title;
    if (metaDescriptionTag) metaDescriptionTag.setAttribute('content', meta.description);
  }

  if (supportsObserver) {
    const metaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          applySectionMeta(entry.target.getAttribute('id'));
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('section[id]').forEach(section => {
      if (sectionMeta[section.getAttribute('id')]) {
        metaObserver.observe(section);
      }
    });
  }

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '');
    applySectionMeta(id);
  });

  // ─── Details toggle (is-open class for smooth transitions) ───
  document.querySelectorAll('details').forEach(el => {
    el.addEventListener('toggle', () => {
      el.classList.toggle('is-open', el.open);
    });
    if (el.open) el.classList.add('is-open');
  });
});
