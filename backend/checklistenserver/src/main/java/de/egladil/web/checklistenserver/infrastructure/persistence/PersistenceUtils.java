//=====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
//=====================================================
package de.egladil.web.checklistenserver.infrastructure.persistence;

import java.math.BigInteger;

import de.egladil.web.checklistenserver.domain.error.ChecklistenRuntimeException;
import jakarta.persistence.Query;

/**
 * PersistenceUtils
 */
public class PersistenceUtils {

	/**
	 * Übernimmt das Casting gleich mit.
	 *
	 * @param query
	 * @return
	 */
	public static BigInteger getCount(final Query query) {

		final Object res = query.getSingleResult();

		if (!(res instanceof BigInteger)) {

			throw new ChecklistenRuntimeException("result ist kein BigInteger, sondern " + res.getClass());
		}

		return (BigInteger) res;
	}

}
