// Build estático sin framework — arma cada página a partir de partials/ + content/
// Sin dependencias npm: solo `fs` y `path` del propio Node.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'content');
const PARTIALS_DIR = path.join(ROOT, 'partials');
const OUT_DIR = path.join(ROOT, 'dist');

const SITE_URL = 'https://giimedicas.com';

const PAGES = [
  {
    slug: 'inicio',
    file: 'inicio.html',
    out: 'index.html',
    title: 'GII Médicas | Mayorista en Equipos Médicos Alternativos',
    description: 'Mayorista en equipos médicos alternativos con conexión directa con fabricantes de Estados Unidos y China. Bioplasm 10D NLS, Metatron Hunter, Biophilia, iridoscopios, desintoxicador iónico y más. Envíos a toda Latinoamérica.',
    ogImage: 'assets/img/banner/hero-portada.jpg',
  },
  {
    slug: 'productos',
    file: 'productos.html',
    out: 'productos.html',
    title: 'Catálogo de equipos | GII Médicas',
    description: 'Escáneres NLS, biorresonancia, iridoscopios y sistemas de desintoxicación. Catálogo completo con ficha técnica y cotización directa por WhatsApp.',
    ogImage: 'assets/img/bioplasm-10d-v2.jpg',
  },
  {
    slug: 'nosotros',
    file: 'nosotros.html',
    out: 'nosotros.html',
    title: 'Quiénes somos | GII Médicas',
    description: 'Más de 15 años suministrando equipos médicos alternativos a terapeutas y distribuidores de toda Latinoamérica, con conexión directa a fábrica.',
    ogImage: 'assets/img/nosotros-editorial.jpg',
  },
  {
    slug: 'como-comprar',
    file: 'como-comprar.html',
    out: 'como-comprar.html',
    title: 'Cómo comprar | GII Médicas',
    description: 'Desde el primer mensaje hasta el equipo funcionando en su consultorio: cuatro pasos, sin vueltas.',
    ogImage: 'assets/img/banner/hero-portada.jpg',
  },
  {
    slug: 'terminos',
    file: 'terminos.html',
    out: 'terminos.html',
    title: 'Términos y condiciones | GII Médicas',
    description: 'Condiciones generales de cotización, pago, entrega, garantía y datos personales para toda compra realizada con GII Médicas.',
    ogImage: 'assets/img/banner/hero-portada.jpg',
  },
  {
    slug: 'contacto',
    file: 'contacto.html',
    out: 'contacto.html',
    title: 'Contáctenos | GII Médicas',
    description: 'Pida su cotización. Respondemos el mismo día hábil por WhatsApp, teléfono o correo.',
    ogImage: 'assets/img/banner/hero-portada.jpg',
  },
];

const NAV_KEYS = {
  inicio: 'NAV_INICIO',
  productos: 'NAV_PRODUCTOS',
  nosotros: 'NAV_NOSOTROS',
  'como-comprar': 'NAV_COMO_COMPRAR',
  contacto: 'NAV_CONTACTO',
};

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

function buildHead(page) {
  const canonical = page.out === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${page.out}`;
  const jsonLd = page.slug === 'inicio' ? `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GII Médicas",
  "description": "Mayorista en equipos médicos alternativos con importación directa desde Estados Unidos y China.",
  "url": "${SITE_URL}/",
  "logo": "${SITE_URL}/assets/img/logo-gii-medicas.png",
  "email": "drchristianpedraza@gmail.com",
  "telephone": "+573116891425",
  "areaServed": ["CO","MX","PE","CL","AR","EC","BO","PA","CR","GT","DO","UY","PY","VE","SV","HN","NI"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+573116891425",
    "email": "drchristianpedraza@gmail.com",
    "contactType": "sales",
    "availableLanguage": ["es"]
  }
}
</script>` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="author" content="GII Médicas">
<meta name="theme-color" content="#062E39">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="website">
<meta property="og:locale" content="es_419">
<meta property="og:site_name" content="GII Médicas">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/${page.ogImage}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>document.documentElement.className+=" js";</script>
<link rel="stylesheet" href="styles.css">
${jsonLd}
</head>
<body>
`;
}

function withNavActive(headerTpl, currentSlug) {
  let html = headerTpl;
  for (const [slug, token] of Object.entries(NAV_KEYS)) {
    html = html.replace(`{{${token}}}`, slug === currentSlug ? 'class="is-activo"' : '');
  }
  return html;
}

function build() {
  rimraf(OUT_DIR);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const headerTpl = fs.readFileSync(path.join(PARTIALS_DIR, 'header.html'), 'utf8');
  const footerTpl = fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8');
  const catalogoTpl = fs.readFileSync(path.join(PARTIALS_DIR, 'catalogo.html'), 'utf8');
  const videoTpl = fs.readFileSync(path.join(PARTIALS_DIR, 'video.html'), 'utf8');

  for (const page of PAGES) {
    const bodyPath = path.join(CONTENT_DIR, page.file);
    let body = fs.readFileSync(bodyPath, 'utf8');
    body = body.replace('<!--CATALOGO-->', catalogoTpl);
    body = body.replace('<!--VIDEO-->', videoTpl);
    const header = withNavActive(headerTpl, page.slug);

    const html = buildHead(page) + header + body + footerTpl + '\n</body>\n</html>\n';

    fs.writeFileSync(path.join(OUT_DIR, page.out), html, 'utf8');
    console.log('  ✓', page.out);
  }

  for (const asset of ['assets', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', '_headers']) {
    copyRecursive(path.join(ROOT, asset), path.join(OUT_DIR, asset));
  }

  console.log('\nBuild listo en /dist');
}

build();
