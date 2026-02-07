// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.rest;

import de.egladil.web.checklistenserver.domain.util.DelayService;
import de.egladil.web.checklistenserver.domain.validation.ValidationErrorResponseDto;
import de.egladil.web.checklistenserver.domain.vorlagen.Checklistenvorlage;
import de.egladil.web.checklistenserver.domain.vorlagen.ChecklistenvorlageProvider;
import de.egladil.web.commons_validation.payload.MessagePayload;
import io.quarkus.security.Authenticated;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

/**
 * ChecklistenvorlageResource gibt Vorgabedetails für Checklisten zurück.
 */
@RequestScoped
@Path("vorlagen")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ChecklistenvorlageResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChecklistenvorlageResource.class);

    @Context
    SecurityContext securityContext;

    @Inject
    DelayService delayService;

    @Inject
    ChecklistenvorlageProvider vorlagenProvider;

    @GET
    @Authenticated
    @Operation(operationId = "loadVorlagen", summary = "Gibt alle Checklistenvorlagen für den gegebenen User zurück.")
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY,
            implementation = Checklistenvorlage.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "Forbidden", description = "kann auch vorkommen, wenn mod_security zuschlägt", responseCode = "403", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
    public Response loadVorlagen() {

        LOGGER.debug("entering getChecklisten");

        this.delayService.pause();

        String userUuid = securityContext.getUserPrincipal().getName();

        LOGGER.debug("Alles gut: session vorhanden");

        List<Checklistenvorlage> vorlagen = vorlagenProvider.getTemplates(userUuid);

        LOGGER.debug("{}: vorlagen geladen", StringUtils.abbreviate(userUuid, 11));

        return Response.ok().entity(vorlagen).build();

    }

    @POST
    @Authenticated
    @Operation(operationId = "vorlageSpeichern", summary = "Speichert eine neue Version der Vorlage")
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY,
            implementation = Checklistenvorlage.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = ValidationErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "Forbidden", description = "kann auch vorkommen, wenn mod_security zuschlägt", responseCode = "403", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
    public Response vorlageSpeichern(@Valid final Checklistenvorlage template) {

        this.delayService.pause();

        String userUuid = securityContext.getUserPrincipal().getName();

        Checklistenvorlage persisted = vorlagenProvider.vorlageSpeichern(template, userUuid);
        LOGGER.info("Template {} durch {} geändert.", template.getTyp(), StringUtils.abbreviate(userUuid, 11));
        return Response.ok(persisted).build();
    }
}
