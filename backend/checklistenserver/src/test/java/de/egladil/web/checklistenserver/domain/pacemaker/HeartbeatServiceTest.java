// =====================================================
// Projekt: checklisten
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.pacemaker;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import de.egladil.web.checklistenserver.infrastructure.persistence.PacemakerDao;
import de.egladil.web.checklistenserver.infrastructure.persistence.entities.Pacemaker;
import de.egladil.web.commons_validation.payload.ResponsePayload;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

/**
 * HeartbeatServiceTest
 */
@QuarkusTest
public class HeartbeatServiceTest {

	@InjectMock
	private PacemakerDao dao;

	@Inject
	private HeartbeatService service;

	private Pacemaker pacemaker;

	@BeforeEach
	public void setUp() {

		pacemaker = new Pacemaker();
		pacemaker.setId(1l);
		pacemaker.setMonitorId("checklisten-database");
		pacemaker.setWert("wert-1558961580334");
	}

	@Test
	void updateSuccess() {

		// Arrange
		Mockito.when(dao.findByMonitorId("checklisten-database")).thenReturn(pacemaker);
		Mockito.when(dao.save(pacemaker)).thenReturn(pacemaker);

		// Act
		ResponsePayload responsePayload = service.update();

		// Assert
		assertEquals("INFO", responsePayload.getMessage().getLevel());
		assertEquals("checklisten-database lebt", responsePayload.getMessage().getMessage());
		assertNull(responsePayload.getData());

	}

	@Test
	void updateExceptionOnFind() {

		// Arrange
		Mockito.when(dao.findByMonitorId("checklisten-database")).thenThrow(new RuntimeException("testmessage"));

		// Act
		ResponsePayload responsePayload = service.update();

		// Assert
		assertEquals("ERROR", responsePayload.getMessage().getLevel());
		assertEquals("Fehler beim Speichern des pacemakers checklisten-database: testmessage",
			responsePayload.getMessage().getMessage());
		assertNull(responsePayload.getData());

	}

	@Test
	void updateExceptionOnSave() {

		// Arrange
		Mockito.when(dao.findByMonitorId("checklisten-database")).thenReturn(pacemaker);
		Mockito.when(dao.save(pacemaker)).thenThrow(new RuntimeException("testmessage"));

		// Act
		ResponsePayload responsePayload = service.update();

		// Assert
		assertEquals("ERROR", responsePayload.getMessage().getLevel());
		assertEquals("Fehler beim Speichern des pacemakers checklisten-database: testmessage",
			responsePayload.getMessage().getMessage());
		assertNull(responsePayload.getData());

	}

}
