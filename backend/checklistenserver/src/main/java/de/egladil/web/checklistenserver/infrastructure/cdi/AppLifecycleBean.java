// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.infrastructure.cdi;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

/**
 * AppLifecycleBean
 */
@ApplicationScoped
public class AppLifecycleBean {

	private static final Logger LOGGER = LoggerFactory.getLogger(AppLifecycleBean.class);

	@ConfigProperty(name = "quarkus.http.cors.origins")
	String corsAllowedOrigins;

	@ConfigProperty(name = "dir.einkaufslisten")
	String pathVorlagenEinkaufslisten;

	@ConfigProperty(name = "dir.packlisten")
	String pathVorlagenPacklisten;

	@ConfigProperty(name = "delay.milliseconds", defaultValue = "0")
	long delayMillis = 0;

	@ConfigProperty(name = "quarkus.rest-client.authprovider.url")
	String authproviderRESTUrl;

	@ConfigProperty(name = "auth-app.url")
	String authAppUrl;

	void onStartup(@Observes
	final StartupEvent ev) {

		LOGGER.info(" ===========>  authproviderUrl={}", authproviderRESTUrl);
		LOGGER.info(" ===========>  authAppUrl={}", authAppUrl);
		LOGGER.info(" ===========>  quarkus.http.cors.origins={}", corsAllowedOrigins);
		LOGGER.info(" ===========>  dir vorlagen einkaufslisten is {}", pathVorlagenEinkaufslisten);
		LOGGER.info(" ===========>  dir vorlagen packlisten is {}", pathVorlagenPacklisten);

		if (delayMillis > 0) {

			LOGGER.warn("Achtung, der Service antwortet immer erst nach {} ms!!!", delayMillis);
		}

	}
}
