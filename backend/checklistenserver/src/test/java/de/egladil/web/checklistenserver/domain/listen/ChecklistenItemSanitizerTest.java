// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.listen;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

/**
 * ChecklistenItemSanitizerTest
 */
public class ChecklistenItemSanitizerTest {

	@Test
	void testEscapesScriptTag() {

		// Arrange
		ChecklistenItem item = ChecklistenItem.fromName("<script>alert(\"Hello! I am an alert box!!\")</script>");

		// Act
		ChecklistenItem sanitizedItem = new ChecklistenItemSanitizer().apply(item);

		// Assert
		assertEquals("&lt;script&gt;alert(&#34;Hello! I am an alert box!!&#34;)&lt;/script&gt;", sanitizedItem.getName());

		// Act 2
		ChecklistenItem nochmals = new ChecklistenItemSanitizer().apply(sanitizedItem);

		// Assert 2
		assertEquals("&amp;lt;script&amp;gt;alert(&amp;#34;Hello! I am an alert box!!&amp;#34;)&amp;lt;/script&amp;gt;",
			nochmals.getName());

	}

	@Test
	void testLeavesKommentarNull() {

		// Arrange
		ChecklistenItem item = ChecklistenItem.fromName("Butter");

		// Act
		ChecklistenItem sanitizedItem = new ChecklistenItemSanitizer().apply(item);

		// Assert
		assertEquals("Butter", sanitizedItem.getName());
		assertNull(item.getKommentar());

	}

}
