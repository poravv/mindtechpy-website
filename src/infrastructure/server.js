const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Cargar variables de entorno
dotenv.config();

// Configuración de depuración
const DEBUG = process.env.DEBUG === 'true';
const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 'info';

if (DEBUG) {
  console.log('🛠️  Servidor iniciado en modo depuración');
  console.log(`📊 Nivel de depuración: ${DEBUG_LEVEL}`);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
// Primero intentamos servir desde el directorio dist (archivos generados)
app.use(express.static(path.join(__dirname, '../../dist')));
// Luego intentamos servir desde el directorio public (archivos originales)
app.use(express.static(path.join(__dirname, '../../public')));

// Middleware para depuración de rutas de archivos estáticos
app.use((req, res, next) => {
  if (DEBUG) {
    if (req.url.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)) {
      console.log(`🔍 [${new Date().toISOString()}] Accediendo a archivo: ${req.url}`);
      
      // Verificar si el archivo existe en dist
      const distPath = path.join(__dirname, '../../dist', req.url);
      if (fs.existsSync(distPath)) {
        console.log(`✅ [dist] Archivo encontrado: ${req.url}`);
      } else {
        console.log(`❌ [dist] Archivo NO encontrado: ${req.url}`);
      }
      
      // Verificar si el archivo existe en public
      const publicPath = path.join(__dirname, '../../public', req.url);
      if (fs.existsSync(publicPath)) {
        console.log(`✅ [public] Archivo encontrado: ${req.url}`);
      } else {
        console.log(`❌ [public] Archivo NO encontrado: ${req.url}`);
      }
    }
  }
  next();
});

// Middleware para caché de recursos estáticos
app.use((req, res, next) => {
  // Cache imágenes, CSS y JS por un día
  if (req.url.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para depuración de rutas
if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    // Punto de interrupción para depuración - descomentar para activar
    // debugger;
    next();
  });
}

// Rutas para las páginas
app.get('/', (req, res) => {
  console.log('📄 Sirviendo página de inicio');
  const filePath = path.join(__dirname, '../../dist/index.html');
  
  if (DEBUG) {
    if (fs.existsSync(filePath)) {
      console.log(`✅ Archivo encontrado: ${filePath}`);
    } else {
      console.log(`❌ Archivo NO encontrado: ${filePath}`);
      // Intenta servir como fallback la página de servicios
      console.log(`🔄 Intentando servir servicios.html como fallback`);
      return res.sendFile(path.join(__dirname, '../../dist/servicios.html'));
    }
  }
  
  res.sendFile(filePath);
});

app.get('/servicios', (req, res) => {
  if (DEBUG) console.log('📄 Sirviendo página de servicios');
  res.sendFile(path.join(__dirname, '../../dist/servicios.html'));
});

app.get('/clientes', (req, res) => {
  if (DEBUG) console.log('📄 Sirviendo página de clientes');
  res.sendFile(path.join(__dirname, '../../dist/clientes.html'));
});

app.get('/proyectos', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/proyectos.html'));
});

app.get('/contacto', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/contacto.html'));
});

// API endpoints (para ejemplos y futura expansión)
app.get('/api/servicios', (req, res) => {
  // Aquí se podría conectar con un adaptador del dominio
  const servicios = require('../domain/servicios');
  res.json(servicios.getAll());
});

// Manejo de errores para depuración
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', err);
  
  // Mostrar detalles completos del error en modo depuración
  if (process.env.SHOW_FULL_ERROR === 'true') {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      details: err
    });
  } else {
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  if (DEBUG) {
    console.log(`🔍 Modo depuración activado`);
    console.log(`📊 Puedes usar Chrome DevTools o VSCode para depurar`);
  }
});
