const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const compression = require('compression');

dotenv.config();

const DEBUG = process.env.DEBUG === 'true';
const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 'info';

if (DEBUG) {
  console.log('Servidor iniciado en modo depuracion');
  console.log(`Nivel de depuracion: ${DEBUG_LEVEL}`);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip/Brotli compression
app.use(compression());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Cache headers para assets estaticos
app.use((req, res, next) => {
  if (req.url.match(/\.[a-f0-9]{8}\.(js|css)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.match(/\.html$/)) {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (req.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  } else if (req.url.match(/\.(css|js)$/)) {
    res.setHeader('Cache-Control', 'no-cache');
  }
  next();
});

// Servir archivos estaticos
app.use(express.static(path.join(__dirname, '../../dist'), {
  etag: true,
  lastModified: true
}));
app.use(express.static(path.join(__dirname, '../../public')));

// Debug middleware
if (DEBUG) {
  app.use((req, res, next) => {
    if (req.url.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)) {
      const distPath = path.join(__dirname, '../../dist', req.url);
      const publicPath = path.join(__dirname, '../../public', req.url);
      const found = fs.existsSync(distPath) ? 'dist' : fs.existsSync(publicPath) ? 'public' : 'NOT FOUND';
      console.log(`[${found}] ${req.url}`);
    }
    next();
  });
}

// Debug route logger
if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ─── Rutas ───

// Pagina principal
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../dist/index.html');
  res.sendFile(filePath);
});

// Web Express
app.get('/web-express', (req, res) => {
  const filePath = path.join(__dirname, '../../dist/web-express.html');
  res.sendFile(filePath);
});

// Staff Augmentation (comercial)
app.get('/staff-augmentation', (req, res) => {
  const filePath = path.join(__dirname, '../../dist/staff-augmentation.html');
  res.sendFile(filePath);
});

// Trabaja con nosotros (empleos)
app.get('/trabaja-con-nosotros', (req, res) => {
  const filePath = path.join(__dirname, '../../dist/trabaja-con-nosotros.html');
  res.sendFile(filePath);
});

// Paginas legales (URLs registradas en plataformas externas: no renombrar)
['privacidad', 'terminos', 'eliminacion-de-datos'].forEach((page) => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, `../../dist/${page}.html`));
  });
});

// ─── Health check (para Docker) ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler — serve index.html for client-side routing
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);

  if (process.env.SHOW_FULL_ERROR === 'true') {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar servidor solo cuando se ejecuta directamente (no al importarlo en tests)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    if (DEBUG) {
      console.log('Modo depuracion activado');
    }
  });
}

module.exports = app;
