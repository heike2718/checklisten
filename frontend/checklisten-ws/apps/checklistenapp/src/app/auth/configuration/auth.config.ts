import { InjectionToken } from '@angular/core';


export interface AuthConfig {
	readonly baseUrl: string;
	readonly storagePrefix: string;
	readonly production: boolean;
	readonly loginSuccessUrl: string
}

export const AuthConfigService = new InjectionToken<AuthConfig>('AuthConfig');
