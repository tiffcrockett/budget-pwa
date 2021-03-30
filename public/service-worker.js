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
  
  // self reference to confirm installation of this svc wkr 
  // svc wkr open precache and beging caching Files To Cache
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  // The activate handler takes care of cleaning up old caches
  // Once the service worker has been activated, it performs the following
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
  // When service worker encouters a fetch request, records action in cache 
  // this code uses Native JS fetch event 
  // fetch transaction, respond with cache...
  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/transction")) {
      event.respondWith(
        caches.open(DATA_CACHE).then((cache) => {
          return fetch(event.request)
          .then((response) => {  
            // response is good send 200, put clone of response in cache, send req to browsr
            if (response.status === 200 ){
              cache.put(event.request.url, response.clone());
            }
             return response;
          }) 
          // network request fails and cannot fetch, return cache 
          .catch((err) => {
            return cache.match(event.request);
          })
        })
      );
    }
  });
  