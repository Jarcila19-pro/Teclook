// Burger menu
(function () {
  var burgerBtn = document.getElementById('burger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!burgerBtn || !mobileMenu) return;
  var mobileLinks = mobileMenu.querySelectorAll('a');
  var closeBtn = mobileMenu.querySelector('.close-menu-btn');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    burgerBtn.classList.add('active');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    burgerBtn.classList.remove('active');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  }

  burgerBtn.addEventListener('click', toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });
})();

// Loader
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  var img = loader.querySelector('.l-img');
  if (!img) return;

  function animate() {
    img.style.transition = 'opacity 0.3s ease';
    img.style.opacity = '1';
    setTimeout(function () {
      img.style.transition = 'none';
      loader.classList.add('melt');
      setTimeout(function () {
        loader.classList.add('hidden');
        document.documentElement.classList.add('loaded');
      }, 1000);
    }, 600);
  }

  if (document.readyState === 'complete') {
    setTimeout(animate, 200);
  } else {
    window.addEventListener('load', function () {
      setTimeout(animate, 200);
    });
  }

  setTimeout(function () {
    loader.classList.add('hidden');
    document.documentElement.classList.add('loaded');
  }, 4000);
})();

// Modal form
if (document.getElementById('proto-modal')) {
  (function () {
    var modal = document.getElementById('proto-modal');
    var openBtn = document.getElementById('open-proto-form');
    var closeBtn = document.getElementById('close-proto-form');
    var cancelBtn = document.getElementById('cancel-proto');
    var form = document.getElementById('proto-form');
    var lastFocus;

    function getFocusable() {
      return Array.from(modal.querySelectorAll(
        'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
      ));
    }

    function openModal() {
      if (!modal) return;
      lastFocus = document.activeElement;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    if (modal) {
      modal.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var focusable = getFocusable();
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    var openBtnCta = document.getElementById('open-proto-form-cta');
    if (openBtnCta) openBtnCta.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', function (e) {
      if (!e.target.closest('.modal-inner')) closeModal();
    });

    if (!form) return;

    var presupuestoInput = document.getElementById('presupuesto');
    if (presupuestoInput) {
      presupuestoInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.checkValidity && !form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.classList.add('ring-2', 'ring-red-500/60');
          setTimeout(function () { firstInvalid.classList.remove('ring-2', 'ring-red-500/60'); }, 2000);
        }
        return;
      }
      var phone = '573156090975';
      function val(id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; }
      var plan = val('plan');
      var nombre = val('nombre');
      var whatsapp = val('whatsapp');
      var email = val('email');
      var ciudad = val('ciudad');
      var servicio = val('servicio');
      var presupuesto = val('presupuesto');
      var message = [
        'vengo del Ecosistema de Teclook', '',
        'Plan: ' + plan,
        'Nombre: ' + nombre,
        'WhatsApp: ' + whatsapp,
        'Email: ' + (email || '-'),
        'Ciudad: ' + (ciudad || '-'),
        'Servicio: ' + servicio,
        'Presupuesto: ' + presupuesto
      ].join('\n');
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
      closeModal();
    });
  })();
}

// Escape key handler (unified - closes modal first, then burger menu)
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var modal = document.getElementById('proto-modal');
    if (modal && !modal.classList.contains('hidden')) {
      var closeBtns = modal.querySelectorAll('#close-proto-form, #cancel-proto');
      closeBtns.forEach(function (btn) { btn.click(); });
      return;
    }
    var mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      var bb = document.getElementById('burger-btn');
      if (bb) { bb.classList.remove('active'); bb.setAttribute('aria-expanded', 'false'); }
      document.body.style.overflow = '';
    }
  }
});