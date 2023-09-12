// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://localhost',
  port: ':8081',
  whiteDomain: 'localhost:8081',
  blackRoutes: 'http://localhost/authenticateCpUser',
  publicKey:'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVoTWIC03Q6QmPnga1C9oII9VcwJ/RiGIxA7I7Kp20icgQn9dzTONPfIdPYG96NQzsyeWnXTf1NlhpjAl3EAD+6p2ynfrknirnVICV7QW/3ZT972aou3RX2rlx54AvInosiaMd5Ne6wRUCUaf8dkf2qd50G4CVq++RKt+kbUA6aQIDAQAB',
  text : ''
};

/*
* for localhost
 host:'http://localhost',
  port:':8080',
  whiteDomain: 'localhost:8080',
  blackRoutes: 'http://localhost:8080/authenticateEntitySpoc',


 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
