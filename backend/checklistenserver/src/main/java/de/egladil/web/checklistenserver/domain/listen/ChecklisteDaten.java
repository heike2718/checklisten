// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.listen;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.egladil.web.checklistenserver.domain.validation.ChecklistenRegExps;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import de.egladil.web.checklistenserver.domain.Checklistentyp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ChecklisteDaten
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Valid
public class ChecklisteDaten {

	@Pattern(regexp = ChecklistenRegExps.VALID_KUERZEL, message = "kuerzel enthält ungültige Zeichen")
	@Size(max = 36, message = "kuerzel ist zu lang (max {max} Zeichen")
	@NotBlank(message = "kuerzel ist erforderlich")
	@JsonProperty
	private String kuerzel;

	@Pattern(regexp = ChecklistenRegExps.VALID_INPUT, message = "name enthält ungültige Zeichen. " + ChecklistenRegExps.INVALID_INPUT_SUFFIX)
	@NotBlank(message = "name ist erforderlich")
	@Size(max = 100, message = "name ist zu lang (max {max} Zeichen)")
	@JsonProperty
	private String name;

	@Pattern(regexp = ChecklistenRegExps.VALID_KUERZEL, message = "gruppe enthält ungültige Zeichen")
	@Size(max = 36, message = "gruppe ist zu lang (max {max} Zeichen")
	@NotBlank(message = "gruppe ist erforderlich")
	@JsonProperty
	private String gruppe;

	@NotNull(message = "typ ist erforderlich")
	@JsonProperty
	private Checklistentyp typ;

	@JsonProperty
	private int version;

	@JsonIgnore
	private int anzahlErledigt;

	@JsonProperty
	@Valid
	@Builder.Default
	private List<ChecklistenItem> items = new ArrayList<>();
}
