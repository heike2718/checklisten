// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import de.egladil.web.checklistenserver.domain.validation.ChecklistenRegExps;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import de.egladil.web.checklistenserver.domain.Checklistentyp;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * ChecklistenvorlageItem
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistenvorlageItem {

	@NotNull(message = "typ ist erforderlich")
	private Checklistentyp typ;

	@Pattern(regexp = ChecklistenRegExps.VALID_INPUT, message = "name enthält ungültige Zeichen. " + ChecklistenRegExps.INVALID_INPUT_SUFFIX)
	@NotBlank(message = "name ist erforderlich")
	@Size(max = 100, message = "name ist zu lang (max {max} Zeichen)")
	private String name;

	public Checklistentyp getTyp() {

		return typ;
	}

	public String getName() {

		return name;
	}

	@Override
	public int hashCode() {

		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(final Object obj) {

		if (this == obj) {

			return true;
		}

		if (obj == null) {

			return false;
		}

		if (getClass() != obj.getClass()) {

			return false;
		}
		ChecklistenvorlageItem other = (ChecklistenvorlageItem) obj;

		if (name == null) {

			if (other.name != null) {

				return false;
			}
		} else if (!name.equals(other.name)) {

			return false;
		}
		return true;
	}

	@Override
	public String toString() {
		return name;
	}
}
