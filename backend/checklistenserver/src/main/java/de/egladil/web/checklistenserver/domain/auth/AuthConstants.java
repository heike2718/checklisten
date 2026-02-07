package de.egladil.web.checklistenserver.domain.auth;

/**
 * AuthConstants
 */
public interface AuthConstants {

    final String CSRF_TOKEN_COOKIE_NAME = "XSRF-TOKEN";

    final String CSRF_TOKEN_HEADER_NAME = "X-XSRF-TOKEN";

    /**
     * Dient zur Unterscheidung im Browser: Cookie wird nur an diese Sub-URL gesendet.
     */
    final String COOKIE_PATH = "/checklisten";

    // Wichtig: der Name des SessionCookies muss mit JSESSIONID beginnen!!!
    // Außerdem müssen die Requests vom frontend das Attribut withCredentials: true haben (Angular - Intercepror!)
    String SESSION_COOKIE_NAME = "JSESSIONID";

    public String SESSION_ID_HEADER = "X-SESSIONID";
}
