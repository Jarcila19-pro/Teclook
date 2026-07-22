// Service Worker para cache offline - TECLOOK
const CACHE_NAME = 'teclook-v1.4.0';

function offlineResponse() {
    return new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }
    });
}

const urlsToCache = [
    '/assets/css/styles.min.css',
    '/assets/js/scripts.js',
    '/assets/js/tailwind-config.js',
    '/assets/img/logoteclook.png',
    '/assets/img/fondo-tec.webp',
    '/assets/img/bg-ia.jpg',
    '/assets/img/fondo-auto-procesos-2.png',
    '/assets/img/marketing%20digital.png',
    '/assets/img/Gemini_Generated_Image_545pq4545pq4545p_PhotoGrid.png',
    '/assets/video/ia.mp4',
    '/assets/animations/hero-robot.json',
    '/manifest.json'
];

// Instalación — pre-cachear assets de forma resiliente
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.allSettled(
                urlsToCache.map(url => cache.add(url).catch(() => {}))
            ))
            .then(() => self.skipWaiting())
    );
});

// Activación - limpiar caches antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', event => {
    // Network-first para peticiones de navegación (HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request).then(r => r || caches.match('/index.html')))
                .catch(() => offlineResponse())
        );
        return;
    }

    // Cache-first para assets locales, stale-while-revalidate para CDN
    event.respondWith(
        caches.match(event.request).then(cached => {
            const fetched = fetch(event.request).then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => cached || offlineResponse());

            return cached || fetched;
        }).catch(() => offlineResponse())
    );
});
