// Modelo de dominio para los servicios ofrecidos por Mindtechpy

// Lista de servicios
const servicios = [
  {
    id: 1,
    nombre: "Desarrollo Web",
    descripcion: "Creamos sitios web modernos, responsivos y optimizados para SEO que se adaptan a las necesidades específicas de tu negocio.",
    icono: "globe"
  },
  {
    id: 2,
    nombre: "Desarrollo de Aplicaciones Móviles",
    descripcion: "Diseñamos y desarrollamos aplicaciones nativas y multiplataforma para iOS y Android que potencian tu presencia digital.",
    icono: "mobile-alt"
  },
  {
    id: 3,
    nombre: "Consultoría IT",
    descripcion: "Ofrecemos asesoría experta para optimizar tus procesos tecnológicos y alinearlos con los objetivos de tu empresa.",
    icono: "laptop-code"
  },
  {
    id: 4,
    nombre: "Inteligencia Artificial",
    descripcion: "Implementamos soluciones de IA y machine learning para automatizar procesos y extraer insights valiosos de tus datos.",
    icono: "ai"
  },
  {
    id: 5,
    nombre: "Soluciones Cloud",
    descripcion: "Gestionamos la migración e implementación de infraestructuras en la nube para mejorar la escalabilidad y reducir costos.",
    icono: "cloud"
  }
];

function getAll() {
  return servicios;
}

function findById(id) {
  return servicios.find(servicio => servicio.id === id);
}

module.exports = {
  getAll,
  findById
};
