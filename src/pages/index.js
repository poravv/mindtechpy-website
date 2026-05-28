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

  // ─── Throttled Scroll Handler (extended below with parallax) ───
  let scrollTicking = false;

  // ─── Scroll Reveal (IntersectionObserver) ───
  const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-x]');

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

  // ─── Counter Animation (stats only — small numbers like 90, 24, 5) ───
  const statCounters = document.querySelectorAll('[data-target]:not(.pricing-card__amount)');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statCounters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ─── Pricing reveal (CSS-based — no digit counting for large numbers) ───
  const pricingAmounts = document.querySelectorAll('.pricing-card__amount[data-target]');

  const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pricing-card__amount--revealed');
        pricingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  pricingAmounts.forEach(el => pricingObserver.observe(el));

  // ─── Tech Filter (animated hide/show) ───
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

      const toShow = [];
      const toHide = [];

      techItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const shouldBeVisible = filter === 'all' || category === filter;
        const isHidden = item.classList.contains('hidden');

        if (shouldBeVisible && isHidden) {
          toShow.push(item);
        } else if (!shouldBeVisible && !isHidden) {
          toHide.push(item);
        }
      });

      // Hide outgoing items
      toHide.forEach(item => {
        item.classList.add('tech-item--hiding');
        setTimeout(() => {
          item.classList.add('hidden');
          item.classList.remove('tech-item--hiding');
        }, 200);
      });

      // Show incoming items with stagger
      toShow.forEach((item, i) => {
        item.classList.remove('hidden');
        requestAnimationFrame(() => {
          item.classList.add('tech-item--showing');
          item.style.animationDelay = `${i * 0.03}s`;
          setTimeout(() => {
            item.classList.remove('tech-item--showing');
            item.style.animationDelay = '';
          }, 400 + i * 30);
        });
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
          window.open(`https://wa.me/595981586823?text=${whatsappMsg}`, '_blank');
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

  // ─── Details toggle (is-open class for smooth transitions) ───
  document.querySelectorAll('details').forEach(el => {
    el.addEventListener('toggle', () => {
      el.classList.toggle('is-open', el.open);
    });
    // Set initial state if already open
    if (el.open) el.classList.add('is-open');
  });

  // ─── Timeline line animation ───
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isMobile = window.innerWidth <= 768;
          if (isMobile) {
            timeline.style.setProperty('--line-progress', '100%');
          } else {
            timeline.style.setProperty('--line-progress', '100%');
          }
          // Stagger timeline steps
          timeline.querySelectorAll('.timeline__step').forEach((step, i) => {
            step.style.transitionDelay = `${i * 0.1}s`;
            step.classList.add('revealed');
          });
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    timelineObserver.observe(timeline);
  }

  // ─── Hero terminal line delays ───
  document.querySelectorAll('.hero__terminal-line').forEach((line, i) => {
    line.style.animationDelay = `${0.8 + i * 0.15}s`;
  });

  // ─── Parallax on project card banners ───
  const projectBanners = document.querySelectorAll('.project-card__banner-bg');

  function updateParallax() {
    const viewH = window.innerHeight;
    projectBanners.forEach(banner => {
      const card = banner.closest('.project-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      banner.style.transform = `translateY(${-20 * clamped}px) scale(1.05)`;
    });
  }

  // Extend the scroll handler to include parallax
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateHeader();
        updateActiveSection();
        updateParallax();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ─── Initialize ───
  updateScrollProgress();
  updateHeader();
  updateActiveSection();
  updateParallax();

  // ─── Starfield ───
  new StarField();
});

// ─── Starfield Background ───────────────────────────────────────────────────
class StarField {
  constructor() {
    this.canvas = document.getElementById('starfield');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.rafId = null;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resize();
    this.init();

    if (!this.reducedMotion) {
      this.bindEvents();
      this.animate();
    } else {
      this.drawStatic();
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;
  }

  init() {
    this.stars = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 60 : 150;
    const colors = ['rgba(255,255,255,', 'rgba(6,182,212,', 'rgba(139,92,246,'];

    for (let i = 0; i < count; i++) {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const finalColor = Math.random() > 0.25 ? 'rgba(255,255,255,' : colorBase;
      this.stars.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        opacity: Math.random() * 0.6 + 0.2,
        color: finalColor,
        shimmerPhase: Math.random() * Math.PI * 2,
        shimmerSpeed: Math.random() * 0.01 + 0.003,
        parallaxFactor: Math.random() * 0.3 + 0.05,
        twinkle: Math.random() > 0.7,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    }, { passive: true });

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    }, { passive: true });
  }

  drawNebula() {
    const ctx = this.ctx;
    const grad1 = ctx.createRadialGradient(this.W * 0.8, this.H * 0.2, 0, this.W * 0.8, this.H * 0.2, this.W * 0.4);
    grad1.addColorStop(0, 'rgba(6,182,212,0.04)');
    grad1.addColorStop(1, 'rgba(6,182,212,0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, this.W, this.H);

    const grad2 = ctx.createRadialGradient(this.W * 0.15, this.H * 0.75, 0, this.W * 0.15, this.H * 0.75, this.W * 0.35);
    grad2.addColorStop(0, 'rgba(139,92,246,0.05)');
    grad2.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, this.W, this.H);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    this.scrollY += (this.targetScrollY - this.scrollY) * 0.05;

    this.drawNebula();

    for (const star of this.stars) {
      star.y -= star.speed;
      if (star.y < -2) star.y = this.H + 2;

      const parallaxOffset = (this.scrollY * star.parallaxFactor * 0.08) % this.H;
      const drawY = (star.y - parallaxOffset + this.H) % this.H;

      let opacity = star.opacity;
      if (star.twinkle) {
        star.shimmerPhase += star.shimmerSpeed;
        opacity = star.opacity * (0.6 + 0.4 * Math.sin(star.shimmerPhase));
      }

      ctx.beginPath();
      ctx.arc(star.x, drawY, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `${star.color}${opacity})`;
      ctx.fill();

      if (star.r > 1.2) {
        ctx.beginPath();
        ctx.arc(star.x, drawY, star.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${opacity * 0.15})`;
        ctx.fill();
      }
    }
  }

  drawStatic() {
    this.draw();
  }

  animate() {
    this.rafId = requestAnimationFrame(() => {
      this.draw();
      this.animate();
    });
  }
}
