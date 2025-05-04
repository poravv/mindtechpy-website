/**
 * Herramientas de depuración para el sitio web de Mindtechpy
 * Este archivo proporciona utilidades para ayudar en la depuración
 * del sitio web durante el desarrollo.
 */

// Objeto para almacenar las utilidades de depuración
const DebugTools = {
  // Estado de la depuración
  enabled: false,
  
  // Inicializar herramientas de depuración
  init() {
    // Verificar si estamos en modo depuración
    this.enabled = localStorage.getItem('debug_enabled') === 'true' || 
                  new URLSearchParams(window.location.search).has('debug');
    
    if (this.enabled) {
      console.log('%c🛠️ Modo de depuración activado', 'color: #3498db; font-weight: bold; font-size: 14px;');
      this.createDebugPanel();
      this.highlightComponents();
    }
    
    // Agregar atajo de teclado para activar/desactivar depuración (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleDebug();
      }
    });
    
    return this;
  },
  
  // Alternar modo depuración
  toggleDebug() {
    this.enabled = !this.enabled;
    localStorage.setItem('debug_enabled', this.enabled);
    
    if (this.enabled) {
      console.log('%c🛠️ Modo de depuración activado', 'color: #3498db; font-weight: bold; font-size: 14px;');
      this.createDebugPanel();
      this.highlightComponents();
    } else {
      console.log('%c🚫 Modo de depuración desactivado', 'color: #e74c3c; font-weight: bold; font-size: 14px;');
      this.removeDebugPanel();
      this.removeHighlights();
    }
    
    // Recargar para aplicar cambios
    window.location.reload();
  },
  
  // Crear panel de depuración
  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: rgba(44, 62, 80, 0.9);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      min-width: 200px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 5px;
      margin-bottom: 5px;
    `;
    header.innerHTML = `
      <strong>🛠️ Debug Panel</strong>
      <span id="debug-toggle" style="cursor:pointer;">❌</span>
    `;
    panel.appendChild(header);
    
    // Información sobre el viewport
    const viewport = document.createElement('div');
    viewport.id = 'debug-viewport';
    viewport.style.margin = '5px 0';
    panel.appendChild(viewport);
    
    // Información sobre la ruta actual
    const route = document.createElement('div');
    route.innerHTML = `<strong>Ruta:</strong> ${window.location.pathname}`;
    route.style.margin = '5px 0';
    panel.appendChild(route);
    
    // Botones de depuración
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.flexDirection = 'column';
    buttons.style.gap = '5px';
    buttons.style.marginTop = '10px';
    
    const highlightBtn = document.createElement('button');
    highlightBtn.textContent = 'Resaltar Componentes';
    highlightBtn.style.cssText = 'padding: 5px; cursor: pointer; background: #3498db; border: none; color: white; border-radius: 3px;';
    highlightBtn.onclick = () => this.toggleHighlights();
    buttons.appendChild(highlightBtn);
    
    const logDOMBtn = document.createElement('button');
    logDOMBtn.textContent = 'Analizar DOM';
    logDOMBtn.style.cssText = 'padding: 5px; cursor: pointer; background: #2ecc71; border: none; color: white; border-radius: 3px;';
    logDOMBtn.onclick = () => this.analyzeDOM();
    buttons.appendChild(logDOMBtn);
    
    panel.appendChild(buttons);
    
    document.body.appendChild(panel);
    
    // Actualizar información del viewport en tiempo real
    this.updateViewportInfo();
    window.addEventListener('resize', () => this.updateViewportInfo());
    
    // Configurar evento para cerrar el panel
    document.getElementById('debug-toggle').addEventListener('click', () => {
      this.removeDebugPanel();
    });
  },
  
  // Eliminar panel de depuración
  removeDebugPanel() {
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.remove();
    }
  },
  
  // Actualizar información del viewport
  updateViewportInfo() {
    const viewport = document.getElementById('debug-viewport');
    if (viewport) {
      viewport.innerHTML = `
        <strong>Viewport:</strong> ${window.innerWidth}px × ${window.innerHeight}px<br>
        <small style="opacity: 0.8;">
          ${this.getBreakpointName(window.innerWidth)}
        </small>
      `;
    }
  },
  
  // Obtener nombre del breakpoint actual
  getBreakpointName(width) {
    if (width < 576) return 'xs (móvil pequeño)';
    if (width < 768) return 'sm (móvil)';
    if (width < 992) return 'md (tablet)';
    if (width < 1200) return 'lg (escritorio)';
    return 'xl (escritorio grande)';
  },
  
  // Resaltar componentes en la página
  highlightComponents() {
    this.removeHighlights();
    
    const components = {
      '.header': 'Header',
      '.navbar': 'Navbar',
      '.hero': 'Hero Section',
      '.servicios-destacados': 'Servicios Destacados',
      '.sobre-nosotros': 'Sobre Nosotros',
      '.clientes': 'Clientes',
      '.cta-section': 'CTA Section',
      '.footer': 'Footer',
      '.page-hero': 'Page Hero',
      '.servicios-section': 'Servicios Section',
      '.testimonios-section': 'Testimonios',
      '.clientes-grid': 'Clientes Grid',
      '.proyectos-grid': 'Proyectos Grid',
      '.contacto-section': 'Contacto Section',
      '.mapa-section': 'Mapa Section',
      '.faq-section': 'FAQ Section',
      '.proceso-section': 'Proceso Section',
      '.tecnologias-section': 'Tecnologías Section',
      '.casos-exito': 'Casos de Éxito'
    };
    
    Object.entries(components).forEach(([selector, name]) => {
      const element = document.querySelector(selector);
      if (element) {
        const label = document.createElement('div');
        label.className = 'debug-label';
        label.textContent = name;
        
        const elementRect = element.getBoundingClientRect();
        
        label.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(52, 152, 219, 0.8);
          color: white;
          padding: 2px 8px;
          font-size: 12px;
          font-family: monospace;
          border-bottom-right-radius: 4px;
          z-index: 9999;
          pointer-events: none;
        `;
        
        element.style.position = element.style.position || 'relative';
        element.style.border = '1px dashed rgba(52, 152, 219, 0.5)';
        element.appendChild(label);
      }
    });
  },
  
  // Alternar resaltado de componentes
  toggleHighlights() {
    const hasHighlights = document.querySelector('.debug-label');
    if (hasHighlights) {
      this.removeHighlights();
    } else {
      this.highlightComponents();
    }
  },
  
  // Eliminar resaltado de componentes
  removeHighlights() {
    document.querySelectorAll('.debug-label').forEach(label => label.remove());
    document.querySelectorAll('[style*="border: 1px dashed rgba(52, 152, 219, 0.5)"]')
      .forEach(el => el.style.border = '');
  },
  
  // Analizar estructura del DOM
  analyzeDOM() {
    console.group('%c🔍 Análisis del DOM', 'color: #2ecc71; font-weight: bold; font-size: 14px;');
    
    // Contar elementos por tipo
    const elements = document.querySelectorAll('*');
    const elementCount = {};
    elements.forEach(el => {
      const tagName = el.tagName.toLowerCase();
      elementCount[tagName] = (elementCount[tagName] || 0) + 1;
    });
    
    console.log('%cElementos por tipo:', 'font-weight: bold;');
    console.table(elementCount);
    
    // Medir profundidad del DOM
    const measureDepth = (element, currentDepth = 0) => {
      let maxDepth = currentDepth;
      for (const child of element.children) {
        const childDepth = measureDepth(child, currentDepth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
      return maxDepth;
    };
    
    const maxDepth = measureDepth(document.documentElement);
    console.log(`%cProfundidad máxima del DOM: ${maxDepth} niveles`, 'font-weight: bold;');
    
    // Identificar elementos potencialmente problemáticos
    const largeImages = Array.from(document.querySelectorAll('img'))
      .filter(img => img.naturalWidth > 1000 || img.naturalHeight > 1000);
    
    if (largeImages.length > 0) {
      console.log('%cImágenes grandes (>1000px):', 'color: #e74c3c; font-weight: bold;');
      largeImages.forEach(img => console.log(img));
    }
    
    // Encontrar listeners de eventos
    console.log('%cEventos registrados en elementos clave:', 'font-weight: bold;');
    ['click', 'submit', 'input', 'change'].forEach(eventType => {
      const elementsWithHandlers = Array.from(document.querySelectorAll('button, a, form, input'))
        .filter(el => el.hasAttribute(`on${eventType}`) || 
                      el.hasAttribute('data-event') || 
                      el.className.includes('has-event'));
      
      if (elementsWithHandlers.length > 0) {
        console.log(`Elementos con manejadores de ${eventType}:`, elementsWithHandlers);
      }
    });
    
    console.groupEnd();
  },
  
  // Utilidad para registrar tiempo de ejecución
  time(label) {
    if (!this.enabled) return;
    console.time(`⏱️ ${label}`);
  },
  
  timeEnd(label) {
    if (!this.enabled) return;
    console.timeEnd(`⏱️ ${label}`);
  },
  
  // Logger mejorado con información contextual
  log(message, data = null, type = 'info') {
    if (!this.enabled) return;
    
    const styles = {
      info: 'color: #3498db; background: #eef8ff; padding: 2px 5px; border-radius: 3px;',
      warn: 'color: #f39c12; background: #fff8e6; padding: 2px 5px; border-radius: 3px;',
      error: 'color: #e74c3c; background: #ffebeb; padding: 2px 5px; border-radius: 3px;',
      success: 'color: #2ecc71; background: #efffef; padding: 2px 5px; border-radius: 3px;'
    };
    
    const icons = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    };
    
    const callerInfo = this.getCallerInfo();
    
    console.groupCollapsed(
      `%c${icons[type]} ${message}`,
      styles[type]
    );
    
    // Mostrar información de dónde se llamó el log
    console.log(`%cLlamado desde: ${callerInfo.file}:${callerInfo.line}`, 'color: #7f8c8d; font-style: italic;');
    
    // Mostrar datos si se proporcionan
    if (data !== null) {
      console.log('Datos:', data);
    }
    
    console.groupEnd();
  },
  
  // Obtener información del llamador (archivo y número de línea)
  getCallerInfo() {
    const error = new Error();
    const stack = error.stack.split('\n');
    
    // El índice 3 suele ser el llamador de este método
    const callerLine = stack[3] || '';
    
    // Extraer información del archivo y línea
    const match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
                 callerLine.match(/at\s+()(.*):(\d+):(\d+)/);
    
    if (match) {
      return {
        file: match[2].split('/').pop() || 'desconocido',
        line: match[3] || '?',
        column: match[4] || '?'
      };
    }
    
    return { file: 'desconocido', line: '?', column: '?' };
  }
};

// Exportar herramientas de depuración
export default DebugTools;
