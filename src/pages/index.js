import '../styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {

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
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu de navegacion' : 'Cerrar menu de navegacion');
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
          const href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
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

  // ─── Scroll Reveal (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('[data-reveal]');

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

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Tech Filter ───
  const filterButtons = document.querySelectorAll('.tech-filter');
  const techItems = document.querySelectorAll('.tech-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      techItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

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

    form.addEventListener('submit', (e) => {
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

      // Send to API (fire-and-forget)
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, service, message })
      }).catch(() => {});

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
          window.open(`https://wa.me/595992756462?text=${whatsappMsg}`, '_blank');
        }, 800);
      }, 600);
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
        behavior: 'smooth'
      });

      // Update URL without scroll jump
      history.pushState(null, '', targetId);
    });
  });

  // ─── Dynamic Page Title & Meta Description ───
  const sectionMeta = {
    'hero':           { title: 'MindTechPy — Ingeniería de Software & Transformación Digital | Paraguay', description: 'Empresa paraguaya de desarrollo de software, WhatsApp Sender Pro, SMS Sender Pro y transformación digital.' },
    'soluciones':     { title: 'Soluciones Tecnológicas | WhatsApp Sender Pro, SMS Sender Pro | MindTechPy', description: 'Soluciones de mensajería empresarial, apps móviles y desarrollo web a medida en Paraguay.' },
    'proyectos':      { title: 'Proyectos y Colaboraciones | CuenlyApp, FoxBox | MindTechPy', description: 'Proyectos de software: CuenlyApp, FoxBox y más colaboraciones tecnológicas en Paraguay.' },
    'tecnologias':    { title: 'Stack Tecnológico | React, Node.js, Kubernetes | MindTechPy', description: 'Tecnologías que usamos: React, Angular, Node.js, Python, PostgreSQL, Docker, Kubernetes.' },
    'precios':        { title: 'Planes y Precios | Desarrollo de Software | MindTechPy', description: 'Planes flexibles de desarrollo de software y soporte técnico para empresas en Paraguay.' },
    'empresa':        { title: 'Sobre Nosotros | MindTechPy Paraguay', description: 'Equipo de ingenieros de software en Asunción, Paraguay. Transformación digital para empresas.' },
    'ia-responsable': { title: 'IA Responsable | Ética en Inteligencia Artificial | MindTechPy', description: 'Nuestro compromiso con el uso ético y responsable de la inteligencia artificial.' },
    'contacto':       { title: 'Contacto | MindTechPy Paraguay', description: 'Contactanos para tu próximo proyecto de software. Asunción, Paraguay.' }
  };

  const metaDescriptionTag = document.querySelector('meta[name="description"]');

  function applySectionMeta(sectionId) {
    const meta = sectionMeta[sectionId];
    if (!meta) return;
    document.title = meta.title;
    if (metaDescriptionTag) metaDescriptionTag.setAttribute('content', meta.description);
  }

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

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '');
    applySectionMeta(id);
  });

  // ─── Initialize ───
  updateScrollProgress();
  updateHeader();
  updateActiveSection();
});
