// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.infrastructure.filters;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.ChecklistenServerApp;
import de.egladil.web.checklistenserver.domain.auth.ChecklistenSessionService;
import de.egladil.web.checklistenserver.domain.auth.UserSession;
import de.egladil.web.checklistenserver.domain.config.ConfigService;
import de.egladil.web.checklistenserver.domain.error.AuthException;
import de.egladil.web.commons_net.exception.SessionExpiredException;
import de.egladil.web.commons_net.utils.CommonHttpUtils;

/**
 * AuthorizationFilter
 */
@ApplicationScoped
@Provider
@Priority(Priorities.AUTHORIZATION)
public class AuthorizationFilter implements ContainerRequestFilter {

	private static final Logger LOG = LoggerFactory.getLogger(AuthorizationFilter.class);

	private static final List<String> AUTHORIZED_PATHS = Arrays.asList(new String[] { "/checklisten", "/vorlagen", "/signup" });

	@Inject
	ConfigService config;

	@Context
	ResourceInfo resourceInfo;

	@Inject
	ChecklistenSessionService sessionService;

	@Override
	public void filter(final ContainerRequestContext requestContext) throws IOException {

		String path = requestContext.getUriInfo().getPath();

		LOG.debug("entering AuthorizationFilter: path={}", path);

		if (needsSession(path)) {

			if (LOG.isDebugEnabled()) {

				logCookies(requestContext);
			}

			String sessionId = CommonHttpUtils.getSessionId(requestContext, config.getStage(),
				ChecklistenServerApp.CLIENT_COOKIE_PREFIX);

			LOG.debug("sessionId={}", sessionId);

			if (sessionId != null) {

				UserSession userSession = sessionService.getSession(sessionId);

				if (userSession == null) {

					LOG.warn("sessionId {} nicht bekannt oder abgelaufen", sessionId);
					throw new SessionExpiredException("keine gültige Session vorhanden");
				}

				UserSession refrehedSession = sessionService.refresh(sessionId);
				ChecklistenSecurityContext securityContext = new ChecklistenSecurityContext(refrehedSession);
				requestContext.setSecurityContext(securityContext);

				LOG.debug("UserSession in SecurityContext gesetzt.");

			} else {

				throw new AuthException("Keine Berechtigung");
			}
		}

	}

	private void logCookies(final ContainerRequestContext requestContext) {

		final Map<String, Cookie> cookies = requestContext.getCookies();

		System.out.println("==== Start read cookies ====");
		cookies.keySet().stream().forEach(key -> {

			Cookie cookie = cookies.get(key);
			System.out.println("[k=" + key + ", value=" + cookie.getValue() + "]");
		});
		System.out.println("==== End read cookies ====");
	}

	private boolean needsSession(final String path) {

		Optional<String> optPath = AUTHORIZED_PATHS.stream().filter(p -> path.toLowerCase().startsWith(p)).findFirst();

		return optPath.isPresent();
	}

}
