package de.egladil.web.checklistenserver.domain.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.security.runtime.QuarkusPrincipal;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;


public class AuthenticatedUser extends QuarkusPrincipal {

    @JsonProperty
    private String idReference;

    @JsonProperty
    private String[] roles = new String[0];

    @JsonProperty
    private String fullName;

    public static AuthenticatedUser createAnonymousUser() {
        AuthenticatedUser result = new AuthenticatedUser("Anonym");
        result.roles = new String[0];
        result.fullName = "Gast";
        return result;
    }

    /**
     * @param uuid String die UUID des Benutzerkontos.
     */
    public AuthenticatedUser(final String uuid) {
        super(uuid);
    }

    @Override
    public String toString() {

        return "AuthenticatedUser [uuid=" + StringUtils.abbreviate(getName(), 11) + ", roles=" + Arrays.toString(roles) + "]";
    }

    public String getIdReference() {
        return idReference;
    }

    public AuthenticatedUser withIdReference(String idReference) {
        this.idReference = idReference;
        return this;
    }

    public String[] getRoles() {
        return roles;
    }

    public AuthenticatedUser withRoles(String[] roles) {
        this.roles = roles;
        return this;
    }

    public String getFullName() {
        return fullName;
    }

    public AuthenticatedUser withFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    /**
     * @return the uuid
     */
    public String getUuid() {

        return getName();
    }
}
