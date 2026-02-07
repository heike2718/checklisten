// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.auth;

import java.io.Serializable;
import java.security.Principal;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * UserSession
 */
public class UserSession {

	private static final long serialVersionUID = 1L;

	private String sessionId;

	private long expiresAt;

	private AuthenticatedUser user;

	public static UserSession createAnonymous(String sessionId) {
		UserSession session = new UserSession();
		session.sessionId = sessionId;
		return session;
	}

	public String getSessionId() {

		return sessionId;
	}

	public long getExpiresAt() {

		return expiresAt;
	}

	public void setExpiresAt(final long expiresAt) {

		this.expiresAt = expiresAt;
	}

	public boolean isAnonym() {
		return this.user == null;
	}

	public AuthenticatedUser getUser() {
		return user;
	}

	public UserSession withUser(AuthenticatedUser user) {
		this.user = user;
		return this;
	}
}
