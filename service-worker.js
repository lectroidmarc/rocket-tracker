/**
 *
 */

var CACHE_NAME = 'cache-estes';
var urlsToCache = [
  '.',
  'index.html',

  'https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',

  'css/main.css',

  'https://code.getmdl.io/1.3.0/material.min.js',
  'https://www.gstatic.com/firebasejs/3.9.0/firebase.js',

  'js/geo-distance.js',
  'js/battery-icon.js',
  'js/localSetting.js',
  'js/rocketmap.js',
  'js/cards.js',
  'js/map.js',
  'js/auth.js',
  'js/misc.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // return cache.addAll(urlsToCache);

      // Do longhand caching to support 'no-cors' so we can pre-cache
      // the 3rd party library files.
      return urlsToCache.map(function (urlToPrefetch) {
        var request = new Request(urlToPrefetch, {
          mode: 'no-cors'
        });
        return fetch(request).then(function (fetchResponse) {
          cache.put(request, fetchResponse);
        });
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // return response || fetch(event.request);

      // Allow for some opportunistic caching of "safe" files.  Lots of stuff
      // especially from Google (maps and auth) is dynamic so it's not good
      // to cache it.  Seems safest just to stick to known OK GET responses.
      return response || fetch(event.request).then(function (fetchResponse) {
        if (!fetchResponse || !fetchResponse.ok || event.request.method !== 'GET') {
          return fetchResponse;
        }

        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(function (err) {
        // Return something inncouous if we fall into here (which we will
        // if the network is down).
        return new Response(null, {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
