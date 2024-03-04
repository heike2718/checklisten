// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import de.egladil.web.checklistenserver.domain.Checklistentyp;
import de.egladil.web.commons_validation.annotations.StringLatin;

/**
 * ChecklistenvorlageItem
 */
public class ChecklistenvorlageItem {

	@NotNull
	private Checklistentyp typ;

	@StringLatin
	@NotBlank
	private String name;

	public static ChecklistenvorlageItem create(final String name, final Checklistentyp typ) {

		ChecklistenvorlageItem result = new ChecklistenvorlageItem();
		result.name = name;
		result.typ = typ;
		return result;
	}

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

	public void setName(final String name) {

		this.name = name;
	}

}
