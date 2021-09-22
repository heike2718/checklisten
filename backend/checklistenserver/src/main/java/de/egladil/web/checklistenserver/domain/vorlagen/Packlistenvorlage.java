// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.vorlagen;

import javax.enterprise.context.ApplicationScoped;

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
	protected String getPathTemplateDir() {

		return pathDirPacklisten;
	}

	@Override
	protected String getSuffixFilename() {

		return SUFFIX_FILENAME;
	}

}
