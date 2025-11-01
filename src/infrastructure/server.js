const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const VisitorCounter = require('./VisitorCounter');

// Cargar variables de entorno
dotenv.config();

// Inicializar contador de visitas
const visitorCounter = new VisitorCounter();

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
    }
  }
  
  res.sendFile(filePath);
});

// La página de clientes se eliminó según requerimientos

// Ruta de proyectos eliminada según requerimiento


// API endpoints para contador de visitas
// GET /api/visitors/stats - Obtener estadísticas (público)
app.get('/api/visitors/stats', (req, res) => {
  try {
    const stats = visitorCounter.getStats();
    res.json({
      success: true,
      data: {
        totalVisits: stats.totalVisits,
        // No exponemos uniqueVisitors ni lastVisit por privacidad
      }
    });
  } catch (error) {
    console.error('Error al obtener stats:', error);
    res.status(500).json({ success: false, error: 'Error al obtener estadísticas' });
  }
});

// POST /api/visitors/visit - Incrementar visita (automático al cargar página)
app.post('/api/visitors/visit', (req, res) => {
  try {
    // Obtener IP real del cliente (considerando proxies)
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() 
               || req.headers['x-real-ip'] 
               || req.connection.remoteAddress 
               || req.socket.remoteAddress;
    
    const result = visitorCounter.incrementVisit(ip);
    
    if (DEBUG) {
      console.log(`👤 Visita desde IP ${ip}: ${result.message}`);
    }
    
    res.json({
      success: true,
      data: {
        totalVisits: result.totalVisits,
        isNewVisit: result.isNewVisit
      }
    });
  } catch (error) {
    console.error('Error al registrar visita:', error);
    res.status(500).json({ success: false, error: 'Error al registrar visita' });
  }
});

// Ruta de reset solo para testing (proteger con autenticación en producción)
if (DEBUG) {
  app.post('/api/visitors/reset', (req, res) => {
    const result = visitorCounter.reset();
    res.json({ success: true, data: result, message: 'Contador reseteado' });
  });
}

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
