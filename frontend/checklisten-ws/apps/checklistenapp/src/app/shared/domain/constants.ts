import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

export type Checklistentyp = 'EINKAUFSLISTE' | 'PACKLISTE' | 'TODOS';
export type Modus = 'SCHROEDINGER' | 'CONFIGURATION' | 'EXECUTION';
export type ItemPosition = 'VORSCHLAG' | 'AUSGEWAEHLT';
export type ItemAction = 'EDIT' | 'TOGGLE';
export type EventType = 'VORLAGEITEM_REMOVED' | 'CHECKLISTEITEM_CLICKED' | 'CHECKLISTE_REMOVED';

export const modalOptions: NgbModalOptions = {
    backdrop:'static',
    centered:true,
    ariaLabelledBy: 'modal-basic-title'
};
