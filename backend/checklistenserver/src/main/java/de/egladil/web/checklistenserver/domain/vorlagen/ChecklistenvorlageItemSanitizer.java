// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.function.Function;

import org.owasp.encoder.Encode;

/**
 * ChecklistenvorlageItemSanitizer
 */
public class ChecklistenvorlageItemSanitizer implements Function<ChecklistenvorlageItem, ChecklistenvorlageItem> {

	@Override
	public ChecklistenvorlageItem apply(final ChecklistenvorlageItem originalitem) {

		ChecklistenvorlageItem result = ChecklistenvorlageItem.create(Encode.forHtml(originalitem.getName()),
			originalitem.getTyp());
		return result;
	}

}
