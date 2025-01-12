//=====================================================
// Projekt: checklisten
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.checklistenserver.infrastructure.persistence;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.infrastructure.persistence.entities.Pacemaker;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

/**
 * PacemakerDao
 */
@RequestScoped
public class PacemakerDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(PacemakerDao.class);

	@Inject
	EntityManager entityManager;

	public Pacemaker findByMonitorId(final String monitorId) {
		LOGGER.debug("monitorId='{}'", monitorId);

		return entityManager.createNamedQuery(Pacemaker.FIND_BY_MONITOR_ID, Pacemaker.class).setParameter("monitorId", monitorId)
			.getSingleResult();
	}

	@Transactional
	public Pacemaker save(final Pacemaker entity) {

		Pacemaker persisted = null;

		if (entity.getId() == null) {

			entityManager.persist(entity);
			persisted = entity;
			LOGGER.debug("created: {}, ID={}", persisted, persisted.getId());
		} else {

			persisted = entityManager.merge(entity);
			LOGGER.debug("updated: {}", persisted);
		}

		return persisted;
	}
}
