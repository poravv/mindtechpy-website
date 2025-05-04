// Importamos los estilos
import './styles/styles.css';
// import './styles/main.scss'; // Comentado temporalmente hasta resolver problemas SCSS
// Importamos las funciones compartidas para la navegación
import { initNavbar } from './index.js';

// Función para inicializar el acordeón de FAQ
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle i');
    
    question.addEventListener('click', () => {
      // Cerrar otros items abiertos
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.faq-toggle i').classList.remove('fa-minus');
          otherItem.querySelector('.faq-toggle i').classList.add('fa-plus');
        }
      });
      
      // Toggle actual item
      item.classList.toggle('active');
      
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        toggle.classList.remove('fa-plus');
        toggle.classList.add('fa-minus');
      } else {
        answer.style.maxHeight = null;
        toggle.classList.remove('fa-minus');
        toggle.classList.add('fa-plus');
      }
    });
  });
}

// Función para inicializar el formulario de contacto
function initContactoForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simulamos el envío del formulario (en producción se enviaría a un backend real)
    try {
      // Recolectamos los datos del formulario
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData);
      
      // Simulamos una petición API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí se enviaría a un backend real mediante fetch o axios
      console.log('Datos del formulario:', formValues);
      
      // Mostramos mensaje de éxito
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success';
      successMessage.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
      
      // Insertamos el mensaje antes del formulario
      form.parentNode.insertBefore(successMessage, form);
      
      // Reseteamos el formulario
      form.reset();
      
      // Restauramos el botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensaje';
      
      // Ocultamos el mensaje después de un tiempo
      setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 500);
      }, 5000);
      
    } catch (error) {
      // Mostramos mensaje de error
      console.error('Error al enviar el formulario:', error);
      
      const errorMessage = document.createElement('div');
      errorMessage.className = 'alert alert-error';
      errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Hubo un error al enviar tu mensaje. Por favor intenta nuevamente o contáctanos directamente por teléfono.';
      
      // Insertamos el mensaje antes del formulario
      form.parentNode.insertBefore(errorMessage, form);
      
      // Restauramos el botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensaje';
      
      // Ocultamos el mensaje después de un tiempo
      setTimeout(() => {
        errorMessage.style.opacity = '0';
        setTimeout(() => errorMessage.remove(), 500);
      }, 5000);
    }
  });
}

// Inicializamos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializamos el navbar (función compartida)
  initNavbar();
  
  // Inicializamos las funciones específicas de la página de contacto
  initFaqAccordion();
  initContactoForm();
  
  // Inicializamos animaciones al scroll
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
      rect.bottom >= 0
    );
  };
  
  const handleScroll = () => {
    elements.forEach(element => {
      if (isElementInViewport(element)) {
        element.classList.add('animate-fadeIn');
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Ejecutar al cargar la página
});
