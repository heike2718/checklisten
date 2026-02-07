// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import de.egladil.web.checklistenserver.domain.Checklistentyp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Checklistenvorlage
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Checklistenvorlage {

	@NotNull(message = "typ ist erforderlich")
	@JsonProperty
	private Checklistentyp typ;

	@JsonIgnore
	private long readTime;

	@JsonProperty
	@Valid
	@Builder.Default
	private List<ChecklistenvorlageItem> items = new ArrayList<>();
}
