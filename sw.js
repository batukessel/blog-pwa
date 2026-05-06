const CACHE_NAME =
  'almukhtar-v1';

const BLOG_URL =
  'https://almukhtarom.blogspot.com/';

const OFFLINE_URL =
  'https://batukessel.github.io/blog-pwa/offline.html';

// INSTALL
self.addEventListener(
  'install',
  function(event){

    self.skipWaiting();

    event.waitUntil(

      caches.open(CACHE_NAME)

        .then(function(cache){

          return cache.addAll([
            BLOG_URL,
            OFFLINE_URL
          ]);

        })

    );

  }
);

// ACTIVATE
self.addEventListener(
  'activate',
  function(event){

    event.waitUntil(

      Promise.all([

        self.clients.claim(),

        caches.keys()

          .then(function(keys){

            return Promise.all(

              keys.map(function(key){

                if(key !== CACHE_NAME){

                  return caches.delete(key);

                }

              })

            );

          })

      ])

    );

  }
);

// FETCH
self.addEventListener(
  'fetch',
  function(event){

    if(
      event.request.method !== 'GET'
    ){
      return;
    }

    event.respondWith(

      caches.match(event.request)

        .then(function(cacheResponse){

          if(cacheResponse){

            return cacheResponse;

          }

          return fetch(event.request)

            .then(function(networkResponse){

              const responseClone =
                networkResponse.clone();

              caches.open(CACHE_NAME)

                .then(function(cache){

                  cache.put(
                    event.request,
                    responseClone
                  );

                });

              return networkResponse;

            })

            .catch(function(){

              return caches.match(
                BLOG_URL
              )

              .then(function(home){

                return home ||

                  caches.match(
                    OFFLINE_URL
                  );

              });

            });

        })

    );

  }
);
