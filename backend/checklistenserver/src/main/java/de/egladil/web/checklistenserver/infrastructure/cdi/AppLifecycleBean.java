// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.infrastructure.cdi;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.StartupEvent;

/**
 * AppLifecycleBean
 */
@ApplicationScoped
public class AppLifecycleBean {

	private static final Logger LOGGER = LoggerFactory.getLogger(AppLifecycleBean.class);

	@ConfigProperty(name = "dir.einkaufslisten")
	String pathVorlagenEinkaufslisten;

	@ConfigProperty(name = "dir.packlisten")
	String pathVorlagenPacklisten;

	@ConfigProperty(name = "delay.milliseconds", defaultValue = "0")
	long delayMillis = 0;

	void onStartup(@Observes final StartupEvent ev) {

		LOGGER.info(" ===========>  dir vorlagen einkaufslisten is {}", pathVorlagenEinkaufslisten);
		LOGGER.info(" ===========>  dir vorlagen packlisten is {}", pathVorlagenPacklisten);

		if (delayMillis > 0) {

			LOGGER.warn("Achtung, der Service antwortet immer erst nach {} ms!!!", delayMillis);
		}

	}
}
