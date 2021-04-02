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
  const CACHE_NAME = "static-cache-v2";
  const DATA_CACHE_NAME = "data-cache-v1";
  
  // self reference to confirm installation of this svc wkr 
  // svc wkr open precache and beging caching Files To Cache
  self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });
  
  // The activate handler takes care of cleaning up old caches
  // Once the service worker has been activated, it performs the following
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });
  // When service worker encouters a fetch request, records action in cache 
  // this code uses Native JS fetch event 
  // fetch transaction, respond with cache...
  self.addEventListener("fetch", evt => {
    if(evt.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch(data)', evt.request.url);
    
evt.respondWith(
                caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200){
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            })
            );
            return;
        }

evt.respondWith(
    caches.open(CACHE_NAME).then( cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});