// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.function.Function;

/**
 * ChecklisteTemplateSanitizer
 */
public class ChecklisteTemplateSanitizer implements Function<ChecklisteTemplate, ChecklisteTemplate> {

	@Override
	public ChecklisteTemplate apply(final ChecklisteTemplate originalTemplate) {

		final ChecklisteTemplateItemSanitizer itemSanitizer = new ChecklisteTemplateItemSanitizer();

		ChecklisteTemplate result = ChecklisteTemplate.create(originalTemplate.getTyp());

		originalTemplate.getItems().forEach(item -> result.addItem(itemSanitizer.apply(item)));

		return result;
	}
}
