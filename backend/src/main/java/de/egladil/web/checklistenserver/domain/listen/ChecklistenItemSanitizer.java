// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.listen;

import java.util.function.Function;

import org.owasp.encoder.Encode;

/**
 * ChecklistenItemSanitizer
 */
public class ChecklistenItemSanitizer implements Function<ChecklistenItem, ChecklistenItem> {

	@Override
	public ChecklistenItem apply(final ChecklistenItem item) {

		if (item.getKommentar() != null) {

			item.setKommentar(Encode.forHtml(item.getKommentar()));
		}
		item.setName(Encode.forHtml(item.getName()));
		return item;
	}

}
