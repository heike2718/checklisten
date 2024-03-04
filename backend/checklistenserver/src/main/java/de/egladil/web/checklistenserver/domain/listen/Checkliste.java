// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.listen;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.persistence.Version;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.apache.commons.lang3.StringUtils;

import de.egladil.web.checklistenserver.domain.Checklistenentity;
import de.egladil.web.checklistenserver.domain.Checklistentyp;
import de.egladil.web.commons_validation.payload.HateoasPayload;

/**
 * Checkliste
 */
@Entity
@Table(name = "CHECKLISTEN")
public class Checkliste implements Checklistenentity {

	/* serialVersionUID */
	private static final long serialVersionUID = 1L;

	public static Checkliste create(final Checklistentyp typ, final String name, final String kuerzel) {

		Checkliste result = new Checkliste();
		result.setTyp(typ);
		result.setName(name);
		result.setKuerzel(kuerzel);

		return result;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@NotNull
	@Size(min = 1, max = 36)
	@Column(name = "KUERZEL")
	private String kuerzel;

	@NotNull
	@Size(min = 3, max = 100)
	@Column(name = "NAME")
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(name = "TYP")
	private Checklistentyp typ;

	@NotNull
	@Size(min = 1, max = 36)
	@Column(name = "GRUPPE")
	private String gruppe;

	@NotNull
	@Column(name = "DATEN")
	private String daten;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "DATE_MODIFIED")
	private Date datumGeaendert;

	@Version
	@Column(name = "VERSION")
	private int version;

	@Transient
	private HateoasPayload hateoasPayload;

	@Override
	public int hashCode() {

		final int prime = 31;
		int result = 1;
		result = prime * result + ((kuerzel == null) ? 0 : kuerzel.hashCode());
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
		Checkliste other = (Checkliste) obj;

		if (kuerzel == null) {

			if (other.kuerzel != null) {

				return false;
			}
		} else if (!kuerzel.equals(other.kuerzel)) {

			return false;
		}
		return true;
	}

	@Override
	public Long getId() {

		return id;
	}

	public void setId(final Long id) {

		this.id = id;
	}

	public String getName() {

		return name;
	}

	public void setName(final String name) {

		this.name = name;
	}

	public Checklistentyp getTyp() {

		return typ;
	}

	public void setTyp(final Checklistentyp typ) {

		this.typ = typ;
	}

	public String getDaten() {

		return daten;
	}

	public void setDaten(final String details) {

		this.daten = details;
	}

	public Date getDatumGeaendert() {

		return datumGeaendert;
	}

	public void setDatumGeaendert(final Date datumGeaendert) {

		this.datumGeaendert = datumGeaendert;
	}

	public int getVersion() {

		return version;
	}

	public String getKuerzel() {

		return kuerzel;
	}

	public void setKuerzel(final String kuerzel) {

		this.kuerzel = kuerzel;
	}

	@Override
	public HateoasPayload getHateoasPayload() {

		return hateoasPayload;
	}

	@Override
	public void setHateoasPayload(final HateoasPayload hateoasPayload) {

		this.hateoasPayload = hateoasPayload;
	}

	@Override
	public String toString() {

		StringBuilder builder = new StringBuilder();
		builder.append("Checkliste [kuerzel=");
		builder.append(StringUtils.abbreviate(kuerzel, 11));
		builder.append(", name=");
		builder.append(name);
		builder.append(", typ=");
		builder.append(typ);
		builder.append("]");
		return builder.toString();
	}

	public String getGruppe() {

		return gruppe;
	}

	public void setGruppe(final String gruppe) {

		this.gruppe = gruppe;
	}
}
