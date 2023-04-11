// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.persistence;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

/**
 * ChecklistenuserDaoTest
 */
public class ChecklistenuserDaoTest {

	@Test
	void testUniqueIdentityQuery() {

		// Arrange
		String identifierName = "hühnchen";
		UserDao dao = new UserDao();

		// Act
		String stmt = dao.getFindEntityByUniqueIdentifierQuery(identifierName);

		// Assert
		assertEquals("select u from Checklistenuser u where u.uuid=:hühnchen", stmt);
	}

	@Test
	void testCountStatement() {

		// Act
		String stmt = new UserDao().getCountStatement();

		// Assert
		assertEquals("select count(*) from USER", stmt);

	}
}
