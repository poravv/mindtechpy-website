// Modelo de dominio para clientes

const clientes = [
  {
    id: 1,
    nombre: "Tech Innovations",
    logo: "/images/client-1.png",
    sector: "tech",
    destacado: true
  },
  {
    id: 2,
    nombre: "Health Solutions",
    logo: "/images/client-2.png",
    sector: "health",
    destacado: true
  },
  {
    id: 3,
    nombre: "Retail Market",
    logo: "/images/client-3.png",
    sector: "retail",
    destacado: true
  },
  {
    id: 4,
    nombre: "Finance Group",
    logo: "/images/client-4.png",
    sector: "finance",
    destacado: true
  },
  {
    id: 5,
    nombre: "Education Tech",
    logo: "/images/client-5.png",
    sector: "tech",
    destacado: true
  },
  {
    id: 6,
    nombre: "Startup Ventures",
    logo: "/images/client-6.png",
    sector: "tech",
    destacado: false
  },
  {
    id: 7,
    nombre: "Hospitality Services",
    logo: "/images/client-7.png",
    sector: "health",
    destacado: false
  },
  {
    id: 8,
    nombre: "Manufacturing Inc.",
    logo: "/images/client-8.png",
    sector: "tech",
    destacado: false
  },
  {
    id: 9,
    nombre: "Retail Chain",
    logo: "/images/client-9.png",
    sector: "retail",
    destacado: false
  },
  {
    id: 10,
    nombre: "Banking Corp",
    logo: "/images/client-10.png",
    sector: "finance",
    destacado: false
  }
];

function getAll() {
  return clientes;
}

function findById(id) {
  return clientes.find(cliente => cliente.id === id);
}

function getDestacados() {
  return clientes.filter(cliente => cliente.destacado);
}

function getBySector(sector) {
  if (sector === 'all') {
    return clientes;
  }
  return clientes.filter(cliente => cliente.sector === sector);
}

module.exports = {
  getAll,
  findById,
  getDestacados,
  getBySector
};
