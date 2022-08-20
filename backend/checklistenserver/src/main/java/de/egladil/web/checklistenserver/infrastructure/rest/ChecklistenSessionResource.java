// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.infrastructure.rest;

import javax.annotation.security.PermitAll;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.CookieParam;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.ChecklistenServerApp;
import de.egladil.web.checklistenserver.domain.auth.ChecklistenSessionService;
import de.egladil.web.checklistenserver.domain.auth.TokenExchangeService;
import de.egladil.web.checklistenserver.domain.auth.UserSession;
import de.egladil.web.checklistenserver.domain.auth.client.ClientAccessTokenService;
import de.egladil.web.checklistenserver.domain.error.AuthException;
import de.egladil.web.commons_net.utils.CommonHttpUtils;
import de.egladil.web.commons_validation.payload.MessagePayload;
import de.egladil.web.commons_validation.payload.ResponsePayload;

/**
 * ChecklistenSessionResource
 */
@RequestScoped
@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class ChecklistenSessionResource {

	private static final Logger LOG = LoggerFactory.getLogger(ChecklistenSessionResource.class);

	@ConfigProperty(name = "auth-app.url")
	String authAppUrl;

	@ConfigProperty(name = "auth.redirect-url.login")
	String loginRedirectUrl;

	@ConfigProperty(name = "stage")
	String stage;

	@ConfigProperty(name = "auth.redirect-url.signup")
	String signupRedirectUrl;

	@Inject
	ClientAccessTokenService clientAccessTokenService;

	@Inject
	ChecklistenSessionService sessionService;

	@Inject
	TokenExchangeService tokenExchangeService;

	@GET
	@Path("/signup")
	@PermitAll
	public Response getSignupUrl() {

		String accessToken = clientAccessTokenService.orderAccessToken();

		if (StringUtils.isBlank(accessToken)) {

			return Response.serverError().entity("Fehler beim Authentisieren des Clients").build();
		}

		String redirectUrl = authAppUrl + "#/signup?accessToken=" + accessToken + "&state=signup&nonce=null&redirectUrl="
			+ signupRedirectUrl;

		LOG.debug(redirectUrl);

		return Response.ok(ResponsePayload.messageOnly(MessagePayload.info(redirectUrl))).build();
	}

	@GET
	@Path("/login")
	@PermitAll
	public Response getLoginUrl() {

		String accessToken = clientAccessTokenService.orderAccessToken();

		if (StringUtils.isBlank(accessToken)) {

			return Response.serverError().entity("Fehler beim Authentisieren des Clients").build();
		}

		String redirectUrl = authAppUrl + "#/login?accessToken=" + accessToken + "&state=login&nonce=null&redirectUrl="
			+ loginRedirectUrl;

		LOG.debug(redirectUrl);

		return Response.ok(ResponsePayload.messageOnly(MessagePayload.info(redirectUrl))).build();

	}

	@POST
	@Path("/session")
	@Consumes(MediaType.TEXT_PLAIN)
	@PermitAll
	public Response getTheJwtAndCreateSession(final String oneTimeToken) {

		// this.bremsen();

		String jwt = tokenExchangeService.exchangeTheOneTimeToken(oneTimeToken);

		// Generierung eines lang laufenden Tokens für Tests: Doku siehe xwiki/wiki/heikeswiki/view/01%20Development/FAQ/
		/*
		 * System.err.println("==========================");
		 * System.err.println(jwt);
		 * System.err.println("==========================");
		 */

		return this.createTheSessionWithJWT(jwt);

	}

	private Response createTheSessionWithJWT(final String jwt) {

		UserSession userSession = sessionService.createUserSession(jwt);

		NewCookie sessionCookie = sessionService.createSessionCookie(userSession.getSessionId());

		if (!ChecklistenServerApp.STAGE_DEV.equals(stage)) {

			userSession.clearSessionId();
		}

		ResponsePayload payload = new ResponsePayload(MessagePayload.info("OK"), userSession);
		return Response.ok(payload).cookie(sessionCookie).build();
	}

	@DELETE
	@Path("/logout")
	@PermitAll
	public Response logout(@CookieParam(
		value = ChecklistenServerApp.CLIENT_COOKIE_PREFIX + CommonHttpUtils.NAME_SESSIONID_COOKIE) final String sessionId) {

		if (sessionId != null) {

			sessionService.invalidate(sessionId);
		}

		return Response.ok(ResponsePayload.messageOnly(MessagePayload.info("Sie haben sich erfolreich ausgeloggt")))
			.cookie(CommonHttpUtils.createSessionInvalidatedCookie(ChecklistenServerApp.CLIENT_COOKIE_PREFIX)).build();

	}

	@DELETE
	@Path("/dev/logout/{sessionid}")
	@PermitAll
	public Response logoutDev(@PathParam(value = "sessionid") final String sessionId) {

		if (!ChecklistenServerApp.STAGE_DEV.equals(stage)) {

			throw new AuthException("Diese URL darf nur im DEV-Mode aufgerufen werden");
		}

		sessionService.invalidate(sessionId);

		return Response.ok(ResponsePayload.messageOnly(MessagePayload.info("Sie haben sich erfolreich ausgeloggt"))).build();
	}

	void bremsen() {

		try {

			Thread.sleep(3000);
		} catch (InterruptedException e) {

			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
