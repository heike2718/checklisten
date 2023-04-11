// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import de.egladil.web.checklistenserver.domain.Checklistentyp;

/**
 * ChecklisteTemplateItemSanitizerTest
 */
public class ChecklisteTemplateItemSanitizerTest {

	@Test
	void testEscapesScriptTag() {

		// Arrange
		ChecklistenvorlageItem item = ChecklistenvorlageItem.create("<script>alert(\"Hello! I am an alert box!!\")</script>",
			Checklistentyp.EINKAUFSLISTE);

		// Act
		ChecklistenvorlageItem sanitizedItem = new ChecklistenvorlageItemSanitizer().apply(item);

		// Assert
		assertEquals("&lt;script&gt;alert(&#34;Hello! I am an alert box!!&#34;)&lt;/script&gt;", sanitizedItem.getName());

	}

	@Test
	void testEscapesNull() {

		// Arrange
		ChecklistenvorlageItem item = ChecklistenvorlageItem.create(null,
			Checklistentyp.EINKAUFSLISTE);

		// Act
		ChecklistenvorlageItem sanitizedItem = new ChecklistenvorlageItemSanitizer().apply(item);

		// Assert
		assertEquals("null", sanitizedItem.getName());

	}

}
