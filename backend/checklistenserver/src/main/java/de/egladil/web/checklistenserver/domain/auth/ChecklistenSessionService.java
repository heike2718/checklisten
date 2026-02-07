// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.auth;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import de.egladil.web.checklistenserver.ChecklistenServerApp;
import de.egladil.web.checklistenserver.domain.error.AuthException;
import de.egladil.web.checklistenserver.domain.error.ChecklistenRuntimeException;
import de.egladil.web.checklistenserver.domain.util.SecureTokenService;
import de.egladil.web.checklistenserver.infrastructure.persistence.UserDao;
import de.egladil.web.checklistenserver.infrastructure.persistence.entities.Checklistenuser;
import de.egladil.web.commons_net.exception.SessionExpiredException;
import de.egladil.web.commons_net.time.CommonTimeUtils;
import de.egladil.web.commons_net.utils.CommonHttpUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.NewCookie;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ChecklistenSessionService
 */
@ApplicationScoped
public class ChecklistenSessionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChecklistenSessionService.class);

    private ConcurrentHashMap<String, UserSession> sessions = new ConcurrentHashMap<>();

    @ConfigProperty(name = "session.idle.timeout")
    int sessionIdleTimeoutMinutes;

    @Inject
    JWTService jwtService;

    @Inject
    private SecureTokenService secureTokenService;

    @Inject
    UserDao userDao;

    /**
     * Wenn das JWT sagt, ist kein Admin, dann wird eine anonyme Session angelegt.
     *
     * @param jwt
     * @return
     */
    public UserSession initSession(final String jwt) {

        LOGGER.debug(jwt);

        try {

            DecodedJWT decodedJWT = jwtService.verify(jwt, SessionUtils.getPublicKey());

            final DecodedJWTReader jwtReader = new DecodedJWTReader(decodedJWT);

            String[] groups = jwtReader.getGroups();

            String uuid = decodedJWT.getSubject();

            Optional<Checklistenuser> opt = userDao.findByUniqueIdentifier(uuid);

            if (opt.isEmpty()) {

                LOGGER.warn("USER ohne Referenz in Tabelle USERS hat Login probiert: UUID={}", StringUtils.abbreviate(uuid, 11));
                return this.internalCreateAnonymousSession();
            }

            String fullName = jwtReader.getFullName();

            String userIdReference = uuid.substring(0, 8) + "_" + secureTokenService.createRandomToken();


            AuthenticatedUser authenticatedUser = new AuthenticatedUser(uuid).withFullName(fullName)
                    .withIdReference(userIdReference).withRoles(groups);

            UserSession session = this.internalCreateAnonymousSession().withUser(authenticatedUser);

            if (sessionIdleTimeoutMinutes == 0) {

                LOGGER.warn("session.idle.timeout=0 => verwenden default 180 min");
                session.setExpiresAt(SessionUtils.getExpiresAt(180));
            } else {

                session.setExpiresAt(SessionUtils.getExpiresAt(sessionIdleTimeoutMinutes));
            }

            sessions.put(session.getSessionId(), session);

            LOGGER.info("User eingeloggt: {}", session.getUser().toString());

            return session;
        } catch (TokenExpiredException e) {

            LOGGER.error("JWT expired");
            throw new AuthException("JWT expired");
        } catch (JWTVerificationException e) {

            String msg = "Security Thread: JWT " + StringUtils.abbreviate(jwt, 20) + " invalid: " + e.getMessage();
            LOGGER.warn(msg);
            throw new AuthException("JWT invalid");
        }
    }

    private UserSession internalCreateAnonymousSession() {
        String sessionId = secureTokenService.createRandomToken();
        return UserSession.createAnonymous(sessionId);
    }

    public UserSession getAndRefreshSessionIfValid(final String sessionId) {

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

            LOGGER.info("Session invalidated: {} - {}", sessionId, userSession.getUser().getUuid().substring(0, 8));
        }

    }

    public NewCookie createSessionCookie(final String sessionId) {

        final String name = ChecklistenServerApp.CLIENT_COOKIE_PREFIX + CommonHttpUtils.NAME_SESSIONID_COOKIE;

        LOGGER.debug("Erzeugen Cookie mit name={}", name);

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
     * @param sessionId String
     * @return UserSession oder null.
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

        return CommonTimeUtils.getInterval(CommonTimeUtils.now(), SESSION_IDLE_TIMEOUT_MINUTES, ChronoUnit.MINUTES).getEndTime()
                .getTime();
    }
}
