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
public class UserSession implements Principal, Serializable {

	private static final long serialVersionUID = 1L;

	private String sessionId;

	@JsonIgnore
	private String uuid;

	private String idReference;

	private String roles;

	private long expiresAt;

	public static UserSession create(final String uuid, final String sessionId, final String roles, final String idReference) {

		UserSession result = new UserSession();
		result.uuid = uuid;
		result.sessionId = sessionId;
		result.roles = roles;
		result.idReference = idReference;
		return result;
	}

	public String getSessionId() {

		return sessionId;
	}

	public String getUuid() {

		return uuid;
	}

	public String getIdReference() {

		return idReference;
	}

	public String getRoles() {

		return roles;
	}

	public long getExpiresAt() {

		return expiresAt;
	}

	public void setExpiresAt(final long expiresAt) {

		this.expiresAt = expiresAt;
	}

	@Override
	public String toString() {

		return "UserSession [roles=" + roles + ", expiresAt=" + expiresAt + ", uuid=" + uuid.substring(0, 8) + "]";
	}

	@Override
	@JsonIgnore
	public String getName() {

		return this.uuid;
	}

	public void clearSessionId() {

		this.sessionId = null;
	}
}
