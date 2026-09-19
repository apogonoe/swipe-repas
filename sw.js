/* Service worker : met la coquille de l'app en cache pour un démarrage
   hors-ligne. Les fichiers de données sont gérés séparément par la page
   (cache `mm-data-v1`), parce qu'ils sont gros et versionnés à part.
   Incrémenter V invalide la coquille chez tous les clients. */
const V = 'mm-shell-v2';
const COQUILLE = ['./', 'index.html', 'manifest.webmanifest',
                  'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('mm-shell-') && k !== V)
                              .map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Les données passent par le cache applicatif, pas par ici.
  if(/\.(json|bin|pack)$/.test(u.pathname)) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(rep => {
      if(rep.ok && rep.type === 'basic'){
        const copie = rep.clone();
        caches.open(V).then(c => c.put(e.request, copie)).catch(()=>{});
      }
      return rep;
    }).catch(() => caches.match('index.html')))
  );
});
