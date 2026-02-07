// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.rest;

import de.egladil.web.checklistenserver.domain.listen.ChecklisteDaten;
import de.egladil.web.checklistenserver.domain.listen.ChecklistenService;
import de.egladil.web.checklistenserver.domain.util.DelayService;
import de.egladil.web.checklistenserver.domain.validation.ChecklistenRegExps;
import de.egladil.web.checklistenserver.domain.validation.ValidationErrorResponseDto;
import de.egladil.web.commons_validation.payload.MessagePayload;
import de.egladil.web.commons_validation.payload.ResponsePayload;
import io.quarkus.security.Authenticated;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.ParameterIn;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.List;

/**
 * ChecklistenResource
 */
@RequestScoped
@Path("checklisten")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ChecklistenResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChecklistenResource.class);

    @Inject
    DelayService delayService;

    @Inject
    ChecklistenService checklistenService;

    @Context
    UriInfo uriInfo;

    @Context
    SecurityContext securityContext;

    @GET
    @Authenticated
    @Operation(operationId = "loadChecklisten", summary = "Gibt alle Checklisten für den gegebenen User zurück.")
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY,
            implementation = ChecklisteDaten.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "Forbidden", description = "kann auch vorkommen, wenn mod_security zuschlägt", responseCode = "403", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
    public Response loadChecklisten() {

        LOGGER.debug("entering getChecklisten");

        this.delayService.pause();

        LOGGER.debug("Alles gut: session vorhanden");

        String userUuid = securityContext.getUserPrincipal().getName();

        List<ChecklisteDaten> checklisten = checklistenService.loadChecklisten(userUuid);

        LOGGER.debug("{}: checklisten geladen", getStringAbbreviated(userUuid));

        return Response.ok().entity(checklisten).build();
    }

    @POST
    @Authenticated
    @Operation(operationId = "checklisteAnlegen", summary = "Erzeugt eine neue Checkliste.")
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY,
            implementation = ChecklisteDaten.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = ValidationErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "Forbidden", description = "kann auch vorkommen, wenn mod_security zuschlägt", responseCode = "403", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
    public Response checklisteAnlegen(@Valid final ChecklisteDaten daten) {

        this.delayService.pause();

        String userUuid = securityContext.getUserPrincipal().getName();

        ChecklisteDaten result = checklistenService.createCheckliste(daten.getTyp(), daten.getName(), userUuid);

        LOGGER.info("{}: checkliste angelegt: {}", getStringAbbreviated(userUuid),
                getStringAbbreviated(result.getKuerzel()));

        URI uri = uriInfo.getBaseUriBuilder()
                .path(ChecklistenResource.class)
                .path(ChecklistenResource.class, "getCheckliste")
                .build(result.getKuerzel());

        return Response.created(uri)
                .entity(result)
                .build();
    }

    @PUT
    @Path("/checkliste/{kuerzel}")
    @Authenticated
    @Operation(operationId = "checklisteAendern", summary = "Ändert die gegebene Checkliste.")
    @Parameters({
            @Parameter(in = ParameterIn.PATH, name = "kuerzel", description = "UUID der Checkliste, die geändert werden soll", example = "a4c4d45e-4a81-4bde-a6a3-54464801716d", required = true)})
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY,
            implementation = ChecklisteDaten.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = ValidationErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "Forbidden", description = "kann auch vorkommen, wenn mod_security zuschlägt", responseCode = "403", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
    public Response checklisteAendern(@Pattern(regexp = ChecklistenRegExps.VALID_KUERZEL) @PathParam(
            value = "kuerzel") final String kuerzel, final ChecklisteDaten daten) {

        this.delayService.pause();
        String userUuid = securityContext.getUserPrincipal().getName();

        if (!kuerzel.equals(daten.getKuerzel())) {
            LOGGER.error("{}: Konflikt: kuerzel= '{}', daten.kuerzel = '{}'",
                    getStringAbbreviated(userUuid), kuerzel, daten.getKuerzel());
            ResponsePayload payload = ResponsePayload.messageOnly(MessagePayload.error("Precondition Failed"));
            return Response.status(412)
                    .entity(payload)
                    .build();
        }

        ChecklisteDaten payload = checklistenService.changeCheckliste(daten, kuerzel, userUuid);
        LOGGER.info("{}: checkliste {} geändert", getStringAbbreviated(userUuid),
                getStringAbbreviated(kuerzel));
        return Response.ok(payload).build();
    }

    @DELETE
    @Path("/checkliste/{kuerzel}")
    @Authenticated
    @Operation(operationId = "checklisteLoeschen", summary = "Löscht die gegebene Checkliste")
    @Parameters({
            @Parameter(in = ParameterIn.PATH, name = "kuerzel", description = "UUID der Checkliste, die geändert werden soll", example = "a4c4d45e-4a81-4bde-a6a3-54464801716d", required = true)})
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY,
            implementation = MessagePayload.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = ValidationErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "Forbidden", description = "kann auch vorkommen, wenn mod_security zuschlägt", responseCode = "403", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
    public Response checklisteLoeschen(@PathParam(value = "idRef") final String idRef, @PathParam(
            value = "kuerzel") final String kuerzel) {

        this.delayService.pause();

        checklistenService.deleteCheckliste(kuerzel, securityContext.getUserPrincipal().getName());

        ResponsePayload payload = ResponsePayload.messageOnly(MessagePayload.info("erfolgreich gelöscht"));

        LOGGER.info("{} - {}: checkliste {} gelöscht", getStringAbbreviated(securityContext.getUserPrincipal().getName()), getStringAbbreviated(kuerzel));
        return Response.ok()
                .entity(payload)
                .build();
    }

    private String getStringAbbreviated(final String string) {

        return StringUtils.abbreviate(string, 11);
    }

}
