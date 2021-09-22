// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.function.Function;

import org.owasp.encoder.Encode;

/**
 * ChecklisteTemplateItemSanitizer
 */
public class ChecklisteTemplateItemSanitizer implements Function<ChecklisteTemplateItem, ChecklisteTemplateItem> {

	@Override
	public ChecklisteTemplateItem apply(final ChecklisteTemplateItem originalitem) {

		ChecklisteTemplateItem result = ChecklisteTemplateItem.create(Encode.forHtml(originalitem.getName()),
			originalitem.getTyp());
		return result;
	}

}
