import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ConfigureChecklisteComponent } from "./configure-checkliste.component";

@Injectable()
export class DeactivateConfigurationNavigationGuard implements CanDeactivate<ConfigureChecklisteComponent> {

    canDeactivate(component: ConfigureChecklisteComponent
        , _currentRoute: ActivatedRouteSnapshot
        , _currentState: RouterStateSnapshot
        , _nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {

        if (component.unsavedChanges) {
            return component.handleUnsavedChanges();
        }

        return true;
    }

}