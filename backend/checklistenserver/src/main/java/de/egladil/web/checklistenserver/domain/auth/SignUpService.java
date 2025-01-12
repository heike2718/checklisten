// =====================================================
// Projekt: checklistenserver
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.auth;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.checklistenserver.infrastructure.persistence.UserDao;
import de.egladil.web.checklistenserver.infrastructure.persistence.entities.Checklistenuser;
import de.egladil.web.commons_validation.payload.HateoasPayload;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

@RequestScoped
public class SignUpService {

	private static final Logger LOG = LoggerFactory.getLogger(SignUpService.class);

	@Inject
	UserDao userDao;

	/**
	 * Gibt den user zurück, falls er existiert, sonst ein leeres Optional.
	 *
	 * @param uuid
	 * @return
	 */
	public Optional<HateoasPayload> findUser(final String uuid) {

		Optional<Checklistenuser> optUser = userDao.findByUniqueIdentifier(uuid);

		if (!optUser.isPresent()) {

			return Optional.empty();
		}

		HateoasPayload result = createHateoasPayload(uuid);
		return Optional.of(result);
	}

	/**
	 * Erzeugt das Teil, was für jemanden, der REST mit HATEOAS verwenden will, erforderlich ist, um die User-Resource
	 * zu finden.
	 *
	 * @param uuid
	 * @return
	 */
	HateoasPayload createHateoasPayload(final String uuid) {

		HateoasPayload result = new HateoasPayload(uuid, "/users/" + uuid);
		return result;
	}
}
