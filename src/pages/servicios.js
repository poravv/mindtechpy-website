// Importamos los estilos
import './styles/styles.css';

// Importamos los componentes necesarios
import Navbar from '../components/Navbar';

// Inicializar la navegación
const initNavbar = () => {
  new Navbar();
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
  initTechTabs();
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
