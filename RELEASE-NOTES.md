# checklistenserver Release Notes

__Release 8.0.1__:

* [Dialog "neues Teil" ist beim zweiten Aufruf nicht leer](https://github.com/heike2718/checklisten/issues/10)
* erleichterte Navigation fürs Smartphone
* nach Anlegen einer neuen Checkliste sofortige Navigation in die Detailmaske / Modus Konfiguration

__Release 8.0.0__:

* [Nach dem Aufruf der Startseite kommt Serverfehler](https://github.com/heike2718/checklisten/issues/1)
* [Umstellung Frontend auf ngrx](https://github.com/heike2718/checklisten/issues/2)

__Release 7.1.1__:

* log into files
* new common release because of shiro CVE
* bumped quarkus to 1.7.2-Final

__Release 7.1.0__:

* Umstellung jwt auf authorization token grant flow, damit ein JWT niemals im Browser
  ankommt

* update to quarkus-1.6.0-Final

__Release 7.0.0__

update to quarkus-1.3.0-Final

__Release 6.3.2__

CVE-2020-8840: upgrade to [hewi-java-commons version 1.4.4](https://github.com/heike2718/hewi-java-commons/releases/tag/1.4.4)


__Release 6.3.1__

[Kommentar sanitize erzeugt null](https://github.com/heike2718/checklistenserver/issues/22)


__Release 6.3.0__

[API zum Pflegen der Vorschlagslisten](https://github.com/heike2718/checklistenserver/issues/14)

Output-Validation: sanitize names for html

__Release 6.2.2__

Upgrade to quarkus 1.1.0.CR1

[Session für nicht bekannten User wird erzeugt](https://github.com/heike2718/checklistenserver/issues/19)

__Release 6.2.1__

More secure response headers

__Release 6.2.0__

[remove ReplaceAccessTokenRestClient](https://github.com/heike2718/checklistenserver/issues/11)

[delete @LoginConfig(authMethod = "MP-JWT") from ChecklistenServerApp](https://github.com/heike2718/checklistenserver/issues/10)

[ClientAccessTokenService: throws clause does not fit](https://github.com/heike2718/checklistenserver/issues/12)

[UserSession: make uuid immutable](https://github.com/heike2718/checklistenserver/issues/13)


__Release 6.1.0__

personalized todo lists

__Release 6.0.1__

sessionID cookie is now working

__Release 6.0.0__

server side sessions and session cookies in order to protect client access tokens and jwt

__Release 5.3.0__

upgrade to quarkus 0.27.0 in order to fix several CVEs

__Release 5.2.0__

upgrade to quarkus 0.26.1

__Release 5.1.0__

new Version Resource

__Release 5.0.1__

fixed Löschen von Checklisten nicht mehr möglich (Server-error)

__11.09.2019__ attempt to fix

[quarkus-issue-3382](https://github.com/quarkusio/quarkus/issues/3382)
[quarkus-issue-4282](https://github.com/quarkusio/quarkus/pull/4282)

__Release 5.0.0__

migrated to quarkus :D

__Release 4.1.0__

serverseitiges Loggen von clientErrors eingebaut

__Release 4.0.0__

Refresh client access token: Payload Signatur nicht abwärtskompatibel.

__Release 3.0.0__

Nicht abwärtskompatible Änderung: Client-Secrets werden von Server zu Server gegen ein AccessToken eingetauscht, das der checklisten-app übermttelt wird und welches diese dann in den redirects zur auth-app verwendet (statt wie bisher die clientID)
