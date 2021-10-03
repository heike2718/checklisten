import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { EditVorlageComponent} from './edit-vorlage.component';
@Injectable()
export class DeactivateEditVorlageNavigationGuard implements CanDeactivate<EditVorlageComponent> {

    canDeactivate(component: EditVorlageComponent
        , _currentRoute: ActivatedRouteSnapshot
        , _currentState: RouterStateSnapshot
        , _nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
        return component.canDeactivate();
    }
}