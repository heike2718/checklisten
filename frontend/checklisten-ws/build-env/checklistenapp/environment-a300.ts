// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  envName: 'a300',
  version: '8.1.0',
  assetsUrl: 'http://a300/checklistenapp/assets',
  apiUrl: 'http://a300/checklisten-api',
  profileUrl: 'http://a300/profil-app',
	authUrl: 'http://a300/auth-app',
	signupRedirectUrl: 'http://a300/checklistenapp',
	loginRedirectUrl: 'http://a300/checklistenapp#/listen',
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
