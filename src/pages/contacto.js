// Importamos los estilos
import './styles/styles.css';

// Importamos los componentes necesarios
import Navbar from '../components/Navbar';

// Inicializar la navegación
const initNavbar = () => {
  new Navbar();
};

// Inicializar el formulario de contacto
const initContactForm = () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Cambia el texto del botón para indicar envío
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simulación de envío (reemplazar por API real)
    setTimeout(() => {
      // Mostrar mensaje de éxito
      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      
      // Limpiar formulario
      contactForm.reset();
      
      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensaje';
    }, 1500);
  });
};

// Inicializar las pestañas de tecnologías
const initTechTabs = () => {
  const tabs = document.querySelectorAll('.tech-tab');
  if (!tabs.length) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Desactivar todos los tabs
      document.querySelectorAll('.tech-tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // Activar el tab seleccionado
      tab.classList.add('active');
      
      // Mostrar el contenido correspondiente
      const category = tab.getAttribute('data-category');
      
      // Ocultar todos los grids de tecnología
      document.querySelectorAll('.tech-grid').forEach(grid => {
        grid.classList.remove('active');
      });
      
      // Mostrar el grid correspondiente
      document.getElementById(category).classList.add('active');
    });
  });
};

// Inicializar el acordeón de preguntas frecuentes
const initFaqAccordion = () => {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    question.addEventListener('click', () => {
      // Cerrar otras preguntas si están abiertas
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
          openItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
          openItem.querySelector('.faq-answer').style.maxHeight = '0px';
        }
      });
      
      // Alternar estado actual
      item.classList.toggle('active');
      
      // Cambiar ícono
      if (item.classList.contains('active')) {
        toggle.innerHTML = '<i class="fas fa-minus"></i>';
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        toggle.innerHTML = '<i class="fas fa-plus"></i>';
        answer.style.maxHeight = '0px';
      }
    });
  });
};

// Animación al desplazarse para elementos
const initScrollAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observar todos los elementos con la clase animate-on-scroll
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
};

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initContactForm();
  initTechTabs();
  initFaqAccordion();
  initScrollAnimations();
  
  // Header fijo con cambio de estilo al desplazarse
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});
