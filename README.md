# GII Médicas — Sitio web

Sitio web de **GII Médicas**, mayorista en equipos médicos alternativos.
Diseño propio con identidad de marca (paleta extraída del logo, tipografía de
sistema estilo Apple), estructurado en páginas reales por tema en vez de una
sola landing page larga.

Cobertura comercial: **toda Latinoamérica**, con envíos por transportadora y
courier internacional.

## Arquitectura — build mínimo sin framework

El sitio sigue siendo HTML/CSS/JS puro, **sin dependencias npm**. Lo único que
cambió es que ya no es una sola página: un script de Node (`build.js`, solo usa
`fs`/`path` del propio Node) arma cada página final combinando un header y un
footer compartidos con el contenido propio de cada una.

```
partials/header.html   Encabezado + nav + <main> de apertura (compartido)
partials/footer.html   </main> + pie + botón flotante + <script> (compartido)
content/*.html         Cuerpo de cada página, sin head/header/footer
build.js               Arma cada página final y la escribe en /dist
dist/                  Salida del build — esto es lo que se publica (generado, no se versiona)
```

Páginas: `inicio.html` → `index.html`, `productos.html`, `nosotros.html`,
`como-comprar.html`, `terminos.html`, `contacto.html`. El nav activo
(`is-activo`) se resuelve en el build según la página, no con JavaScript.

### Compilar y ver en local

```bash
node build.js               # arma /dist
cd dist && python -m http.server 8080   # o: npx serve dist
```

Luego abra <http://localhost:8080>.

## Contenido

```
styles.css                 Hoja de estilos (tokens de marca, sin dependencias)
script.js                  Menú móvil, filtros de catálogo, ficha modal, formulario
assets/img/logo-gii-medicas.png   Logo real de marca
assets/img/*.jpg            Fotografía de catálogo (estudio, consistente entre los 11 equipos)
assets/img/banner/          Imagen del hero de portada
assets/img/archivo-proveedor/  Fotos originales del proveedor (referencia, ya no se usan)
assets/video/                Video de demostración y su imagen de portada
robots.txt · sitemap.xml    SEO básico (una URL por página)
_headers                    Cabeceras de seguridad y caché (Cloudflare Pages)
```

## Características

- **Identidad de marca propia**: paleta petróleo/coral extraída del logo,
  tipografía de sistema (`-apple-system`, igual que apple.com — sin webfont
  externa), radios y sombras contenidos (sin píldoras ni glow de color).
- **Responsive** desde 320 px hasta escritorio.
- **Hero de portada** con una sola imagen ancha (sin carrusel).
- **Catálogo con formato de ficha técnica**: cada equipo tiene categoría, código
  de referencia, specs clave en línea y una ficha completa en modal con tabla
  de especificaciones real (no lista con viñetas).
- **Video de demostración** con imagen de portada y `preload="none"`.
- **Formulario que abre WhatsApp** con el mensaje ya redactado — no requiere backend.
- **SEO**: metadatos Open Graph y `schema.org/Organization` por página,
  `sitemap.xml` con una entrada por URL.
- **Accesibilidad**: navegación por teclado, `aria-*` en el menú y el modal,
  foco atrapado dentro de la ficha, `prefers-reduced-motion`.

## Contacto configurado

| Dato | Valor |
|---|---|
| Teléfono / WhatsApp | +57 311 689 1425 |
| Correo | drchristianpedraza@gmail.com |

Para cambiarlos, busque `573116891425` en `script.js` (constante `WHATSAPP`) y
en `content/*.html`/`partials/*.html`, y `drchristianpedraza@gmail.com` en los
mismos archivos.

## Publicar

**Cloudflare Pages** — build command: `node build.js` · directorio de salida: `dist`.

Para usar el dominio `giimedicas.com`, agregue el registro DNS que indique
Cloudflare Pages.

## Aviso

Los equipos corresponden a medicina alternativa y complementaria. El contenido del
sitio es de carácter comercial y no constituye consejo médico ni sustituye el
diagnóstico o tratamiento profesional.
