// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: 'heikeqs',
  version: '8.1.1',
  assetsUrl: 'http://heikeqs/checklistenapp/assets',
  apiUrl: 'http://heikeqs/checklisten-api',
  profileUrl: 'http://heikeqs/profil-app',
	authUrl: 'http://heikeqs/auth-app',
	signupRedirectUrl: 'http://heikeqs/checklistenapp',
	loginRedirectUrl: 'http://heikeqs/checklistenapp#/listen',
	consoleLogActive: true,
	serverLogActive: false,
	loglevel: 2
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
