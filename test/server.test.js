const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

// Aislar entorno ANTES de requerir la app: sin logs de debug
process.env.NODE_ENV = 'test';
process.env.DEBUG = 'false';

const app = require('../src/infrastructure/server');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('should_respond_ok_when_health_check_is_requested', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('should_serve_each_legal_page_at_its_clean_url', async () => {
  for (const route of ['/privacidad', '/terminos', '/eliminacion-de-datos']) {
    const res = await fetch(`${baseUrl}${route}`);
    assert.equal(res.status, 200, `${route} no responde 200`);
    assert.match(await res.text(), /RUC 5379057-0/, `${route} no contiene el RUC`);
  }
});

test('should_serve_gifthub_landing_at_its_clean_url', async () => {
  const res = await fetch(`${baseUrl}/gifthub`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /<h1[^>]*>Atendé, vendé y fidelizá por WhatsApp/);
});
