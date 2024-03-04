// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.auth;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.Version;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import de.egladil.web.checklistenserver.domain.Checklistenentity;
import de.egladil.web.commons_validation.payload.HateoasPayload;

/**
 * Checklistenuser
 */
@Entity
@Table(name = "USERS")
public class Checklistenuser implements Checklistenentity {

	/* serialVersionUID */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	@JsonIgnore
	private Long id;

	@NotNull
	@Size(min = 1, max = 36)
	@Column(name = "UUID")
	private String uuid;

	@NotNull
	@Size(min = 1, max = 36)
	@Column(name = "GRUPPE")
	private String gruppe;

	@Version
	@Column(name = "VERSION")
	@JsonIgnore
	private int version;

	@Transient
	private Set<String> roles = new HashSet<>();

	@Transient
	private HateoasPayload hateoasPayload;

	/**
	 * Erzeugt eine Instanz von Checklistenuser
	 */
	public Checklistenuser() {

		roles.add("user");
	}

	@Override
	public Long getId() {

		return id;
	}

	public void setId(final Long id) {

		this.id = id;
	}

	public String getUuid() {

		return uuid;
	}

	public void setUuid(final String uuid) {

		this.uuid = uuid;
	}

	public int getVersion() {

		return version;
	}

	public void setVersion(final int version) {

		this.version = version;
	}

	@Override
	public HateoasPayload getHateoasPayload() {

		return hateoasPayload;
	}

	@Override
	public void setHateoasPayload(final HateoasPayload hateoasPayload) {

		this.hateoasPayload = hateoasPayload;
	}

	/**
	 * Rolle werden momentan konstant codiert und nicht in der DB abgelegt.
	 *
	 * @return Set
	 */
	public Set<String> getRoles() {

		return roles;
	}

	@Override
	public String toString() {

		StringBuilder builder = new StringBuilder();
		builder.append("Checklistenuser [uuid=");
		builder.append(StringUtils.abbreviate(uuid, 11));
		builder.append(", roles=");
		builder.append(roles);
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
