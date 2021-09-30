// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.vorlagen;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.Collator;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.domain.Checklistentyp;
import de.egladil.web.checklistenserver.domain.auth.Checklistenuser;
import de.egladil.web.checklistenserver.domain.error.ChecklistenRuntimeException;
import de.egladil.web.checklistenserver.domain.error.ConcurrentUpdateException;
import de.egladil.web.checklistenserver.domain.listen.ChecklisteDaten;
import de.egladil.web.checklistenserver.domain.listen.ChecklisteDatenSanitizer;
import de.egladil.web.checklistenserver.domain.listen.ChecklistenItem;
import de.egladil.web.checklistenserver.infrastructure.persistence.UserDao;
import de.egladil.web.commons_net.time.CommonTimeUtils;

/**
 * ChecklistenvorlageProvider
 */
@ApplicationScoped
public class ChecklistenvorlageProvider {

	private static final Logger LOG = LoggerFactory.getLogger(ChecklistenvorlageProvider.class);

	@Inject
	Einkaufslistenvorlage einkaufslistenvorlage;

	@Inject
	Packlistenvorlage packlistenvorlage;

	@Inject
	UserDao userDao;

	public List<Checklistenvorlage> getTemplates(final String userUuid) {

		Optional<Checklistenuser> optUser = userDao.findByUniqueIdentifier(userUuid);

		if (optUser.isEmpty()) {

			throw new ChecklistenRuntimeException("An dieser Stelle müsste ein User mit uuid=" + userUuid + " vorhanden sein");
		}

		final String gruppe = optUser.get().getGruppe();

		List<Checklistenvorlage> result = new ArrayList<>();

		Arrays.stream(Checklistentyp.values()).filter(typ -> typ.hasTemplate()).forEach(typ -> {

			List<ChecklistenItem> items = readFromFile(typ, gruppe);

			Checklistenvorlage template = Checklistenvorlage.create(typ);

			items.stream().forEach(item -> template.addItem(ChecklistenvorlageItem.create(item.getName(), typ)));

			template.sortItems();

			result.add(template);
		});

		return result;

	}

	/**
	 * Gibt das Checklistenvorlage des gegebenen Typs zurück.
	 *
	 * @param  typ
	 *                  Checklistentyp
	 * @param  userUuid
	 *                  String Name der Gruppe
	 * @return          Checklistenvorlage
	 */
	public Checklistenvorlage getVorlageMitTypFuerGruppe(final Checklistentyp typ, final String userUuid) {

		Optional<Checklistenuser> optUser = userDao.findByUniqueIdentifier(userUuid);

		if (optUser.isEmpty()) {

			throw new ChecklistenRuntimeException("An dieser Stelle müsste ein User mit uuid=" + userUuid + " vorhanden sein");
		}

		final Checklistenvorlage result = Checklistenvorlage.create(typ);
		List<ChecklistenItem> items = readFromFile(typ, optUser.get().getGruppe());
		items.stream().forEach(item -> result.addItem(ChecklistenvorlageItem.create(item.getName(), typ)));
		result.setReadTime(System.currentTimeMillis());

		result.sortItems();
		return result;
	}

	/**
	 * Gibt eine Standardvorauswahl für eine bestimmte Checkliste zurück. Diese Vorauswahl ist mit der Gruppe personalisiert (gruppe
	 * = präfix). Falls es kein personalisiertes Template gibt, wird ein default zurückgegeben.
	 *
	 * @param  typ
	 *                Checklistentyp
	 * @param  gruppe
	 *                String Name der Gruppe
	 * @return        ChecklisteDaten
	 */
	public ChecklisteDaten getChecklisteMitTypFuerGruppe(final Checklistentyp typ, final String gruppe) {

		ChecklisteDaten result = new ChecklisteDaten();

		result = new ChecklisteDatenSanitizer().apply(result);

		result.setTyp(typ);
		result.setKuerzel(UUID.randomUUID().toString());
		List<ChecklistenItem> items = readFromFile(typ, gruppe);
		result.setItems(items);

		return result;
	}

	/**
	 * Überschreibt die Template-Datei mit den Item-Namen für diese Gruppe.
	 *
	 * @param vorlage
	 * @param userSession
	 */
	public Checklistenvorlage vorlageSpeichern(final Checklistenvorlage vorlage, final String userUuid) throws ConcurrentUpdateException {

		Optional<Checklistenuser> optUser = userDao.findByUniqueIdentifier(userUuid);

		if (optUser.isEmpty()) {

			throw new ChecklistenRuntimeException("An dieser Stelle müsste ein User mit uuid=" + userUuid + " vorhanden sein");
		}

		switch (vorlage.getTyp()) {

		case EINKAUFSLISTE:

			break;

		case PACKLISTE:
			break;

		default:
			break;
		}

		try {

			Checklistenvorlage persisted = this.writeToFile(vorlage.getTyp(), optUser.get(), vorlage.getItems());

			persisted = new ChecklistenvorlageSanitizer().apply(persisted);
			return persisted;

		} catch (IOException e) {

			LOG.error("Fehler beim Speichern der Vorlage {}: {}", vorlage.getTyp(), e.getMessage());

			throw new ChecklistenRuntimeException("Konnte Template " + vorlage.getTyp() + " nicht speichern");
		}
	}

	/**
	 * Zu Testzwecken Sichtbarkeit package
	 *
	 * @param  namen
	 *               String[]
	 * @return       List
	 */
	List<ChecklistenItem> mapToChecklistenItems(final String[] namen) {

		Set<String> gefilterteNamen = Stream.of(namen).filter(name -> StringUtils.isNotBlank(name)).map(name -> name.trim())
			.collect(Collectors.toSet());

		ArrayList<String> namenliste = new ArrayList<>(gefilterteNamen);

		Collator coll = Collator.getInstance(Locale.GERMAN);
		coll.setStrength(Collator.PRIMARY);
		Collections.sort(namenliste, coll);

		List<ChecklistenItem> result = namenliste.stream().map(ChecklistenItem::fromName)
			.collect(Collectors.toList());
		return result;
	}

	private List<ChecklistenItem> readFromFile(final Checklistentyp typ, final String gruppe) {

		switch (typ) {

		case EINKAUFSLISTE:
			return mapToChecklistenItems(einkaufslistenvorlage.getVorlage(gruppe));

		case PACKLISTE:
			return mapToChecklistenItems(packlistenvorlage.getVorlage(gruppe));

		default:
			return new ArrayList<>();
		}
	}

	private Checklistenvorlage writeToFile(final Checklistentyp typ, final Checklistenuser user, final List<ChecklistenvorlageItem> items) throws IOException, ConcurrentUpdateException {

		String pathVorlagenFile = null;

		switch (typ) {

		case EINKAUFSLISTE:
			pathVorlagenFile = einkaufslistenvorlage.getPathVorlageFile(user.getGruppe());
			break;

		case PACKLISTE:
			pathVorlagenFile = packlistenvorlage.getPathVorlageFile(user.getGruppe());
			break;

		default:
			break;
		}

		if (pathVorlagenFile != null) {

			File file = new File(pathVorlagenFile);

			if (file.isFile()) {

				long lastModified = java.nio.file.Files.getLastModifiedTime(Paths.get(pathVorlagenFile)).toMillis();
				LocalDateTime timeLastModified = CommonTimeUtils.transformFromDate(new Date(lastModified));

				if (LocalDateTime.now().isBefore(timeLastModified)) {

					Checklistenvorlage neueVorlage = getVorlageMitTypFuerGruppe(typ, user.getUuid());

					ConcurrentUpdateException concurrentUpdateException = new ConcurrentUpdateException(
						"Listenvorlage " + typ + " wurde kürzlich durch jemand anderen geändert. Anbei die neue Version.");
					concurrentUpdateException.setActualData(neueVorlage);
					throw concurrentUpdateException;
				}
			}

			// String pathBackupFile = pathTemplateFile + "-" + System.currentTimeMillis();
			//
			// java.nio.file.Files.move(Paths.get(pathTemplateFile), Paths.get(pathBackupFile),
			// StandardCopyOption.REPLACE_EXISTING);

			try (FileWriter fw = new FileWriter(file)) {

				for (int i = 0; i < items.size(); i++) {

					String name = items.get(i).getName();
					fw.write(name);

					if (i < items.size() - 1) {

						fw.write(System.lineSeparator());
					}
				}
				fw.flush();
			}

			return Checklistenvorlage.create(typ, items, System.currentTimeMillis());
		}

		return null;
	}
}
