const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// `npm test` corre `pretest` (webpack build), así que dist/index.html es requerido.
const distIndexPath = path.join(__dirname, '../dist/index.html');
const html = fs.readFileSync(distIndexPath, 'utf8');

test('should_contain_contact_form_with_all_fields', () => {
  assert.match(html, /<form[\s>]/i);
  for (const field of ['name', 'company', 'email', 'service', 'message']) {
    assert.match(html, new RegExp(`name="${field}"`), `falta el campo name="${field}"`);
  }
});

test('should_contain_section_anchors', () => {
  for (const id of ['soluciones', 'precios', 'tecnologias', 'proyectos', 'empresa', 'ia-responsable']) {
    assert.match(html, new RegExp(`id="${id}"`), `falta el ancla id="${id}"`);
  }
});

test('should_declare_spanish_lang', () => {
  assert.match(html, /<html[^>]*\slang="es"/i);
});

test('should_have_non_empty_title', () => {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  assert.ok(match, 'falta <title>');
  assert.ok(match[1].trim().length > 0, '<title> vacio');
});

test('should_include_canonical_and_json_ld_in_head', () => {
  const head = html.match(/<head[\s>][\s\S]*?<\/head>/i);
  assert.ok(head, 'falta <head>');
  assert.match(head[0], /<link[^>]*rel="canonical"/i, 'falta canonical en el head');
  assert.match(head[0], /<script[^>]*type="application\/ld\+json"/i, 'falta JSON-LD en el head');
});
