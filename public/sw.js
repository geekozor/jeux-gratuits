// Hors-ligne : l'app s'ouvre même sans réseau, avec la dernière liste connue.
const CACHE = 'jeux-v5';
const COQUILLE = ['./', 'index.html', 'style.css', 'app.js', 'noms.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png'];

// skipWaiting : la nouvelle version remplace l'ancienne tout de suite, sans attendre que l'app soit fermée.
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(COQUILLE)).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
));

// Réseau d'abord (pour avoir la liste fraîche), cache si hors-ligne.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    // no-cache : GitHub Pages autorise 10 min de cache, Safari le garde ; on redemande toujours la version à jour.
    fetch(e.request, { cache: 'no-cache' })
      .then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request))
  );
});
