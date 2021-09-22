//=====================================================
// Projekt: checklisten
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.checklistenserver.domain.pacemaker;

import de.egladil.web.checklistenserver.domain.IBaseDao;

/**
 * IPacemakerDao
 */
public interface IPacemakerDao extends IBaseDao {

	/**
	 * Sucht den Pacemaker mit dem gegebenen fachlichen Schlüssel
	 *
	 * @param monitorId String
	 * @return Pacemaker oder exception
	 */
	Pacemaker findByMonitorId(String monitorId);

}
