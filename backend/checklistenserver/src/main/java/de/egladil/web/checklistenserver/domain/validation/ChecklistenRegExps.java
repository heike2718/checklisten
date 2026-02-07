package de.egladil.web.checklistenserver.domain.validation;

public interface ChecklistenRegExps {

    String VALID_KUERZEL = "^[a-zA-Z0-9\\-]*$";

    String VALID_INPUT = "^[\\p{L}\\p{N}\\s\\-_,'\\.\\;\\(\\)\\+!\\?=\\>]+$";

    String INVALID_INPUT_SUFFIX = "Erlaubt sind Buchstaben, Ziffern, Leerzeichen, einfaches Hochkomma ', '-', '_', ',', '.', ';', '(', ')', '+', '!', '?', '=' und '>'";


}
