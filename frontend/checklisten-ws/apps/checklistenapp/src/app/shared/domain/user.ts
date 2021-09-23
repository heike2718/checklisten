export const STORAGE_KEY_USER_SESSION = 'chkl_user_session';

export interface UserSession {
	sessionId?: string;
	idReference: string;
	expiresAt: number; // expiration in milliseconds after 01.01.1970
};

export interface AuthResult {
	expiresAt?: number;
	state?: string;
	nonce?: string;
	idToken: string;
	oauthFlowType?: string;
}


