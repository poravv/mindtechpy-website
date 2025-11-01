const fs = require('fs');
const path = require('path');

class VisitorCounter {
  constructor(filePath = path.join(__dirname, '../../data/visitors.json')) {
    this.filePath = filePath;
    this.ipCache = new Map(); // Cache de IPs para rate limiting
    this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en ms
    this.ensureDataFile();
  }

  ensureDataFile() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      const initialData = {
        totalVisits: 0,
        uniqueVisitors: 0,
        lastVisit: null,
        createdAt: new Date().toISOString()
      };
      fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2));
    }
  }

  readData() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      console.error('Error leyendo visitors.json:', error);
      return { totalVisits: 0, uniqueVisitors: 0, lastVisit: null };
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error escribiendo visitors.json:', error);
      return false;
    }
  }

  /**
   * Incrementa contador solo si la IP no visitó recientemente
   * @param {string} ip - IP del visitante
   * @returns {object} - Datos actualizados con flag isNewVisit
   */
  incrementVisit(ip) {
    const now = Date.now();
    const normalized = this.normalizeIP(ip);

    // Verificar si la IP ya visitó recientemente (rate limiting)
    if (this.ipCache.has(normalized)) {
      const lastVisitTime = this.ipCache.get(normalized);
      if (now - lastVisitTime < this.CACHE_DURATION) {
        // No incrementar, retornar datos actuales
        return {
          ...this.readData(),
          isNewVisit: false,
          message: 'Visita reciente detectada (no contabilizada)'
        };
      }
    }

    // Nueva visita válida
    const data = this.readData();
    data.totalVisits += 1;
    data.uniqueVisitors += 1; // Simplificado: incrementa siempre (en producción usar DB)
    data.lastVisit = new Date().toISOString();

    this.writeData(data);
    this.ipCache.set(normalized, now);

    // Limpiar cache antigua cada 100 visitas
    if (data.totalVisits % 100 === 0) {
      this.cleanOldCache();
    }

    return {
      ...data,
      isNewVisit: true,
      message: 'Visita contabilizada'
    };
  }

  /**
   * Obtiene estadísticas sin incrementar
   */
  getStats() {
    return this.readData();
  }

  /**
   * Normaliza IP (elimina puerto, convierte ::ffff:127.0.0.1 a 127.0.0.1)
   */
  normalizeIP(ip) {
    if (!ip) return 'unknown';
    return ip.replace(/^::ffff:/, '').split(':')[0];
  }

  /**
   * Limpia entradas de cache antiguas
   */
  cleanOldCache() {
    const now = Date.now();
    for (const [ip, timestamp] of this.ipCache.entries()) {
      if (now - timestamp > this.CACHE_DURATION) {
        this.ipCache.delete(ip);
      }
    }
  }

  /**
   * Resetea contador (solo para admin/testing)
   */
  reset() {
    const data = {
      totalVisits: 0,
      uniqueVisitors: 0,
      lastVisit: null,
      resetAt: new Date().toISOString()
    };
    this.writeData(data);
    this.ipCache.clear();
    return data;
  }
}

module.exports = VisitorCounter;
