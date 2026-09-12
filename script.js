/* ==========================================================
   GII Médicas — comportamiento del sitio
   ========================================================== */
(function () {
  'use strict';

  var WHATSAPP = '573116891425';
  var CORREO   = 'soportealternativosmedicos@gmail.com';

  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año actual en el pie ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ---------- Menú móvil ---------- */
  var boton = document.getElementById('hamburguesa');
  var menu = document.getElementById('menu');

  function cerrarMenu() {
    if (!menu || !boton) return;
    menu.classList.remove('esta-abierto');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
  }

  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('esta-abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') cerrarMenu();
    });

    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !boton.contains(e.target)) cerrarMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarMenu();
  });

  /* ---------- Sombra de la barra al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var actualizarNav = function () {
      nav.classList.toggle('is-fija', window.scrollY > 8);
    };
    actualizarNav();
    window.addEventListener('scroll', actualizarNav, { passive: true });
  }

  /* ==========================================================
     Hero (carrusel)
     ========================================================== */
  var pistaHero = document.getElementById('hero-pista');

  if (pistaHero) {
    var laminasHero = Array.prototype.slice.call(pistaHero.querySelectorAll('.hero__lamina'));
    var puntosHero  = Array.prototype.slice.call(document.querySelectorAll('.hero__punto'));
    var actualHero  = 0;
    var temporizadorHero = null;
    var INTERVALO_HERO = 3800;

    function mostrarHero(indice) {
      actualHero = (indice + laminasHero.length) % laminasHero.length;

      laminasHero.forEach(function (lamina, i) {
        var activa = i === actualHero;
        lamina.classList.toggle('es-activa', activa);
        lamina.setAttribute('aria-hidden', String(!activa));
        lamina.querySelectorAll('a').forEach(function (a) {
          a.tabIndex = activa ? 0 : -1;
        });
      });

      puntosHero.forEach(function (punto, i) {
        punto.classList.toggle('es-activo', i === actualHero);
        punto.setAttribute('aria-selected', String(i === actualHero));
      });
    }

    function avanzarHero()   { mostrarHero(actualHero + 1); }
    function retrocederHero(){ mostrarHero(actualHero - 1); }

    function arrancarHero() {
      if (sinMovimiento || laminasHero.length < 2) return;
      detenerHero();
      temporizadorHero = window.setInterval(avanzarHero, INTERVALO_HERO);
    }
    function detenerHero() {
      if (temporizadorHero) { window.clearInterval(temporizadorHero); temporizadorHero = null; }
    }
    function reiniciarHero() { detenerHero(); arrancarHero(); }

    var siguienteHero = document.getElementById('hero-next');
    var anteriorHero  = document.getElementById('hero-prev');

    if (siguienteHero) siguienteHero.addEventListener('click', function () { avanzarHero(); reiniciarHero(); });
    if (anteriorHero)  anteriorHero.addEventListener('click',  function () { retrocederHero(); reiniciarHero(); });

    puntosHero.forEach(function (punto, i) {
      punto.addEventListener('click', function () { mostrarHero(i); reiniciarHero(); });
    });

    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', detenerHero);
      hero.addEventListener('mouseleave', arrancarHero);
      hero.addEventListener('focusin', detenerHero);
      hero.addEventListener('focusout', arrancarHero);

      hero.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { avanzarHero(); reiniciarHero(); }
        if (e.key === 'ArrowLeft')  { retrocederHero(); reiniciarHero(); }
      });

      var inicioXHero = 0, inicioYHero = 0;
      hero.addEventListener('touchstart', function (e) {
        inicioXHero = e.changedTouches[0].clientX;
        inicioYHero = e.changedTouches[0].clientY;
        detenerHero();
      }, { passive: true });

      hero.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - inicioXHero;
        var dy = e.changedTouches[0].clientY - inicioYHero;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) avanzarHero(); else retrocederHero();
        }
        arrancarHero();
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) detenerHero(); else arrancarHero();
    });

    mostrarHero(0);
    arrancarHero();
  }

  /* ---------- Filtro de productos ---------- */
  var filtros = document.getElementById('filtros');
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('.producto[data-categoria]'));

  if (filtros && tarjetas.length) {
    filtros.addEventListener('click', function (e) {
      var btn = e.target.closest('.filtro');
      if (!btn) return;

      var categoria = btn.dataset.filtro;

      filtros.querySelectorAll('.filtro').forEach(function (f) {
        f.classList.toggle('is-activo', f === btn);
      });

      tarjetas.forEach(function (tarjeta) {
        var coincide = categoria === 'todos' || tarjeta.dataset.categoria === categoria;
        tarjeta.classList.toggle('esta-oculto', !coincide);
      });
    });
  }

  /* ==========================================================
     Ficha de producto (modal)
     ========================================================== */
  var modal = document.getElementById('modal');

  if (modal && tarjetas.length) {
    var mFoto      = document.getElementById('modal-foto');
    var mEnlaceFoto= document.getElementById('modal-enlace-foto');
    var mTitulo    = document.getElementById('modal-titulo');
    var mCategoria = document.getElementById('modal-categoria');
    var mTexto     = document.getElementById('modal-texto');
    var mWa        = document.getElementById('modal-wa');
    var mCorreo    = document.getElementById('modal-correo');
    var mCerrar    = document.getElementById('modal-cerrar');
    var ultimoFoco = null;

    var NOMBRES = {
      nls: 'Escáner NLS',
      biorresonancia: 'Biorresonancia',
      diagnostico: 'Diagnóstico',
      terapia: 'Terapia'
    };

    function abrir(tarjeta) {
      var img     = tarjeta.querySelector('.producto__media img');
      var nombre  = tarjeta.querySelector('.producto__nombre').textContent.trim();
      var detalle = tarjeta.querySelector('.producto__detalle');
      var ruta = img.getAttribute('src');

      mFoto.src = ruta;
      mFoto.alt = img.getAttribute('alt') || nombre;
      if (mEnlaceFoto) mEnlaceFoto.href = ruta;

      mTitulo.textContent = nombre;
      mCategoria.textContent = NOMBRES[tarjeta.dataset.categoria] || 'Equipo';
      mTexto.innerHTML = detalle ? detalle.innerHTML : '';

      var asunto = 'Cotización: ' + nombre;
      mWa.href = 'https://wa.me/' + WHATSAPP + '?text=' +
                 encodeURIComponent('Hola GII Médicas, quiero información y precio del ' + nombre + '.');
      mCorreo.href = 'mailto:' + CORREO +
                     '?subject=' + encodeURIComponent(asunto) +
                     '&body=' + encodeURIComponent('Hola, quiero información y precio del ' + nombre + '.\n\nPaís:\nCiudad:\nTeléfono:');

      ultimoFoco = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('esta-bloqueado');
      mCerrar.focus();
    }

    function cerrar() {
      modal.hidden = true;
      document.body.classList.remove('esta-bloqueado');
      if (ultimoFoco) ultimoFoco.focus();
    }

    tarjetas.forEach(function (tarjeta) {
      var disparador = tarjeta.querySelector('.producto__disparador');
      if (disparador) {
        disparador.addEventListener('click', function () { abrir(tarjeta); });
      }
    });

    mCerrar.addEventListener('click', cerrar);
    modal.querySelector('[data-cerrar]').addEventListener('click', cerrar);

    // El foco no debe escaparse de la ficha mientras está abierta
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var foco = modal.querySelectorAll('a[href], button:not([disabled])');
      if (!foco.length) return;
      var primero = foco[0];
      var ultimo = foco[foco.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault(); ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault(); primero.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) cerrar();
    });
  }

  /* ---------- Animación de entrada ---------- */
  var revelables = Array.prototype.slice.call(document.querySelectorAll('.revelar'));

  if (!sinMovimiento && 'IntersectionObserver' in window && revelables.length) {
    var observador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada, i) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('es-visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revelables.forEach(function (el) { observador.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add('es-visible'); });
  }

  /* ---------- Formulario -> WhatsApp ---------- */
  var formulario = document.getElementById('formulario');

  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();

      var requeridos = ['nombre', 'telefono', 'pais', 'mensaje'];
      var faltante = null;

      requeridos.forEach(function (id) {
        var campo = document.getElementById(id);
        var vacio = !campo.value.trim();
        campo.style.borderColor = vacio ? '#CA363A' : '';
        if (vacio && !faltante) faltante = campo;
      });

      if (faltante) {
        faltante.focus();
        return;
      }

      var valor = function (id) {
        var campo = document.getElementById(id);
        return campo ? campo.value.trim() : '';
      };

      var lineas = [
        'Hola GII Médicas, quiero una cotización.',
        '',
        'Nombre: ' + valor('nombre'),
        'Teléfono: ' + valor('telefono')
      ];

      if (valor('correo')) lineas.push('Correo: ' + valor('correo'));
      if (valor('pais'))   lineas.push('País: ' + valor('pais'));
      if (valor('ciudad')) lineas.push('Ciudad: ' + valor('ciudad'));
      if (valor('equipo')) lineas.push('Equipo de interés: ' + valor('equipo'));

      lineas.push('', 'Mensaje: ' + valor('mensaje'));

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lineas.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }
})();
