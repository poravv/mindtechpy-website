// Importamos los estilos
import './styles/styles.css';
// import './styles/main.scss'; // Comentado temporalmente hasta resolver problemas SCSS

// Importamos los módulos de servicios que definimos en la capa de dominio
import servicios from '../domain/servicios';

// Importamos los componentes
import Navbar from '../components/Navbar';
import DebugTools from '../components/DebugTools';
import Particles from '../components/Particles';

// Función para inicializar la navegación responsiva
const initNavbar = () => {
  // Usamos el componente Navbar
  new Navbar();
};

// Función para cargar los servicios en la página principal
const loadServicios = () => {
  const serviciosGrid = document.querySelector('.servicios-grid');
  if (!serviciosGrid) return;

  // Punto de depuración de ejemplo: ¡Prueba poner un breakpoint aquí!
  console.debug('Cargando servicios destacados en la página principal'); // Para depuración

  const serviciosDestacados = servicios.getAll().slice(0, 3); // Mostrar solo los 3 primeros
  
  // Podemos inspeccionar los servicios durante la depuración
  console.debug('Servicios obtenidos:', serviciosDestacados); // Para depuración
  
  serviciosDestacados.forEach(servicio => {
    const servicioCard = document.createElement('div');
    servicioCard.classList.add('servicio-card', 'animate-fadeIn');
    
    servicioCard.innerHTML = `
      <div class="servicio-card-icon">
        <i class="fas fa-${servicio.icono}"></i>
      </div>
      <h3 class="servicio-card-title">${servicio.nombre}</h3>
      <p class="servicio-card-text">${servicio.descripcion}</p>
    `;
    
    // Podemos examinar cada servicio durante la depuración
    serviciosGrid.appendChild(servicioCard);
  });

  // Agregar animaciones con delay para crear efecto escalonado
  const cards = document.querySelectorAll('.servicio-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
  });
};

// Función para cargar los logos de clientes
const loadClientes = () => {
  const clientesLogos = document.querySelector('.clientes-logos');
  if (!clientesLogos) return;

  // Ejemplos de clientes (reemplazar con datos reales)
  const clientes = [
    { nombre: 'Cliente 1', logo: '/images/client-1.png' },
    { nombre: 'Cliente 2', logo: '/images/client-2.png' },
    { nombre: 'Cliente 3', logo: '/images/client-3.png' },
    { nombre: 'Cliente 4', logo: '/images/client-4.png' },
    { nombre: 'Cliente 5', logo: '/images/client-5.png' },
  ];

  clientes.forEach(cliente => {
    const img = document.createElement('img');
    img.src = cliente.logo;
    img.alt = `Logo de ${cliente.nombre}`;
    img.title = cliente.nombre;
    clientesLogos.appendChild(img);
  });
};

// Inicializa el contador de estadísticas
const initStatsCounter = () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;
  
  const options = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.getAttribute('data-count'));
        let current = 0;
        const increment = Math.ceil(count / 50); // Dividir en 50 incrementos
        const duration = 2000; // 2 segundos para completar
        const interval = duration / 50;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= count) {
            target.textContent = count;
            clearInterval(counter);
          } else {
            target.textContent = current;
          }
        }, interval);
        
        observer.unobserve(target);
      }
    });
  }, options);
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
};

// Inicializa las pestañas de tecnología
const initTechTabs = () => {
  const tabBtns = document.querySelectorAll('.tech-tab-btn');
  if (!tabBtns.length) return;
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      
      // Activar botón
      document.querySelectorAll('.tech-tab-btn').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      
      // Mostrar contenido correspondiente
      document.querySelectorAll('.tech-tab-pane').forEach(p => {
        p.classList.remove('active');
      });
      document.getElementById(target).classList.add('active');
      
      // Animar tarjetas del panel activo
      document.querySelectorAll(`#${target} .tech-card`).forEach((card, index) => {
        card.classList.remove('animate-scale-in');
        setTimeout(() => {
          card.classList.add('animate-scale-in');
        }, index * 100);
      });
    });
  });
};

// Función para inicializar todas las animaciones basadas en scroll
const initScrollAnimations = () => {
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  
  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('animate-fadeIn');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('animate-fadeIn');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 100)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    })
  }

  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  
  // Ejecutar una vez al cargar para elementos que ya estén en la vista
  handleScrollAnimation();
};

// Inicializa el contador de estadísticas
const initParticles = () => {
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) return;
  
  new Particles('particles-js', {
    particleCount: 80,
    color: '#2563eb',
    radius: { min: 0.5, max: 2 },
    speed: { min: 0.05, max: 0.2 },
    opacity: { min: 0.1, max: 0.4 },
    connectParticles: true,
    lineColor: 'rgba(37, 99, 235, 0.2)',
    maxDistance: 150
  });
};

// Inicializa el modal de contacto rápido
const initContactForm = () => {
  const contactFormTrigger = document.querySelector('.contact-trigger');
  if (!contactFormTrigger) return;
  
  const contactModal = document.querySelector('.contact-modal');
  const closeModal = document.querySelector('.close-modal');
  
  contactFormTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.classList.add('active');
  });
  
  closeModal.addEventListener('click', () => {
    contactModal.classList.remove('active');
  });
  
  // Cerrar al hacer clic fuera
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.classList.remove('active');
    }
  });
};

// Inicializar todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar herramientas de depuración primero
  DebugTools.init();
  
  // Medir el tiempo de carga usando las herramientas de depuración
  DebugTools.time('Inicialización de la página');
  
  // Inicializar componentes de interfaz
  initNavbar();
  loadServicios();
  
  // Intentar cargar clientes si existe la función
  if (typeof loadClientes === 'function') {
    loadClientes();
  }
  
  // Inicializar componentes interactivos
  initStatsCounter();
  initTechTabs();
  initScrollAnimations();
  initContactForm();
  initParticles();
  initParticles();
  
  // Añadir efectos de desplazamiento para encabezado
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Añadir clases de animación a elementos
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-on-scroll');
  });
  
  // Registrar información de rendimiento
  DebugTools.timeEnd('Inicialización de la página');
  
  // Log para depuración
  DebugTools.log('Página inicializada correctamente', {
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    userAgent: navigator.userAgent
  }, 'success');
});

// Exportar funciones para uso en otras páginas
export {
  initNavbar,
  loadServicios,
  loadClientes,
  initStatsCounter,
  initTechTabs,
  initScrollAnimations,
  initContactForm
};
