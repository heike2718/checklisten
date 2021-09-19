// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.rest;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.domain.ChecklisteTemplate;
import de.egladil.web.checklistenserver.domain.Checklistentyp;
import de.egladil.web.checklistenserver.domain.auth.UserSession;
import de.egladil.web.checklistenserver.error.AuthException;
import de.egladil.web.checklistenserver.error.ConcurrentUpdateException;
import de.egladil.web.checklistenserver.sanitize.ChecklisteTemplateSanitizer;
import de.egladil.web.checklistenserver.service.ChecklistenTemplateProvider;
import de.egladil.web.commons_validation.ValidationDelegate;
import de.egladil.web.commons_validation.payload.MessagePayload;
import de.egladil.web.commons_validation.payload.ResponsePayload;

/**
 * ChecklistenTemplateResource gibt Vorgabedetails für Checklisten zurück.
 */
@RequestScoped
@Path("templates")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ChecklistenTemplateResource {

	private static final Logger LOG = LoggerFactory.getLogger(ChecklistenTemplateResource.class);

	@Context
	SecurityContext securityContext;

	@Inject
	ChecklistenTemplateProvider templateProvider;

	private final ValidationDelegate validationDelegate = new ValidationDelegate();

	private final ChecklisteTemplateSanitizer checklisteTemplateSanitizer = new ChecklisteTemplateSanitizer();

	@GET
	public Response getTemplates() {

		LOG.debug("entering getChecklisten");

		UserSession userSession = getUserSession();

		LOG.debug("Alles gut: session vorhanden");

		List<ChecklisteTemplate> templates = templateProvider.getTemplates(userSession.getUuid());

		List<ChecklisteTemplate> sanitizedTemplates = templates.stream()
			.map(template -> checklisteTemplateSanitizer.apply(template)).collect(Collectors.toList());

		ResponsePayload payload = new ResponsePayload(MessagePayload.info("OK: Anzahl Checklisten: " + sanitizedTemplates.size()),
			sanitizedTemplates);

		LOG.debug("{}: checklisten geladen", StringUtils.abbreviate(userSession.getUuid(), 11));

		return Response.ok().entity(payload).build();

	}

	@GET
	@Path("/{typ}")
	public Response getTemplateMitTypFuerGruppe(@PathParam("typ") final String typValue) {

		try {

			UserSession userSession = getUserSession();

			Checklistentyp typ = Checklistentyp.valueOf(typValue.trim().toUpperCase());
			ChecklisteTemplate template = templateProvider.getTemplateMitTypFuerGruppe(typ, userSession.getUuid());

			ChecklisteTemplate sanitized = checklisteTemplateSanitizer.apply(template);
			ResponsePayload payload = new ResponsePayload(MessagePayload.info("Bitteschön"), sanitized);
			return Response.ok().entity(payload).build();
		} catch (IllegalArgumentException e) {

			LOG.error("Falscher Parameter [typ={}]", typValue);
			return Response.status(404)
				.entity(ResponsePayload.messageOnly(MessagePayload.error("Gib einen korrekten Checklistentyp an"))).build();
		}
	}

	@POST
	public Response templateSpeichern(final ChecklisteTemplate template) {

		validationDelegate.check(template, ChecklisteTemplate.class);

		UserSession userSession = getUserSession();

		try {

			ChecklisteTemplate persisted = templateProvider.templateSpeichern(template, userSession.getUuid());

			ChecklisteTemplate sanitized = checklisteTemplateSanitizer.apply(persisted);

			LOG.info("Template {} durch {} geändert.", template.getTyp(), StringUtils.abbreviate(userSession.getUuid(), 11));

			String msg = "Listenvorlage für " + template.getTyp() + " erfolgreich gespeichert";

			ResponsePayload payload = new ResponsePayload(MessagePayload.info(msg), sanitized);
			return Response.ok(payload).build();
		} catch (ConcurrentUpdateException e) {

			ChecklisteTemplate neues = (ChecklisteTemplate) e.getActualData();

			ChecklisteTemplate sanitized = checklisteTemplateSanitizer.apply(neues);
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
