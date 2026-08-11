const SMTP_TIMEOUT_MS = 15_000;

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function optionalText(value, fieldName) {
  if (value === undefined || value === null || value === '') return { ok: true, value: '' };
  if (typeof value !== 'string' || value.trim().length > 200) {
    return { ok: false, message: `${fieldName} debe tener como máximo 200 caracteres.` };
  }

  return { ok: true, value: value.trim() };
}

export function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, message: 'Datos de contacto inválidos.' };
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  if (!name || name.length > 200) {
    return { ok: false, message: 'El nombre es obligatorio y debe tener como máximo 200 caracteres.' };
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  if (!email || email.length > 200 || !isEmail(email)) {
    return { ok: false, message: 'Ingresá un email válido de hasta 200 caracteres.' };
  }

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!message || message.length < 10 || message.length > 5000) {
    return { ok: false, message: 'El mensaje debe tener entre 10 y 5000 caracteres.' };
  }

  const company = optionalText(payload.company, 'La empresa');
  if (!company.ok) return company;

  const service = optionalText(payload.service, 'El servicio');
  if (!service.ok) return service;

  return {
    ok: true,
    value: { name, email, company: company.value, service: service.value, message }
  };
}

function stripHeaderNewlines(value) {
  return String(value ?? '').replace(/[\r\n]+/g, '').trim();
}

function toUtf8Base64(value) {
  const bytes = new TextEncoder().encode(String(value));
  let binary = '';

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary);
}

function encodeSubject(value) {
  return `=?UTF-8?B?${toUtf8Base64(value)}?=`;
}

function dotStuff(value) {
  return String(value).replace(/\r\n|\r|\n/g, '\n').replace(/^\./gm, '..').replace(/\n/g, '\r\n');
}

export function buildMimeMessage(payload, env) {
  const name = stripHeaderNewlines(payload.name);
  const email = stripHeaderNewlines(payload.email);
  const company = String(payload.company ?? '').trim();
  const service = String(payload.service ?? '').trim();
  const message = String(payload.message ?? '').trim();
  const from = stripHeaderNewlines(env.MAIL_FROM);
  const to = stripHeaderNewlines(env.CONTACT_TO);
  const body = [
    'Nueva consulta desde el sitio web',
    '',
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Empresa: ${company || 'No indicada'}`,
    `Servicio: ${service || 'No indicado'}`,
    '',
    'Mensaje:',
    message
  ].join('\n');

  return [
    `From: MindTech Web <${from}>`,
    `To: ${to}`,
    `Reply-To: ${email}`,
    `Subject: ${encodeSubject(`Nueva consulta web — ${name}`)}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    dotStuff(body)
  ].join('\r\n');
}

function smtpError(step, expected, actual) {
  return new Error(`SMTP ${step}: se esperaba ${expected}, se recibió ${actual}`);
}

async function readSmtpResponse(reader, state) {
  const lines = [];
  let responseCode;

  while (true) {
    let newlineIndex = state.buffer.indexOf('\n');

    while (newlineIndex === -1) {
      const { value, done } = await reader.read();
      if (done) throw new Error('SMTP cerró la conexión antes de responder.');
      state.buffer += state.decoder.decode(value, { stream: true });
      newlineIndex = state.buffer.indexOf('\n');
    }

    const line = state.buffer.slice(0, newlineIndex).replace(/\r$/, '');
    state.buffer = state.buffer.slice(newlineIndex + 1);
    const match = line.match(/^(\d{3})([ -])(.*)$/);

    if (!match) throw new Error('SMTP devolvió una respuesta inválida.');

    const [, code, separator] = match;
    if (!responseCode) responseCode = code;
    lines.push(line);

    if (code === responseCode && separator === ' ') {
      return { code: Number(code), lines };
    }
  }
}

async function sendSmtpMessage(env, mimeMessage) {
  const { connect } = await import('cloudflare:sockets');
  const socket = connect(
    { hostname: env.MAIL_HOST, port: Number(env.MAIL_PORT) },
    { secureTransport: 'on', allowHalfOpen: false }
  );
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const encoder = new TextEncoder();
  const state = { buffer: '', decoder: new TextDecoder() };
  let timeoutId;

  async function expectResponse(step, expectedCode) {
    const response = await readSmtpResponse(reader, state);
    if (response.code !== expectedCode) {
      throw smtpError(step, expectedCode, response.code);
    }
  }

  async function command(line, step, expectedCode) {
    await writer.write(encoder.encode(`${line}\r\n`));
    await expectResponse(step, expectedCode);
  }

  const smtpSession = (async () => {
    await expectResponse('saludo', 220);
    await command('EHLO mindtech-web', 'EHLO', 250);
    await command('AUTH LOGIN', 'AUTH LOGIN', 334);
    await command(btoa(env.MAIL_USERNAME), 'usuario de autenticación', 334);
    await command(btoa(env.MAIL_PASSWORD), 'contraseña de autenticación', 235);
    await command(`MAIL FROM:<${stripHeaderNewlines(env.MAIL_FROM)}>`, 'MAIL FROM', 250);
    await command(`RCPT TO:<${stripHeaderNewlines(env.CONTACT_TO)}>`, 'RCPT TO', 250);
    await command('DATA', 'DATA', 354);
    await writer.write(encoder.encode(`${mimeMessage}\r\n.\r\n`));
    await expectResponse('envío del mensaje', 250);
    await command('QUIT', 'QUIT', 221);
  })();

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      socket.close();
      reject(new Error('SMTP agotó el tiempo de espera de 15 segundos.'));
    }, SMTP_TIMEOUT_MS);
  });

  try {
    await Promise.race([smtpSession, timeout]);
  } finally {
    clearTimeout(timeoutId);
    reader.releaseLock();
    writer.releaseLock();
    socket.close();
  }
}

export async function onRequestPost(context) {
  let payload;

  try {
    payload = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, message: 'El cuerpo debe ser JSON válido.' }, 400);
  }

  const validation = validatePayload(payload);
  if (!validation.ok) {
    return jsonResponse({ ok: false, message: validation.message }, 400);
  }

  const env = context.env || {};
  const requiredSettings = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USERNAME', 'MAIL_PASSWORD', 'MAIL_FROM', 'CONTACT_TO'];
  if (requiredSettings.some((key) => !env[key])) {
    return jsonResponse({ ok: false, message: 'Configuración incompleta' }, 500);
  }

  try {
    const mimeMessage = buildMimeMessage(validation.value, env);
    await sendSmtpMessage(env, mimeMessage);
    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    console.error('Error al enviar la consulta por SMTP:', error instanceof Error ? error.message : error);
    return jsonResponse({ ok: false, message: 'No se pudo enviar la consulta' }, 502);
  }
}
