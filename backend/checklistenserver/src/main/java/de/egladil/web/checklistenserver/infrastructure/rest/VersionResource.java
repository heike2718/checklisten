// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.infrastructure.rest;

import javax.enterprise.context.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.egladil.web.commons_validation.payload.MessagePayload;
import de.egladil.web.commons_validation.payload.ResponsePayload;

/**
 * VersionResource
 */
@RequestScoped
@Path("version")
@Produces(MediaType.APPLICATION_JSON)
public class VersionResource {

	@ConfigProperty(name = "quarkus.application.version", defaultValue = "8.1.0")
	String version;

	@GET
	public Response getVersion() {

		return Response.ok(ResponsePayload.messageOnly(MessagePayload.info(version))).build();

	}

}
