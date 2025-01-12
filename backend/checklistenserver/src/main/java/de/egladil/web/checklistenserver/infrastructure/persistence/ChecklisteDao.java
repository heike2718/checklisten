// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.infrastructure.persistence.entities.Checkliste;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

/**
 * ChecklisteDao
 */
@RequestScoped
public class ChecklisteDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(ChecklisteDao.class);

	@Inject
	EntityManager entityManager;

	@Transactional
	public void delete(final Checkliste checkliste) {

		// BalusC: falls die Transaktion nicht schon mit dem Suchen der Checkliste beginnt (siehe ChecklistenServivce),
		// muss man es
		// so machen. Es schadet aber nichts, wenn man es immer so macht.
		entityManager.remove(entityManager.contains(checkliste) ? checkliste : entityManager.merge(checkliste));
		// getEm().remove(checkliste);
		LOGGER.debug("deleted: {}", checkliste);
	}

	public List<Checkliste> load(final String gruppe) {

		if (StringUtils.isBlank(gruppe)) {

			throw new IllegalArgumentException("gruppe blank");
		}

		List<Checkliste> trefferliste = entityManager.createNamedQuery(Checkliste.FIND_WITH_GRUPPE, Checkliste.class)
			.setParameter("gruppe", gruppe).getResultList();

		LOGGER.debug("Checkliste - Anzahl Treffer: {}", trefferliste.size());

		return trefferliste;
	}

	public int getAnzahl(final String gruppe) {

		if (StringUtils.isBlank(gruppe)) {

			throw new IllegalArgumentException("gruppe blank");
		}

		String stmt = "select count(*) from CHECKLISTEN where GRUPPE = :gruppe";
		final Query query = entityManager.createNativeQuery(stmt);
		query.setParameter("gruppe", gruppe);

		return PersistenceUtils.getCount(query).intValue();
	}

	/**
	 * @param kuerzel
	 * @return
	 */
	public Optional<Checkliste> findByUniqueIdentifier(final String kuerzel) {

		List<Checkliste> trefferliste = entityManager.createNamedQuery(Checkliste.FIND_WITH_KUERZEL, Checkliste.class)
			.setParameter("kuerzel", kuerzel).getResultList();

		return trefferliste.isEmpty() ? Optional.empty() : Optional.of(trefferliste.get(0));
	}

	/**
	 * @param checkliste
	 * @return
	 */
	@Transactional
	public Checkliste save(final Checkliste checkliste) {

		if (checkliste.getId() == null) {
			entityManager.persist(checkliste);
			LOGGER.debug("created: ID={}", checkliste.getId());
			return checkliste;
		} else {
			return entityManager.merge(checkliste);
		}
	}
}
