// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	version: '7.2.0',
	envName: 'DEV',
	apiUrl: 'http://localhost:9300/checklisten-api',
	authApiUrl: 'http://192.168.10.176:9000/authprovider',
	authUrl: 'http://192.168.10.176/auth-app',
	profileUrl: 'http://192.168.10.176/profil-app',
	assetsUrl: '/home/heike/git/checklisten/frontend/checklisten-ws/apps/checklistenapp/src/assets',
	signupRedirectUrl: 'http://localhost:4200/checklistenapp',
	loginRedirectUrl: 'http://localhost:4200/checklistenapp#/listen',
	jokesAPI: 'https://official-joke-api.appspot.com/jokes/random',
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
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
