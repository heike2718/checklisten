// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.vorlagen;

import de.egladil.web.checklistenserver.domain.listen.ChecklistenItem;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * ChecklistenTemplateProviderTest
 */
public class ChecklistenTemplateProviderTest {

    @Test
    void mapFiltertNurNonBlankElements() {

        // Arrange
        String[] namen = new String[]{" ", "eins ", "eins", null, "", "zwei"};
        ChecklistenvorlageProvider provider = new ChecklistenvorlageProvider();

        // Act
        List<ChecklistenItem> items = provider.mapToChecklistenItems(namen);

        // Assert
        assertAll(() -> assertEquals(2, items.size()),
                () -> assertEquals(ChecklistenItem.builder().name("eins").build(), items.get(0)),
                () -> assertEquals(ChecklistenItem.builder().name("zwei").build(), items.get(1)));
    }

    @Test
    void mapSortiertAlphabetisch() {

        // Arrange
        String[] namen = new String[]{"zwei", "äh", "ah"};
        ChecklistenvorlageProvider provider = new ChecklistenvorlageProvider();

        // Act
        List<ChecklistenItem> items = provider.mapToChecklistenItems(namen);

        // Assert
        assertAll(() -> assertEquals(3, items.size()),
                () -> assertEquals(ChecklistenItem.builder().name("äh").build(), items.get(0)),
                () -> assertEquals(ChecklistenItem.builder().name("ah").build(), items.get(1)),
                () -> assertEquals(ChecklistenItem.builder().name("zwei").build(), items.get(1)));
    }
}
