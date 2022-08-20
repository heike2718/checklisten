// =====================================================
// Project: mk-gateway
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
 * GuiVersionResource
 */
@RequestScoped
@Path("guiversion")
@Produces(MediaType.APPLICATION_JSON)
public class GuiVersionResource {

	@ConfigProperty(name = "quarkus.application.version", defaultValue = "8.1.0")
	String version;

	@GET
	public Response getExcpectedGuiVersion() {

		String[] tokens = version.split("\\.");
		String guiVersion = tokens[0] + "." + tokens[1] + "." + tokens[2];

		return Response.ok().entity(ResponsePayload.messageOnly(MessagePayload.info(guiVersion))).build();
	}
}
