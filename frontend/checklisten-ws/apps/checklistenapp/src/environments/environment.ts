// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	version: '8.0.0',
	envName: 'DEV',
	apiUrl: 'http://localhost:9300/checklisten-api',
	authApiUrl: 'http://heikedeb:9000/authprovider',
	authUrl: 'http://heikedeb/auth-app',
	profileUrl: 'http://heikedeb/profil-app',
	assetsUrl: 'https://opa-wetterwachs.de/checklistenapp/assets',
	signupRedirectUrl: 'http://localhost:4200/checklistenapp',
	loginRedirectUrl: 'http://localhost:4200/checklistenapp#/listen',
	consoleLogActive: true,
	serverLogActive: false,
	loglevel: 1
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
