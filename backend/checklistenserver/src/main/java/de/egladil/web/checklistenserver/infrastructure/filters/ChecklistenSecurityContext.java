// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.infrastructure.filters;

import java.security.Principal;

import javax.ws.rs.core.SecurityContext;

import de.egladil.web.checklistenserver.domain.auth.UserSession;

/**
 * ChecklistenSecurityContext
 */
public class ChecklistenSecurityContext implements SecurityContext {

	private final UserSession userSession;

	/**
	 * @param userSession
	 */
	public ChecklistenSecurityContext(final UserSession userSession) {

		this.userSession = userSession;
	}

	@Override
	public Principal getUserPrincipal() {

		return userSession;
	}

	@Override
	public boolean isUserInRole(final String role) {

		return userSession.getRoles().contains(role);
	}

	@Override
	public boolean isSecure() {

		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getAuthenticationScheme() {

		// TODO Auto-generated method stub
		return null;
	}

}
