// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.auth;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.NewCookie;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.jwt.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import de.egladil.web.checklistenserver.ChecklistenServerApp;
import de.egladil.web.checklistenserver.domain.error.AuthException;
import de.egladil.web.checklistenserver.domain.error.ChecklistenRuntimeException;
import de.egladil.web.checklistenserver.domain.error.LogmessagePrefixes;
import de.egladil.web.commons_crypto.CryptoService;
import de.egladil.web.commons_crypto.JWTService;
import de.egladil.web.commons_net.exception.SessionExpiredException;
import de.egladil.web.commons_net.time.CommonTimeUtils;
import de.egladil.web.commons_net.utils.CommonHttpUtils;
import de.egladil.web.commons_validation.payload.HateoasPayload;

/**
 * ChecklistenSessionService
 */
@ApplicationScoped
public class ChecklistenSessionService {

	private static final Logger LOG = LoggerFactory.getLogger(ChecklistenSessionService.class);

	private static final int SESSION_IDLE_TIMEOUT_MINUTES = 120;

	private ConcurrentHashMap<String, UserSession> sessions = new ConcurrentHashMap<>();

	@Inject
	CryptoService cryptoService;

	@Inject
	JWTService jwtService;

	@Inject
	SignUpService signupService;

	public UserSession createUserSession(final String jwt) {

		try {

			DecodedJWT decodedJWT = jwtService.verify(jwt, getPublicKey());

			String uuid = decodedJWT.getSubject();

			Optional<HateoasPayload> opt = signupService.findUser(uuid);

			if (opt.isEmpty()) {

				signupService.signUpUser(uuid);
				LOG.info("Neuen Checklistenuser mit UUID={} angelegt", StringUtils.abbreviate(uuid, 11));
			}

			Claim groupsClaim = decodedJWT.getClaim(Claims.groups.name());
			String[] rolesArr = groupsClaim.asArray(String.class);

			String roles = null;

			if (rolesArr != null) {

				roles = StringUtils.join(rolesArr, ",");
			}

			byte[] sessionIdBase64 = Base64.getEncoder().encode(cryptoService.generateSessionId().getBytes());
			String sesionId = new String(sessionIdBase64);

			UserSession userSession = UserSession.create(uuid, sesionId, roles, CommonHttpUtils.createUserIdReference());
			userSession.setExpiresAt(getSessionTimeout());

			sessions.put(sesionId, userSession);

			return userSession;
		} catch (TokenExpiredException e) {

			LOG.error("JWT expired");
			throw new AuthException("JWT has expired");
		} catch (JWTVerificationException e) {

			LOG.warn(LogmessagePrefixes.BOT + "JWT invalid: {}", e.getMessage());
			throw new AuthException("invalid JWT");
		}

	}

	public UserSession refresh(final String sessionId) {

		UserSession userSession = sessions.get(sessionId);

		if (userSession != null) {

			userSession.setExpiresAt(getSessionTimeout());

			return userSession;
		} else {

			throw new SessionExpiredException("keine Session mehr vorhanden");
		}

	}

	public void invalidate(final String sessionId) {

		UserSession userSession = sessions.remove(sessionId);

		if (userSession != null) {

			LOG.info("Session invalidated: {} - {}", sessionId, userSession.getUuid().substring(0, 8));
		}

	}

	public NewCookie createSessionCookie(final String sessionId) {

		final String name = ChecklistenServerApp.CLIENT_COOKIE_PREFIX + CommonHttpUtils.NAME_SESSIONID_COOKIE;

		LOG.debug("Erzeugen Cookie mit name={}", name);

		// @formatter:off
		NewCookie sessionCookie = new NewCookie(name,
			sessionId,
			"/", // path
			null, // domain muss null sein, wird vom Browser anhand des restlichen Responses abgeleitet. Sonst wird das Cookie nicht gesetzt.
			1,  // version
			null, // comment
			7200, // expires (minutes)
			null,
			true, // secure
			true  // httpOnly
			);
		// @formatter:on

		return sessionCookie;
	}

	private byte[] getPublicKey() {

		try (InputStream in = getClass().getResourceAsStream("/META-INF/authprov_public_key.pem");
			StringWriter sw = new StringWriter()) {

			IOUtils.copy(in, sw, Charset.forName("UTF-8"));

			return sw.toString().getBytes();
		} catch (IOException e) {

			throw new ChecklistenRuntimeException("Konnte jwt-public-key nicht lesen: " + e.getMessage());
		}

	}

	/**
	 * Gibt die Session mit der gegebenen sessionId zurück.
	 *
	 * @param  sessionId
	 *                   String
	 * @return           UserSession oder null.
	 */
	public UserSession getSession(final String sessionId) throws SessionExpiredException {

		UserSession userSession = sessions.get(sessionId);

		if (userSession != null) {

			LocalDateTime expireDateTime = CommonTimeUtils.transformFromDate(new Date(userSession.getExpiresAt()));
			LocalDateTime now = CommonTimeUtils.now();

			if (now.isAfter(expireDateTime)) {

				sessions.remove(sessionId);
				throw new SessionExpiredException("Ihre Session ist abgelaufen. Bitte loggen Sie sich erneut ein.");
			}

		}
		return userSession;
	}

	private long getSessionTimeout() {

		return CommonTimeUtils.getInterval(CommonTimeUtils.now(), SESSION_IDLE_TIMEOUT_MINUTES,
			ChronoUnit.MINUTES).getEndTime().getTime();
	}
}
