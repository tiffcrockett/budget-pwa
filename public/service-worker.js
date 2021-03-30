// cache of file to be used offline
const FILES_TO_CACHE = [
    "/",
    '/index.html',
    '/index.js',
    '/assets/images/icons/hand4.png', 
    '/assets/css/styles.css',
    '/db.js',
    '/manifest.webmanifest',
    '/service-worker.js', 
  ]; 
// cache names
  const PRECACHE = 'precache-v1';
  const DATA_CACHE = 'runtime';
  
  // self reference to confirm installatio of this svc wkr
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  // The activate handler takes care of cleaning up old caches.
  self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, DATA_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  // sw hears fetch request, records action in cache
  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/transction")) {
      event.respondWith(
        caches.open(DATA_CACHE).then((cache) => {
          return fetch(event.request)
          .then((response) => {  
            // response is good, record and store in cache
            if (response.status === 200 ){
              cache.put(event.request.url, response.clone());
            }
             return response;
          }) 
          // network fail-no internet, return cache 
          .catch((err) => {
            return cache.match(event.request);
          })
        })
      );
    }
  });
  