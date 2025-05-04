// Modelo de dominio para proyectos

const proyectos = [
  {
    id: 1,
    nombre: "Plataforma E-commerce Premium",
    descripcion: "Desarrollo de tienda online con sistema de pagos integrado y gestión de inventario en tiempo real.",
    imagen: "/images/project-1.jpg",
    categoria: "web",
    cliente: "Retail Company XYZ",
    tecnologias: ["React", "Node.js", "MongoDB"],
    url: "https://example.com",
    detallesUrl: "/proyectos/ecommerce"
  },
  {
    id: 2,
    nombre: "App de Fitness y Bienestar",
    descripcion: "Aplicación móvil para seguimiento de actividad física, nutrición y meditación con análisis personalizado.",
    imagen: "/images/project-2.jpg",
    categoria: "mobile",
    cliente: "Health & Fitness Inc.",
    tecnologias: ["React Native", "Firebase", "Redux"],
    url: "https://apps.apple.com",
    detallesUrl: "/proyectos/app-fitness"
  },
  {
    id: 3,
    nombre: "Sistema de Predicción de Demanda",
    descripcion: "Implementación de algoritmos de machine learning para predecir demanda de productos en cadena de suministro.",
    imagen: "/images/project-3.jpg",
    categoria: "ai",
    cliente: "Supply Chain Solutions",
    tecnologias: ["Python", "TensorFlow", "AWS"],
    url: null,
    detallesUrl: "/proyectos/ia-prediccion"
  },
  {
    id: 4,
    nombre: "Migración a Infraestructura Cloud",
    descripcion: "Migración completa de infraestructura on-premise a AWS con arquitectura serverless y microservicios.",
    imagen: "/images/project-4.jpg",
    categoria: "cloud",
    cliente: "Enterprise Company",
    tecnologias: ["AWS", "Docker", "Kubernetes", "Terraform"],
    url: null,
    detallesUrl: "/proyectos/migracion-cloud"
  },
  {
    id: 5,
    nombre: "Dashboard Analítico Empresarial",
    descripcion: "Desarrollo de plataforma de visualización de datos empresariales con reportes personalizados y métricas clave.",
    imagen: "/images/project-5.jpg",
    categoria: "web",
    cliente: "Business Analytics Corp.",
    tecnologias: ["Vue.js", "D3.js", "Express", "PostgreSQL"],
    url: "https://example.com/demo",
    detallesUrl: "/proyectos/dashboard"
  },
  {
    id: 6,
    nombre: "Aplicación Fintech para Pagos",
    descripcion: "Desarrollo de solución de pagos móviles con integración de múltiples proveedores y sistema de recompensas.",
    imagen: "/images/project-6.jpg",
    categoria: "mobile",
    cliente: "Fintech Startup",
    tecnologias: ["Flutter", "Dart", "Node.js", "MongoDB"],
    url: "https://play.google.com",
    detallesUrl: "/proyectos/app-fintech"
  }
];

function getAll() {
  return proyectos;
}

function findById(id) {
  return proyectos.find(proyecto => proyecto.id === id);
}

function getByCategoria(categoria) {
  if (categoria === 'all') {
    return proyectos;
  }
  return proyectos.filter(proyecto => proyecto.categoria === categoria);
}

module.exports = {
  getAll,
  findById,
  getByCategoria
};
