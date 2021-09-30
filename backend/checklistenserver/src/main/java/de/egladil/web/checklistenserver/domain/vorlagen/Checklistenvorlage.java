// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import de.egladil.web.checklistenserver.domain.Checklistentyp;

/**
 * Checklistenvorlage
 */
@ValidVorlage
public class Checklistenvorlage {

	@NotNull
	private Checklistentyp typ;

	private long readTime;

	@Size(max = 999)
	private List<ChecklistenvorlageItem> items = new ArrayList<>();

	public static final Checklistenvorlage create(final Checklistentyp typ) {

		Checklistenvorlage template = new Checklistenvorlage();
		template.typ = typ;
		return template;

	}

	public static final Checklistenvorlage create(final Checklistentyp typ, final List<ChecklistenvorlageItem> items, final long timestamp) {

		Checklistenvorlage template = new Checklistenvorlage();
		template.typ = typ;
		template.items = items;
		template.readTime = timestamp;
		return template;

	}

	public Checklistentyp getTyp() {

		return typ;
	}

	public List<ChecklistenvorlageItem> getItems() {

		return items;
	}

	public void addItem(final ChecklistenvorlageItem item) {

		if (!items.contains(item)) {

			items.add(item);
		}

	}

	public void sortItems() {

		Collections.sort(items, new ChecklistenvorlageItemComparator());

	}

	public long getReadTime() {

		return readTime;
	}

	public void setReadTime(final long readTime) {

		this.readTime = readTime;
	}

}
