package de.egladil.web.checklistenserver.domain.auth;

public interface AuthenticationContext {

    /**
     * Der user wird vom AuthorizationFilter in den AuthenticationContext gepackt und hier dann herausgeholt.
     *
     * @return
     */
    AuthenticatedUser getUser();

    /**
     * @param role
     * @return boolean
     */
    boolean isUserInRole(String role);
}
