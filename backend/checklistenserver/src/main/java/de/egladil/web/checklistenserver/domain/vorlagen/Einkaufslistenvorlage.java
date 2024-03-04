// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.vorlagen;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Einkaufslistenvorlage
 */
@ApplicationScoped
public class Einkaufslistenvorlage extends AbstractListenvorlage {

	private static final String SUFFIX_FILENAME = "_einkaufsliste.txt";

	@ConfigProperty(name = "dir.einkaufslisten")
	String pathDirEinkaufslisten;

	@Override
	protected String getPathVorlagenDir() {

		return pathDirEinkaufslisten;
	}

	@Override
	protected String getSuffixFilename() {

		return SUFFIX_FILENAME;
	}
}
