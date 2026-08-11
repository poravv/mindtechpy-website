const { test, before } = require('node:test');
const assert = require('node:assert/strict');

let validatePayload;
let buildMimeMessage;

before(async () => {
  ({ validatePayload, buildMimeMessage } = await import('../functions/api/contact.js'));
});

const validPayload = {
  name: 'Ana Gómez',
  email: 'ana@example.com',
  company: 'Acme Paraguay',
  service: 'Desarrollo web',
  message: 'Hola, necesito una propuesta para nuestro nuevo sitio web.'
};

const env = {
  MAIL_FROM: 'contacto@mindtech.com.py',
  CONTACT_TO: 'ventas@mindtech.com.py'
};

test('should_reject_empty_contact_payload', () => {
  const result = validatePayload({});
  assert.equal(result.ok, false);
  assert.match(result.message, /nombre/i);
});

test('should_reject_invalid_contact_email', () => {
  const result = validatePayload({ ...validPayload, email: 'email-invalido' });
  assert.equal(result.ok, false);
  assert.match(result.message, /email/i);
});

test('should_reject_contact_message_that_is_too_short', () => {
  const result = validatePayload({ ...validPayload, message: 'Corto' });
  assert.equal(result.ok, false);
  assert.match(result.message, /mensaje/i);
});

test('should_accept_valid_contact_payload', () => {
  const result = validatePayload(validPayload);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, validPayload);
});

test('should_build_a_safe_utf8_mime_message', () => {
  const mime = buildMimeMessage({
    ...validPayload,
    name: 'Ana\r\nBcc: intruso@example.com',
    email: 'ana@example.com\r\nBcc: intruso@example.com',
    message: 'Primera línea\n.punto inicial\nÚltima línea'
  }, env);

  assert.match(mime, /^From: MindTech Web <contacto@mindtech\.com\.py>\r$/m);
  assert.match(mime, /^To: ventas@mindtech\.com\.py\r$/m);
  assert.match(mime, /^Reply-To: ana@example\.comBcc: intruso@example\.com\r$/m);
  assert.doesNotMatch(mime, /\r\nBcc:/);
  assert.match(mime, /\r\n\.\.punto inicial\r\n/);
  assert.match(mime, /^Subject: =\?UTF-8\?B\?.+\?=\r$/m);

  const subject = mime.match(/^Subject: =\?UTF-8\?B\?(.+)\?=\r$/m);
  assert.ok(subject);
  assert.equal(Buffer.from(subject[1], 'base64').toString('utf8'), 'Nueva consulta web — AnaBcc: intruso@example.com');
});
