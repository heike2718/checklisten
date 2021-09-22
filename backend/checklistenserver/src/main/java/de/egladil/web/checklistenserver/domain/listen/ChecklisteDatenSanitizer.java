// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.listen;

import java.util.function.Function;

import org.owasp.encoder.Encode;

/**
 * ChecklisteDatenSanitizer
 */
public class ChecklisteDatenSanitizer implements Function<ChecklisteDaten, ChecklisteDaten> {

	@Override
	public ChecklisteDaten apply(final ChecklisteDaten daten) {

		daten.setName(Encode.forHtml(daten.getName()));
		daten.getItems().stream().forEach(item -> {

			item.setName(Encode.forHtml(item.getName()));

			if (item.getKommentar() != null) {

				item.setKommentar(Encode.forHtml(item.getKommentar()));
			}
		});

		return daten;
	}

}
