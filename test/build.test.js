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
  assert.match(html, /href="\/cookies"/);
});

test('should_build_each_legal_page_with_legal_identity_and_canonical', () => {
  for (const page of ['privacidad', 'terminos', 'eliminacion-de-datos', 'cookies']) {
    const legalHtml = fs.readFileSync(path.join(__dirname, `../dist/${page}.html`), 'utf8');
    assert.match(legalHtml, /RUC 80181095-7/, `${page}: falta el RUC`);
    assert.match(legalHtml, /MINDTECH E\.A\.S\. UNIPERSONAL/, `${page}: falta la razón social`);
    assert.match(legalHtml, /<meta name="author" content="MINDTECH E\.A\.S\. UNIPERSONAL"/, `${page}: meta author`);
    assert.match(legalHtml, /Andrés Valentín Vera Chávez/, `${page}: falta el propietario`);
    assert.match(legalHtml, /Capiatá, Central, Paraguay/, `${page}: falta el domicilio`);
    assert.ok(legalHtml.includes('Las Palmeras c/ Estudiantes Capiateños 627'), `${page}: falta la dirección`);
    assert.match(legalHtml, new RegExp(`rel="canonical" href="https://mindtechpy.net/${page}"`), `${page}: canonical`);
    assert.equal(legalHtml.match(/<h1[\s>]/g).length, 1, `${page}: debe tener un solo h1`);
  }
});

test('should_cover_gift_hub_meta_permissions_and_deletion_when_building_legal_pages', () => {
  const privacy = fs.readFileSync(path.join(__dirname, '../dist/privacidad.html'), 'utf8');
  assert.match(privacy, /id="gift-hub"/);
  assert.match(privacy, /whatsapp_business_management/);
  assert.match(privacy, /whatsapp_business_messaging/);
  assert.match(privacy, /Embedded Signup/);

  const deletion = fs.readFileSync(path.join(__dirname, '../dist/eliminacion-de-datos.html'), 'utf8');
  assert.match(deletion, /id="gift-hub"/);
  assert.match(privacy, /href="\/eliminacion-de-datos#gift-hub"/);
});

test('should_publish_sitemap_and_robots_at_dist_root', () => {
  const sitemap = fs.readFileSync(path.join(__dirname, '../dist/sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/mindtechpy\.net\/privacidad</);
  assert.match(sitemap, /https:\/\/mindtechpy\.net\/cookies</);
  assert.ok(fs.existsSync(path.join(__dirname, '../dist/robots.txt')), 'falta dist/robots.txt');
});

test('should_build_gifthub_page_with_faq_schema_matching_visible_faq', () => {
  const page = fs.readFileSync(path.join(__dirname, '../dist/gifthub.html'), 'utf8');
  assert.match(page, /rel="canonical" href="https:\/\/mindtechpy.net\/gifthub"/);
  assert.equal(page.match(/<h1[\s>]/g).length, 1, 'debe tener un solo h1');

  const graph = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const faq = graph.find((node) => node['@type'] === 'FAQPage');
  const visibleQuestions = [...page.matchAll(/<summary>([^<]+)<\/summary>/g)].map((m) => m[1].trim());
  assert.deepEqual(faq.mainEntity.map((q) => q.name), visibleQuestions);

  const sitemap = fs.readFileSync(path.join(__dirname, '../dist/sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/mindtechpy\.net\/gifthub</);
});

test('should_serve_gifthub_share_image_referenced_by_meta_tags', () => {
  const page = fs.readFileSync(path.join(__dirname, '../dist/gifthub.html'), 'utf8');
  const imageUrl = page.match(/<meta property="og:image" content="https:\/\/mindtechpy\.net\/([^"]+)"/)[1];
  assert.equal(imageUrl, 'images/gifthub/og-gifthub.png');
  assert.match(page, new RegExp(`<meta name="twitter:image" content="https://mindtechpy\\.net/${imageUrl}"`));
  assert.ok(fs.existsSync(path.join(__dirname, '../dist', imageUrl)), `falta dist/${imageUrl}`);
});

const distDir = path.join(__dirname, '../dist');
const builtPages = fs.readdirSync(distDir).filter((file) => file.endsWith('.html'));

test('should_not_contain_previous_owner_tax_id_when_building_any_page', () => {
  // Partido para que `git grep` del RUC anterior siga dando vacío en el repo
  const previousTaxId = '5379' + '057';
  assert.equal(builtPages.length, 8);
  for (const page of builtPages) {
    assert.ok(!fs.readFileSync(path.join(distDir, page), 'utf8').includes(previousTaxId), `${page}: RUC anterior`);
  }
});

test('should_show_new_identity_and_cookies_link_in_footer_of_every_page', () => {
  for (const page of builtPages) {
    const pageHtml = fs.readFileSync(path.join(distDir, page), 'utf8');
    assert.match(pageHtml, /MindTechPy · MINDTECH E\.A\.S\. UNIPERSONAL · RUC 80181095-7 · Capiatá, Central, Paraguay/, `${page}: footer`);
    const footer = pageHtml.match(/<footer[\s\S]*<\/footer>/)[0];
    assert.match(footer, /href="\/cookies"/, `${page}: falta el enlace a Cookies`);
  }
});

test('should_not_load_adsense_from_home_html_when_built', () => {
  assert.doesNotMatch(html, /adsbygoogle\.js/);
  assert.match(html, /<meta name="google-adsense-account" content="ca-pub-9482252021980242"/);
  assert.ok(fs.existsSync(path.join(distDir, 'ads.txt')), 'falta dist/ads.txt');
});

test('should_keep_cookie_notice_hidden_with_both_choices_when_building_home', () => {
  const notice = html.match(/<div[^>]*id="cookie-notice"[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(notice, 'falta el aviso de cookies');
  assert.match(notice[0], /role="region"/);
  assert.match(notice[0], /aria-label="Aviso de cookies"/);
  assert.match(notice[0], /\shidden/);
  assert.match(notice[0], /href="\/cookies"/);
  assert.match(notice[0], /data-cookie-choice="accepted"/);
  assert.match(notice[0], /data-cookie-choice="rejected"/);
});

test('should_publish_home_organization_with_company_legal_name_and_tax_id', () => {
  const organization = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(organization.legalName, 'MINDTECH E.A.S. UNIPERSONAL');
  assert.equal(organization.taxID, '80181095-7');
  assert.equal(organization.founder.name, 'Andrés Valentín Vera Chávez');
});

test('should_build_cookies_page_with_table_and_consent_controls', () => {
  const page = fs.readFileSync(path.join(distDir, 'cookies.html'), 'utf8');
  assert.match(page, /<caption/);
  assert.match(page, /mindtechpy-cookie-consent/);
  assert.match(page, /https:\/\/policies\.google\.com\/technologies\/ads/);
  assert.match(page, /Ley 4868\/2013/);
  assert.match(page, /id="cookie-controls"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /data-cookie-choice="accepted"/);
  assert.match(page, /data-cookie-choice="rejected"/);
});
