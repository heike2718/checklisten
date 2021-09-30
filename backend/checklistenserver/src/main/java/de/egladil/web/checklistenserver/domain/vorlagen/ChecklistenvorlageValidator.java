// =====================================================
// Project: checklistenserver
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.checklistenserver.domain.vorlagen;

import java.util.ArrayList;
import java.util.List;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.commons_validation.StringLatinValidator;

/**
 * ChecklistenvorlageValidator
 */
public class ChecklistenvorlageValidator implements ConstraintValidator<ValidVorlage, Checklistenvorlage> {

	private static final Logger LOG = LoggerFactory.getLogger(ChecklistenvorlageValidator.class);

	private StringLatinValidator stringLatinValidator = new StringLatinValidator();

	@Override
	public boolean isValid(final Checklistenvorlage value, final ConstraintValidatorContext context) {

		if (value == null) {

			return true;
		}

		List<ChecklistenvorlageItem> invalidItems = new ArrayList<>();

		for (ChecklistenvorlageItem item : value.getItems()) {

			boolean valid = stringLatinValidator.isValid(item.getName(), context);

			if (!valid) {

				invalidItems.add(item);
			}
		}

		if (invalidItems.size() > 0) {

			if (invalidItems.size() == 1) {

				context.buildConstraintViolationWithTemplate("Checklistenvorlage.invalidItem");
			} else {

				context.buildConstraintViolationWithTemplate("Checklistenvorlage.invalidItems");
			}

			LOG.error("Validierungsfehler: ungültige Einträge = {}", StringUtils.join(invalidItems, ","));

			return false;
		}

		return true;

	}

}
