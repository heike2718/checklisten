//=====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.checklistenserver.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import de.egladil.web.checklistenserver.infrastructure.persistence.entities.Checklistenuser;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

/**
 * UserDao
 */
@RequestScoped
public class UserDao {

	@Inject
	EntityManager entityManager;

	public Optional<Checklistenuser> findByUniqueIdentifier(final String identifier) {

		List<Checklistenuser> resultList = entityManager.createNamedQuery(Checklistenuser.FIND_BY_UUID, Checklistenuser.class)
			.setParameter("uuid", identifier).getResultList();

		return resultList.isEmpty() ? Optional.empty() : Optional.of(resultList.get(0));

	}
}
