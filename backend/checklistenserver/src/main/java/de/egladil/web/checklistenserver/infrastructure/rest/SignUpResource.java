// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.rest;

import java.security.Principal;
import java.util.Optional;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import de.egladil.web.checklistenserver.domain.auth.SignUpService;
import de.egladil.web.commons_validation.payload.HateoasPayload;
import de.egladil.web.commons_validation.payload.MessagePayload;
import de.egladil.web.commons_validation.payload.ResponsePayload;

/**
 * SignUpResource
 */
@RequestScoped
@Path("signup")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class SignUpResource {

	@Inject
	SignUpService signUpService;

	@Context
	SecurityContext securityContext;

	/**
	 * Legt einen Checklistenuser mit der UUID an.
	 *
	 * @param  signUpPayload
	 *                       String
	 * @return               Response
	 */
	@POST
	@Path("/user")
	public Response createUser() {

		Principal principal = securityContext.getUserPrincipal();

		String uuid = principal.getName();
		Optional<HateoasPayload> optHateoasPayload = signUpService.findUser(uuid);

		if (optHateoasPayload.isPresent()) {

			return Response.ok().entity(new ResponsePayload(MessagePayload.info("User existiert bereits"), optHateoasPayload.get()))
				.build();
		}

		HateoasPayload hateoasPayload = signUpService.signUpUser(uuid);

		ResponsePayload payload = new ResponsePayload(MessagePayload.info("User angelegt"), hateoasPayload);
		return Response.status(201).entity(payload).build();
	}

}
