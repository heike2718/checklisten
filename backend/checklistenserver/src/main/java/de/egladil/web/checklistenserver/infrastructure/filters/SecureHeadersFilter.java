// =====================================================
// Projekt: de.egladil.mkv.adminservice
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.filters;

import java.io.IOException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.Provider;

import de.egladil.web.checklistenserver.ChecklistenServerApp;
import de.egladil.web.checklistenserver.domain.config.ConfigService;

/**
 * SecureHeadersFilter packt die SecureHeaders in den Response.
 */
@ApplicationScoped
@Provider
public class SecureHeadersFilter implements ContainerResponseFilter {

	private static final String CONTENT_SECURITY_POLICY = "Content-Security-Policy";

	@Inject
	ConfigService config;

	@Override
	public void filter(final ContainerRequestContext requestContext, final ContainerResponseContext responseContext) throws IOException {

		final MultivaluedMap<String, Object> headers = responseContext.getHeaders();

		if (headers.get("Cache-Control") == null) {

			headers.add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
		}

		if (headers.get("X-Content-Type-Options") == null) {

			headers.add("X-Content-Type-Options", "nosniff");
		}

		if (headers.get("X-Frame-Options") == null) {

			headers.add("X-Frame-Options", "DENY");
		}

		if (headers.get("Server") == null) {

			headers.add("Server", "Hex");
		}

		if (headers.get("X-Powered-By") == null) {

			headers.add("X-Powered-By", "Ponder Stibbons");
		}

		if (headers.get("Vary") == null) {

			headers.add("Vary", "Origin");
		}

		if (headers.get(CONTENT_SECURITY_POLICY) == null) {

			responseContext.getHeaders().add(CONTENT_SECURITY_POLICY, "default-src 'self'; ");
		}

		if (!ChecklistenServerApp.STAGE_DEV.equals(config.getStage()) && headers.get("Strict-Transport-Security") == null) {

			headers.add("Strict-Transport-Security", "max-age=63072000; includeSubdomains");

		}

		if (headers.get("X-XSS-Protection") == null) {

			headers.add("X-XSS-Protection", "1; mode=block");
		}

		if (headers.get("X-Frame-Options") == null) {

			headers.add("X-Frame-Options", "deny");
		}
	}
}
