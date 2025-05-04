/**
 * Configuración de depuración para el sitio web de Mindtechpy
 */

const DebugConfig = {
  // Habilitar/deshabilitar depuración global
  enabled: process.env.NODE_ENV !== 'production',
  
  // Nivel de detalle para logs
  logLevel: 'verbose', // 'error', 'warn', 'info', 'verbose', 'debug'
  
  // Habilitar/deshabilitar características específicas de depuración
  features: {
    // Resaltar componentes en la interfaz
    highlightComponents: true,
    
    // Medir rendimiento
    performance: true,
    
    // Mostrar panel de depuración
    debugPanel: true,
    
    // Registrar eventos de red
    networkLogging: true,
    
    // Registrar eventos de DOM
    domLogging: true,
    
    // Depuración de rutas
    routeDebugging: true
  },
  
  // Opciones de visualización del panel de depuración
  panel: {
    position: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    opacity: 0.9, // 0-1
    showOnLoad: true
  },
  
  // Romper ejecución en puntos específicos (establecer a true para activar)
  breakpoints: {
    onRouteChange: false,
    onApiCall: false,
    onError: true,
    onDomReady: false,
    onLoad: false
  },
  
  // Comportamiento al encontrar errores
  errors: {
    logToConsole: true,
    showInUI: true,
    sendToServer: false,
    serverEndpoint: '/api/debug/log'
  }
};

export default DebugConfig;
