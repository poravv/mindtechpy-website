const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Aislar entorno ANTES de requerir la app: sin SMTP, sin data/ real, sin logs de debug
process.env.NODE_ENV = 'test';
process.env.DEBUG = 'false';
const tempDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mindtechpy-test-'));
process.env.DATA_DIR = tempDataDir;

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
  fs.rmSync(tempDataDir, { recursive: true, force: true });
});

function postJson(route, body, ip) {
  return fetch(`${baseUrl}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': ip
    },
    body: JSON.stringify(body)
  });
}

test('should_respond_ok_when_health_check_is_requested', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('should_return_visitor_stats_with_expected_shape', async () => {
  const res = await fetch(`${baseUrl}/api/visitors/stats`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(typeof body.data.totalVisits, 'number');
});

test('should_count_visit_once_when_same_ip_visits_twice', async () => {
  const ip = '203.0.113.10';

  const first = await postJson('/api/visitors/visit', {}, ip);
  assert.equal(first.status, 200);
  const firstBody = await first.json();
  assert.equal(firstBody.success, true);
  assert.equal(firstBody.data.isNewVisit, true);

  const second = await postJson('/api/visitors/visit', {}, ip);
  assert.equal(second.status, 200);
  const secondBody = await second.json();
  assert.equal(secondBody.data.isNewVisit, false);
  assert.equal(secondBody.data.totalVisits, firstBody.data.totalVisits);
});

test('should_reject_contact_when_payload_is_empty', async () => {
  const res = await postJson('/api/contact', {}, '203.0.113.20');
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
});

test('should_reject_contact_when_email_is_invalid', async () => {
  const res = await postJson('/api/contact', {
    name: 'Juan Perez',
    email: 'no-es-un-email',
    message: 'Hola, quiero consultar por un desarrollo web.'
  }, '203.0.113.21');
  assert.equal(res.status, 400);
});

test('should_reject_contact_when_message_is_too_short', async () => {
  const res = await postJson('/api/contact', {
    name: 'Juan Perez',
    email: 'juan@example.com',
    message: 'corto'
  }, '203.0.113.22');
  assert.equal(res.status, 400);
});

test('should_accept_contact_and_persist_it_when_payload_is_valid', async () => {
  const res = await postJson('/api/contact', {
    name: 'Juan Perez',
    email: 'juan@example.com',
    company: 'Acme',
    service: 'web',
    message: 'Hola, quiero consultar por un desarrollo web.'
  }, '203.0.113.23');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);

  const contacts = JSON.parse(
    fs.readFileSync(path.join(tempDataDir, 'contacts.json'), 'utf8')
  );
  assert.equal(contacts.length, 1);
  assert.equal(contacts[0].email, 'juan@example.com');
});
