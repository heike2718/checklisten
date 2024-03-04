// =====================================================
// Projekt: authprovider
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.rest;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * DevelopmentResource stellt REST-Endpoints zum Spielen und Dinge ausprobieren zur Verfügung.
 */
@RequestScoped
@Path("dev")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class DevelopmentResource {

	private static final Logger LOG = LoggerFactory.getLogger(DevelopmentResource.class);

	private static final String DEFAULT_DATE_TIME_FORMAT = "dd.MM.yyyy kk:mm:ss";

	@GET
	@Path("/hello")
	public Response test() {

		LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());

		final Map<String, String> json = new HashMap<>();
		json.put("greetings",
			"Also Hallochen vom checklistenserver am  "
				+ DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT).format(now));

		LOG.debug("Fast fertig");

		return Response.ok(json).build();
	}

}
