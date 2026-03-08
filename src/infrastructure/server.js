const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const nodemailer = require('nodemailer');
const VisitorCounter = require('./VisitorCounter');

dotenv.config();

const visitorCounter = new VisitorCounter();
const DEBUG = process.env.DEBUG === 'true';
const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 'info';

// SMTP transporter (se configura solo si las variables estan presentes)
let mailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  mailTransporter.verify()
    .then(() => console.log('SMTP configurado correctamente'))
    .catch(err => console.error('Error verificando SMTP:', err.message));
} else {
  console.log('SMTP no configurado - los formularios de contacto solo se guardaran en archivo');
}

if (DEBUG) {
  console.log('Servidor iniciado en modo depuracion');
  console.log(`Nivel de depuracion: ${DEBUG_LEVEL}`);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Gzip compression (built-in approach without extra dependency)
app.use((req, res, next) => {
  // Cache headers para assets estaticos
  if (req.url.match(/\.[a-f0-9]{8}\.(js|css)$/)) {
    // Archivos con content hash: cache largo (1 anio)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    // Imagenes: 7 dias
    res.setHeader('Cache-Control', 'public, max-age=604800');
  } else if (req.url.match(/\.(css|js)$/)) {
    // CSS/JS sin hash: 1 dia
    res.setHeader('Cache-Control', 'public, max-age=86400');
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

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

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

// ─── API: Visitantes ───

app.get('/api/visitors/stats', (req, res) => {
  try {
    const stats = visitorCounter.getStats();
    res.json({
      success: true,
      data: { totalVisits: stats.totalVisits }
    });
  } catch (error) {
    console.error('Error al obtener stats:', error);
    res.status(500).json({ success: false, error: 'Error al obtener estadisticas' });
  }
});

app.post('/api/visitors/visit', (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
               || req.headers['x-real-ip']
               || req.connection.remoteAddress
               || req.socket.remoteAddress;

    const result = visitorCounter.incrementVisit(ip);

    if (DEBUG) {
      console.log(`Visita desde IP ${ip}: ${result.message}`);
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

// ─── API: Contacto ───

// Rate limiting simple para el form de contacto
const contactRateMap = new Map();
const CONTACT_RATE_LIMIT_MS = 60000; // 1 minuto entre envios por IP

app.post('/api/contact', (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
               || req.headers['x-real-ip']
               || req.connection.remoteAddress
               || req.socket.remoteAddress;

    // Rate limiting
    const lastContact = contactRateMap.get(ip);
    if (lastContact && (Date.now() - lastContact) < CONTACT_RATE_LIMIT_MS) {
      return res.status(429).json({
        success: false,
        error: 'Espere un momento antes de enviar otro mensaje'
      });
    }

    const { name, email, company, service, message } = req.body;

    // Validacion basica
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Nombre es requerido' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Email invalido' });
    }
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Mensaje muy corto' });
    }

    // Guardar en archivo de contactos (simple persistencia)
    const contactData = {
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || '',
      service: service || '',
      message: message.trim(),
      ip
    };

    const contactsDir = path.join(__dirname, '../../data');
    const contactsFile = path.join(contactsDir, 'contacts.json');

    if (!fs.existsSync(contactsDir)) {
      fs.mkdirSync(contactsDir, { recursive: true });
    }

    let contacts = [];
    if (fs.existsSync(contactsFile)) {
      try {
        contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
      } catch {
        contacts = [];
      }
    }

    contacts.push(contactData);
    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

    contactRateMap.set(ip, Date.now());

    if (DEBUG) {
      console.log(`Nuevo contacto de ${name} (${email})`);
    }

    // Enviar notificacion por email si SMTP esta configurado
    if (mailTransporter && process.env.MAIL_TO) {
      const mailOptions = {
        from: `"MindTechPy Web" <${process.env.SMTP_USER}>`,
        to: process.env.MAIL_TO,
        replyTo: email.trim(),
        subject: `Nuevo contacto: ${name.trim()}${service ? ` - ${service}` : ''}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px;">
            <h2 style="color:#06b6d4;margin-top:0;">Nuevo mensaje desde mindtechpy.net</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#94a3b8;width:120px;">Nombre:</td><td style="padding:8px 0;color:#f1f5f9;font-weight:bold;">${name.trim()}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;">Email:</td><td style="padding:8px 0;"><a href="mailto:${email.trim()}" style="color:#06b6d4;">${email.trim()}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#94a3b8;">Empresa:</td><td style="padding:8px 0;color:#f1f5f9;">${company.trim()}</td></tr>` : ''}
              ${service ? `<tr><td style="padding:8px 0;color:#94a3b8;">Servicio:</td><td style="padding:8px 0;color:#f1f5f9;">${service}</td></tr>` : ''}
            </table>
            <div style="margin-top:16px;padding:16px;background:#1e293b;border-radius:8px;border-left:3px solid #8b5cf6;">
              <p style="color:#94a3b8;margin:0 0 8px 0;font-size:12px;">Mensaje:</p>
              <p style="color:#f1f5f9;margin:0;white-space:pre-wrap;">${message.trim()}</p>
            </div>
            <p style="color:#64748b;font-size:11px;margin-top:24px;">Enviado desde el formulario de contacto de mindtechpy.net</p>
          </div>
        `
      };

      mailTransporter.sendMail(mailOptions)
        .then(() => { if (DEBUG) console.log('Email de notificacion enviado'); })
        .catch(err => console.error('Error enviando email:', err.message));
    }

    res.json({
      success: true,
      message: 'Mensaje recibido. Nos pondremos en contacto pronto.'
    });
  } catch (error) {
    console.error('Error en formulario de contacto:', error);
    res.status(500).json({ success: false, error: 'Error al procesar el mensaje' });
  }
});

// Reset (solo debug)
if (DEBUG) {
  app.post('/api/visitors/reset', (req, res) => {
    const result = visitorCounter.reset();
    res.json({ success: true, data: result, message: 'Contador reseteado' });
  });
}

// ─── Health check (para Docker) ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  if (DEBUG) {
    console.log('Modo depuracion activado');
  }
});
