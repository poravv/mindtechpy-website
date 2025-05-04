// Adaptador para la capa de servicios que utiliza el adaptador de API
// para conectarse con los datos del dominio

import ApiAdapter from '../infrastructure/ApiAdapter';

class ServicioService {
  constructor() {
    this.apiAdapter = new ApiAdapter('/api');
  }
  
  async getAllServicios() {
    try {
      return await this.apiAdapter.get('/servicios');
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      
      // Si hay un error en la API, podemos devolver datos de respaldo del dominio
      const serviciosDominio = require('../domain/servicios');
      return serviciosDominio.getAll();
    }
  }
  
  async getServicioById(id) {
    try {
      return await this.apiAdapter.get(`/servicios/${id}`);
    } catch (error) {
      console.error(`Error al obtener servicio con ID ${id}:`, error);
      
      // Si hay un error en la API, podemos devolver datos de respaldo del dominio
      const serviciosDominio = require('../domain/servicios');
      return serviciosDominio.findById(id);
    }
  }
  
  // Otros métodos según sea necesario
}

export default new ServicioService();
