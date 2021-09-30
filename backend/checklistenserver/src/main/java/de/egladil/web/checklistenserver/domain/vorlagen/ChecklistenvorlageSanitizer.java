// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.function.Function;

/**
 * ChecklistenvorlageSanitizer
 */
public class ChecklistenvorlageSanitizer implements Function<Checklistenvorlage, Checklistenvorlage> {

	@Override
	public Checklistenvorlage apply(final Checklistenvorlage originalTemplate) {

		final ChecklistenvorlageItemSanitizer itemSanitizer = new ChecklistenvorlageItemSanitizer();

		Checklistenvorlage result = Checklistenvorlage.create(originalTemplate.getTyp());

		originalTemplate.getItems().forEach(item -> result.addItem(itemSanitizer.apply(item)));

		return result;
	}
}
