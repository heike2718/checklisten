// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.listen;

import de.egladil.web.checklistenserver.domain.validation.ChecklistenRegExps;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * ChecklistenItem
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistenItem implements Serializable {

    /* serialVersionUID */
    private static final long serialVersionUID = 1L;

    @Pattern(regexp = ChecklistenRegExps.VALID_INPUT, message = "name enthält ungültige Zeichen. " + ChecklistenRegExps.INVALID_INPUT_SUFFIX)
    @NotBlank(message = "name ist erforderlich")
    @Size(max = 100, message = "name ist zu lang /max {max} Zeichen")
    private String name;

    private boolean markiert;

    private boolean optional;

    private boolean erledigt;

    @Pattern(regexp = ChecklistenRegExps.VALID_INPUT, message = "kommentar enthält ungültige Zeichen. " + ChecklistenRegExps.INVALID_INPUT_SUFFIX)
    @Size(max = 4000, message = "kommentar ist zu lang (max {max} Zeichen")
    private String kommentar;

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
        ChecklistenItem other = (ChecklistenItem) obj;

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

        StringBuilder builder = new StringBuilder();
        builder.append("ChecklistenItem [name=");
        builder.append(name);
        builder.append("]");
        return builder.toString();
    }

    public String toLog() {

        StringBuilder builder = new StringBuilder();
        builder.append("ChecklistenItem [name=");
        builder.append(name);
        builder.append(", kommentar=");
        builder.append(kommentar);
        builder.append("]");
        return builder.toString();
    }
}
