const CACHE_NAME =
'almukhtar-shell-v1';

const APP_SHELL =
'https://batukessel.github.io/blog-pwa/app-shell.html';

// INSTALL
self.addEventListener(
'install',
function(event){

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(function(cache){

        return cache.addAll([
          APP_SHELL
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

    self.clients.claim()

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

    fetch(event.request)

      .then(function(response){

        const clone =
        response.clone();

        caches.open(CACHE_NAME)

          .then(function(cache){

            cache.put(
              event.request,
              clone
            );

          });

        return response;

      })

      .catch(function(){

        return caches.match(
          event.request
        )

        .then(function(resp){

          return resp ||

          caches.match(APP_SHELL);

        });

      })

  );

}
);
