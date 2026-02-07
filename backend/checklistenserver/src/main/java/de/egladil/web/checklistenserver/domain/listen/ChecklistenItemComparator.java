package de.egladil.web.checklistenserver.domain.listen;

import java.text.Collator;
import java.util.*;

public class ChecklistenItemComparator implements Comparator<ChecklistenItem> {


    @Override
    public int compare(ChecklistenItem o1, ChecklistenItem o2) {
        if (o1 == o2) {

            return 0;
        }

        if (o1 == null && o2 != null) {

            return -1;
        }

        if (o1 != null && o2 == null) {

            return 1;
        }
        String name1 = o1.getName().toLowerCase();
        String name2 = o2.getName().toLowerCase();

        if (name1.equals(name2)) {

            return 0;
        }

        List<String> items = Arrays.asList(name1, name2);

        Collator coll = Collator.getInstance(Locale.GERMAN);
        coll.setStrength(Collator.PRIMARY);
        Collections.sort(items, coll);

        if (name1.equals(items.get(0))) {

            return -1;
        }

        return 1;
    }
}
