// Load Alpine.js
var alpine = document.createElement('script');
alpine.defer = true;
alpine.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';
document.head.appendChild(alpine);

// Burger menu
(function () {
    var burgerBtn = document.getElementById('burger-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    function openMobileMenu() { if (!mobileMenu || !burgerBtn) return; mobileMenu.classList.add('open'); burgerBtn.classList.add('active'); burgerBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
    function closeMobileMenu() { if (!mobileMenu || !burgerBtn) return; mobileMenu.classList.remove('open'); burgerBtn.classList.remove('active'); burgerBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    function toggleMobileMenu() { mobileMenu && mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu(); }

    if (burgerBtn) burgerBtn.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach(function (link) { link.addEventListener('click', function () { closeMobileMenu(); }); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobileMenu(); });
})();

// Scripts 
if (document.getElementById('proto-modal')) {
    (function () {
        var modal = document.getElementById('proto-modal');
        var openBtn = document.getElementById('open-proto-form');
        var closeBtn = document.getElementById('close-proto-form');
        var cancelBtn = document.getElementById('cancel-proto');
        var form = document.getElementById('proto-form');
        var lastFocus;

        /* Todos los elementos enfocables dentro del modal */
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
            /* Mover foco al primer elemento interactivo del modal */
            var focusable = getFocusable();
            if (focusable.length) focusable[0].focus();
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            /* Devolver foco al elemento que abrió el modal */
            if (lastFocus) lastFocus.focus();
        }

        /* Focus trap dentro del modal */
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
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (modal) modal.addEventListener('click', function (e) {
            if (e.target && e.target.classList && e.target.classList.contains('overlay')) closeModal();
        });

        /* ESC cierra cualquier overlay abierto */
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { closeModal(); closeMobileMenu(); }
        });

        /* Formulario → WhatsApp */
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
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