package de.egladil.web.checklistenserver.infrastructure.rest;

import de.egladil.web.checklistenserver.domain.vorlagen.Checklistenvorlage;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.AttributeType;
import io.quarkus.test.security.SecurityAttribute;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestHTTPEndpoint(ChecklistenvorlageResource.class)
public class ChecklistenvorlageResourceTest {

    @Inject
    SecurityIdentity identity;

    @Test
    @TestSecurity(user = "testUser", attributes = {@SecurityAttribute(key = "uuid", value = "gakgadk", type = AttributeType.STRING)})
    void testLoadVorlagen() {

        // act
        Checklistenvorlage[] checklistenvorlagen = given().when()
                .get()
                .then()
                .statusCode(200)
                .and()
                .extract()
                .as(Checklistenvorlage[].class);

        // assert
        assertEquals(2, checklistenvorlagen.length);
    }
}
