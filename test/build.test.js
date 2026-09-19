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

test('should_not_embed_legal_texts_in_home', () => {
  assert.doesNotMatch(html, /id="legal(-terminos|-privacidad)?"/);
  assert.match(html, /href="\/privacidad"/);
  assert.match(html, /href="\/terminos"/);
  assert.match(html, /href="\/eliminacion-de-datos"/);
});

test('should_build_each_legal_page_with_legal_identity_and_canonical', () => {
  for (const page of ['privacidad', 'terminos', 'eliminacion-de-datos']) {
    const legalHtml = fs.readFileSync(path.join(__dirname, `../dist/${page}.html`), 'utf8');
    assert.match(legalHtml, /RUC 5379057-0/, `${page}: falta el RUC`);
    assert.match(legalHtml, /Andrés Valentín Vera Chávez/, `${page}: falta el titular`);
    assert.match(legalHtml, new RegExp(`rel="canonical" href="https://mindtechpy.net/${page}"`), `${page}: canonical`);
    assert.equal(legalHtml.match(/<h1[\s>]/g).length, 1, `${page}: debe tener un solo h1`);
  }
});

test('should_publish_sitemap_and_robots_at_dist_root', () => {
  const sitemap = fs.readFileSync(path.join(__dirname, '../dist/sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/mindtechpy\.net\/privacidad</);
  assert.ok(fs.existsSync(path.join(__dirname, '../dist/robots.txt')), 'falta dist/robots.txt');
});
