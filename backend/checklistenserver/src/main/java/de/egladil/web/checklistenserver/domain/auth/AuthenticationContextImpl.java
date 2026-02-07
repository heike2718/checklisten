package de.egladil.web.checklistenserver.domain.auth;

import jakarta.enterprise.context.RequestScoped;

import java.util.Arrays;
import java.util.Optional;

@RequestScoped
public class AuthenticationContextImpl implements AuthenticationContext{

    private AuthenticatedUser user;


    @Override
    public AuthenticatedUser getUser() {
        return user;
    }

    @Override
    public boolean isUserInRole(String role) {
        Optional<String> optRole = Arrays.stream(user.getRoles()).filter(r -> r.equalsIgnoreCase(role)).findFirst();
        return optRole.isPresent();
    }
}
