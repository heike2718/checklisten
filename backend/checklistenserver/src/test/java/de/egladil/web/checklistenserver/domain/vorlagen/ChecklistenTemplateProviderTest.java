//=====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.checklistenserver.domain.vorlagen;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import de.egladil.web.checklistenserver.domain.listen.ChecklistenItem;
import de.egladil.web.checklistenserver.domain.vorlagen.ChecklistenvorlageProvider;

/**
 * ChecklistenTemplateProviderTest
 */
public class ChecklistenTemplateProviderTest {

	@Test
	void mapFiltertNurNonBlankElements() {
		// Arrange
		String[] namen = new String[] { " ", "eins ", "eins", null, "", "zwei" };
		ChecklistenvorlageProvider provider = new ChecklistenvorlageProvider();

		// Act
		List<ChecklistenItem> items = provider.mapToChecklistenItems(namen);

		// Assert
		assertEquals(2, items.size());
		assertEquals(ChecklistenItem.fromName("eins"), items.get(0));
		assertEquals(ChecklistenItem.fromName("zwei"), items.get(1));

	}

	@Test
	void mapSortiertAlphabetisch() {
		// Arrange
		String[] namen = new String[] { "zwei", "äh", "ah" };
		ChecklistenvorlageProvider provider = new ChecklistenvorlageProvider();

		// Act
		List<ChecklistenItem> items = provider.mapToChecklistenItems(namen);

		// Assert
		assertEquals(3, items.size());
		assertEquals(ChecklistenItem.fromName("äh"), items.get(0));
		assertEquals(ChecklistenItem.fromName("ah"), items.get(1));
		assertEquals(ChecklistenItem.fromName("zwei"), items.get(2));
	}
}
