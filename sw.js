var SLOW_TIME = 3000;
const applicationServerPublicKey = 'BOXYk1KizRxxs-EgEkKOoOHg2xpwOW6HkvbmljRLubaYbi3aY4_Bq8zrpZ6CcFO2J3u2fPDi5R0ztB9YT2GO8yU';
var shellCacheName = 'pwa-spinz-shell-v1';
var filesToCache = [
  'index.html',
  'scripts/index.js',
  'css/index.css',
  'images/LogoV1.png',
  'images/LogoV2.png',
  'images/LogoV2White.png',
  'images/favicon.ico',
  'images/Background.webp'
];

this.addEventListener( 'install', function (event) {
  console.log('Installed service worker');
  event.waitUntil(
    caches.open(shellCacheName).then(function(cache) {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(filesToCache);
    }).then (function () { console.log('[Service Worker] Cached app shell');})
  );
} );

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});