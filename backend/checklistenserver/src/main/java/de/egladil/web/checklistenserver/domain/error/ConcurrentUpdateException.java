// =====================================================
// Projekt: authenticationprovider
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.checklistenserver.domain.error;

/**
 * ConcurrentUpdateException
 */
public class ConcurrentUpdateException extends RuntimeException {

	/* serialVersionUID */
	private static final long serialVersionUID = 1L;

	private Object actualData;

	public ConcurrentUpdateException(final String arg0) {

		super(arg0);
	}

	public ConcurrentUpdateException(final String arg0, final Throwable arg1) {

		super(arg0, arg1);
	}

	public Object getActualData() {

		return actualData;
	}

	public void setActualData(final Object actualData) {

		this.actualData = actualData;
	}
}
