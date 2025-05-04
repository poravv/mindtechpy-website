/**
 * Componente de Navbar
 * 
 * Este componente gestiona la navegación principal del sitio,
 * incluyendo la funcionalidad responsiva para dispositivos móviles.
 */

class Navbar {
  constructor() {
    this.header = document.querySelector('.header');
    this.navbar = document.querySelector('.navbar');
    this.navbarMenu = document.getElementById('navbar-menu');
    this.navbarToggle = document.getElementById('navbar-toggle');
    this.navLinks = document.querySelectorAll('.navbar-link');
    
    this.init();
  }
  
  init() {
    // Iniciar listeners
    this.setupEventListeners();
    
    // Marcar la página activa
    this.highlightActivePage();
    
    // Cambiar estilo del navbar al hacer scroll
    this.setupScrollHandler();
  }
  
  setupEventListeners() {
    if (this.navbarToggle) {
      this.navbarToggle.addEventListener('click', () => this.toggleMenu());
    }
    
    // Cerrar el menú al hacer clic en un enlace
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          this.closeMenu();
        }
      });
    });
    
    // Cerrar el menú si se hace clic fuera del mismo
    document.addEventListener('click', (e) => {
      if (
        this.navbarMenu &&
        this.navbarMenu.classList.contains('active') &&
        !this.navbar.contains(e.target)
      ) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (this.navbarMenu) {
      this.navbarMenu.classList.toggle('active');
    }
    
    if (this.navbarToggle) {
      this.navbarToggle.classList.toggle('active');
    }
  }
  
  closeMenu() {
    if (this.navbarMenu) {
      this.navbarMenu.classList.remove('active');
    }
    
    if (this.navbarToggle) {
      this.navbarToggle.classList.remove('active');
    }
  }
  
  highlightActivePage() {
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (
        (href === '/' && currentPath === '/') || 
        (href !== '/' && currentPath.startsWith(href))
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  setupScrollHandler() {
    if (this.header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      });
    }
  }
}

export default Navbar;
