// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.rest;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.domain.Checklistentyp;
import de.egladil.web.checklistenserver.domain.auth.UserSession;
import de.egladil.web.checklistenserver.domain.error.AuthException;
import de.egladil.web.checklistenserver.domain.error.ConcurrentUpdateException;
import de.egladil.web.checklistenserver.domain.util.DelayService;
import de.egladil.web.checklistenserver.domain.vorlagen.Checklistenvorlage;
import de.egladil.web.checklistenserver.domain.vorlagen.ChecklistenvorlageProvider;
import de.egladil.web.checklistenserver.domain.vorlagen.ChecklistenvorlageSanitizer;
import de.egladil.web.commons_validation.ValidationDelegate;
import de.egladil.web.commons_validation.payload.MessagePayload;
import de.egladil.web.commons_validation.payload.ResponsePayload;

/**
 * ChecklistenvorlageResource gibt Vorgabedetails für Checklisten zurück.
 */
@RequestScoped
@Path("vorlagen")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ChecklistenvorlageResource {

	private static final Logger LOG = LoggerFactory.getLogger(ChecklistenvorlageResource.class);

	@Context
	SecurityContext securityContext;

	@Inject
	DelayService delayService;

	@Inject
	ChecklistenvorlageProvider vorlagenProvider;

	private final ValidationDelegate validationDelegate = new ValidationDelegate();

	private final ChecklistenvorlageSanitizer checklistenvorlageSanitizer = new ChecklistenvorlageSanitizer();

	@GET
	public Response getAllVorlagen() {

		LOG.debug("entering getChecklisten");

		this.delayService.pause();

		UserSession userSession = getUserSession();

		LOG.debug("Alles gut: session vorhanden");

		List<Checklistenvorlage> vorlagen = vorlagenProvider.getTemplates(userSession.getUuid());

		List<Checklistenvorlage> sanitizedVorlagen = vorlagen.stream()
			.map(template -> checklistenvorlageSanitizer.apply(template)).collect(Collectors.toList());

		ResponsePayload payload = new ResponsePayload(MessagePayload.info("OK: Anzahl Vorlagen: " + sanitizedVorlagen.size()),
			sanitizedVorlagen);

		LOG.debug("{}: vorlagen geladen", StringUtils.abbreviate(userSession.getUuid(), 11));

		return Response.ok().entity(payload).build();

	}

	@GET
	@Path("/{typ}")
	public Response getVorlageMitTypFuerGruppe(@PathParam("typ") final String typValue) {

		this.delayService.pause();

		try {

			UserSession userSession = getUserSession();

			Checklistentyp typ = Checklistentyp.valueOf(typValue.trim().toUpperCase());
			Checklistenvorlage vorlage = vorlagenProvider.getVorlageMitTypFuerGruppe(typ, userSession.getUuid());

			Checklistenvorlage sanitized = checklistenvorlageSanitizer.apply(vorlage);
			ResponsePayload payload = new ResponsePayload(MessagePayload.info("Bitteschön"), sanitized);
			return Response.ok().entity(payload).build();
		} catch (IllegalArgumentException e) {

			LOG.error("Falscher Parameter [typ={}]", typValue);
			return Response.status(404)
				.entity(ResponsePayload.messageOnly(MessagePayload.error("Gib einen korrekten Checklistentyp an"))).build();
		}
	}

	@POST
	public Response vorlageSpeichern(final Checklistenvorlage template) {

		this.delayService.pause();

		validationDelegate.check(template, Checklistenvorlage.class);

		UserSession userSession = getUserSession();

		try {

			Checklistenvorlage persisted = vorlagenProvider.vorlageSpeichern(template, userSession.getUuid());

			Checklistenvorlage sanitized = checklistenvorlageSanitizer.apply(persisted);

			LOG.info("Template {} durch {} geändert.", template.getTyp(), StringUtils.abbreviate(userSession.getUuid(), 11));

			String msg = "Listenvorlage für " + template.getTyp() + " erfolgreich gespeichert";

			ResponsePayload payload = new ResponsePayload(MessagePayload.info(msg), sanitized);
			return Response.ok(payload).build();
		} catch (ConcurrentUpdateException e) {

			Checklistenvorlage neues = (Checklistenvorlage) e.getActualData();

			Checklistenvorlage sanitized = checklistenvorlageSanitizer.apply(neues);
			ResponsePayload payload = new ResponsePayload(MessagePayload.warn(e.getMessage()), sanitized);
			return Response.ok(payload).build();
		}
	}

	private UserSession getUserSession() {

		Principal userPrincipal = securityContext.getUserPrincipal();

		if (userPrincipal != null) {

			LOG.debug("UserPrincipal gefunden: {}", userPrincipal);

			return (UserSession) userPrincipal;
		}

		LOG.error("keine UserSession für Principal vorhanden");
		throw new AuthException("keine Berechtigung");
	}
}
