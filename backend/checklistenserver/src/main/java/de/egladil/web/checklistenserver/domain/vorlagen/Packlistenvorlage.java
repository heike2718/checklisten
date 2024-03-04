// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.vorlagen;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Packlistenvorlage
 */
@ApplicationScoped
public class Packlistenvorlage extends AbstractListenvorlage {

	private static final String SUFFIX_FILENAME = "_packliste.txt";

	@ConfigProperty(name = "dir.packlisten")
	String pathDirPacklisten;

	@Override
	protected String getPathVorlagenDir() {

		return pathDirPacklisten;
	}

	@Override
	protected String getSuffixFilename() {

		return SUFFIX_FILENAME;
	}

}
