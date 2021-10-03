// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.domain.error.ChecklistenRuntimeException;

/**
 * AbstractListenvorlage
 */
public abstract class AbstractListenvorlage {

	private static final Logger LOG = LoggerFactory.getLogger(AbstractListenvorlage.class);

	/**
	 * Gibt die Vorlage für die gegebene Gruppe zurück. Wenn es keins mit Präfix 'gruppe' gibt, wird ein leeres Array
	 * zurückggegeben.
	 *
	 * @param  gruppe
	 *                String darf nicht null sein.
	 * @return        String[]
	 */
	public String[] getVorlage(final String gruppe) {

		if (StringUtils.isBlank(gruppe)) {

			LOG.warn("gruppe ist blank: geben leeres Array zurück");

			return new String[0];
		}

		String pathFile = getPathVorlageFile(gruppe);

		Path path = Paths.get(pathFile);

		if (!Files.exists(path)) {

			LOG.warn("File {} existiert nicht: geben leeres Array zurück", path.getFileName());
			return new String[0];
		}

		try (Stream<String> lines = Files.lines(path)) {

			List<String> alle = lines.filter(s -> !StringUtils.isBlank(s)).collect(Collectors.toList());

			String[] einkaufsliste = alle.toArray(new String[0]);

			return einkaufsliste;
		} catch (IOException e) {

			throw new ChecklistenRuntimeException(e.getMessage(), e);
		}
	}

	public String getPathVorlageFile(final String gruppe) {

		return getPathVorlagenDir() + File.separator + gruppe + getSuffixFilename();
	}

	protected abstract String getPathVorlagenDir();

	protected abstract String getSuffixFilename();

}
