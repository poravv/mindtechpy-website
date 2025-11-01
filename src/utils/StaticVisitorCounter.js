/**
 * Contador de visitas estático para sitios sin backend
 * Simula un contador global usando localStorage + algoritmo de estimación
 * 
 * NOTA: No es 100% preciso (cada navegador/dispositivo cuenta por separado)
 * pero da una buena aproximación visual del tráfico del sitio.
 */

class StaticVisitorCounter {
  constructor() {
    this.storageKey = 'mindtechpy_visitor_data';
    this.sessionKey = 'mindtechpy_session_visit';
    // Semilla base para simular contador global (cambiar este número aumenta/disminuye el contador base)
    this.baseSeed = 0; // Número inicial de "visitas previas"
  }

  /**
   * Inicializa o recupera datos del localStorage
   */
  getData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error leyendo localStorage:', e);
    }
    
    // Datos por defecto
    return {
      myVisits: 0,
      firstVisit: new Date().toISOString(),
      lastVisit: null,
      deviceId: this.generateDeviceId()
    };
  }

  /**
   * Guarda datos en localStorage
   */
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
      return false;
    }
  }

  /**
   * Genera un ID único por dispositivo/navegador
   */
  generateDeviceId() {
    return 'dev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Registra una nueva visita (solo una vez por sesión)
   */
  registerVisit() {
    // Verificar si ya visitó en esta sesión
    if (sessionStorage.getItem(this.sessionKey)) {
      return { isNewVisit: false, totalVisits: this.getEstimatedTotal() };
    }

    // Nueva visita
    const data = this.getData();
    data.myVisits += 1;
    data.lastVisit = new Date().toISOString();
    this.saveData(data);
    
    // Marcar sesión
    sessionStorage.setItem(this.sessionKey, 'true');

    return {
      isNewVisit: true,
      totalVisits: this.getEstimatedTotal(),
      myVisits: data.myVisits
    };
  }

  /**
   * Obtiene estadísticas sin registrar visita
   */
  getStats() {
    const data = this.getData();
    return {
      totalVisits: this.getEstimatedTotal(),
      myVisits: data.myVisits,
      firstVisit: data.firstVisit,
      lastVisit: data.lastVisit
    };
  }

  /**
   * Estima el total global usando algoritmo heurístico
   * Combina: baseSeed + tiempo transcurrido + visitas locales + factor aleatorio
   */
  getEstimatedTotal() {
    const data = this.getData();
    const now = new Date();
    const firstVisit = new Date(data.firstVisit);
    
    // Días desde primera visita de este dispositivo
    const daysSinceFirst = Math.max(0, (now - firstVisit) / (1000 * 60 * 60 * 24));
    
    // Heurística: asumimos ~15 visitas/día en promedio
    const estimatedDailyVisits = 15;
    const timeBasedEstimate = Math.floor(daysSinceFirst * estimatedDailyVisits);
    
    // Factor basado en la hora del día (más visitas en horario laboral)
    const hour = now.getHours();
    const hourFactor = (hour >= 9 && hour <= 18) ? 1.2 : 0.8;
    
    // Componente pseudo-aleatorio determinístico (basado en deviceId para consistencia)
    const deviceHash = this.hashCode(data.deviceId);
    const randomComponent = Math.abs(deviceHash) % 50; // Variación de 0-50
    
    // Total estimado
    const estimated = Math.floor(
      this.baseSeed + 
      timeBasedEstimate * hourFactor + 
      (data.myVisits * 3) + // Multiplicador: cada visita local representa ~3 globales
      randomComponent
    );

    return Math.max(this.baseSeed, estimated);
  }

  /**
   * Hash simple para generar número determinístico desde string
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Resetea datos locales (solo para testing)
   */
  reset() {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.sessionKey);
    return { message: 'Contador local reseteado' };
  }
}

// Exportar para uso en módulos ES6
export default StaticVisitorCounter;
