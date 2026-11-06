// Pestañas (Historia, Elenco, Equipo, Galería) y foto de Historia.
(function () {
  var pestanas = Array.prototype.slice.call(document.querySelectorAll('.pestana'));
  var foto = document.getElementById('foto-historia');
  var verFoto = document.querySelector('.ver-foto');
  var pestanaHistoria = document.getElementById('pestana-historia');
  var conRaton = window.matchMedia('(hover: hover)');

  function mostrarFoto(visible) {
    foto.classList.toggle('visible', visible);
    foto.setAttribute('aria-hidden', String(!visible));
    verFoto.textContent = visible ? '▸ Ocultar la foto del rodaje' : '▸ Ver la foto del rodaje';
  }

  function activar(pestana, opciones) {
    opciones = opciones || {};
    pestanas.forEach(function (p) {
      var activa = p === pestana;
      p.setAttribute('aria-selected', String(activa));
      p.tabIndex = activa ? 0 : -1;
      document.getElementById(p.getAttribute('aria-controls')).hidden = !activa;
    });
    if (opciones.foco) pestana.focus();
    if (opciones.hash !== false) {
      history.replaceState(null, '', '#' + pestana.getAttribute('aria-controls'));
    }
  }

  pestanas.forEach(function (p, i) {
    p.addEventListener('click', function () {
      var yaEnHistoria = p.getAttribute('aria-selected') === 'true';
      activar(p);
      // En pantallas táctiles, tocar «Historia» muestra u oculta la foto.
      if (p === pestanaHistoria && !conRaton.matches) {
        mostrarFoto(!(yaEnHistoria && foto.classList.contains('visible')));
      } else if (p !== pestanaHistoria) {
        mostrarFoto(false);
      }
    });

    // Flechas izquierda/derecha para moverse entre pestañas con el teclado.
    p.addEventListener('keydown', function (e) {
      var paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!paso) return;
      e.preventDefault();
      activar(pestanas[(i + paso + pestanas.length) % pestanas.length], { foco: true });
    });
  });

  // Con ratón: la foto aparece al pasar por «Historia» y se va al salir.
  pestanaHistoria.addEventListener('mouseenter', function () {
    if (conRaton.matches) mostrarFoto(true);
  });
  pestanaHistoria.addEventListener('mouseleave', function () {
    if (conRaton.matches) mostrarFoto(false);
  });

  verFoto.addEventListener('click', function () {
    mostrarFoto(!foto.classList.contains('visible'));
  });

  foto.addEventListener('click', function () {
    mostrarFoto(false);
  });

  // Abrir directamente una pestaña desde el enlace (por ejemplo, miradas/#elenco).
  var inicial = document.getElementById('pestana-' + location.hash.slice(1));
  if (inicial) activar(inicial, { hash: false });
})();
